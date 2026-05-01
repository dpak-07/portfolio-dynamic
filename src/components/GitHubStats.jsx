"use client";

import { motion } from "framer-motion";
import { FaGithub, FaStar, FaCodeBranch, FaFire } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { logSectionView } from "../utils/analytics";
import { useFirestoreData } from "@/hooks/useFirestoreData";

const DEFAULT_CONFIG = {
  username: "dpak-07",
  enabled: true,
  showContributions: true,
  showStreak: true,
  showStats: true,
};

const RATE_LIMIT_BACKOFF_MS = 60 * 60 * 1000;
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 12000;

const emptyStats = {
  totalCommits: "N/A",
  currentStreak: "N/A",
  longestStreak: "N/A",
  totalRepos: "N/A",
  totalStars: "N/A",
};

function getCacheKey(username) {
  return `github_stats_cache_${username}`;
}

function getRateLimitKey(username) {
  return `github_stats_rate_limit_until_${username}`;
}

function readCachedStats(username) {
  try {
    const raw = localStorage.getItem(getCacheKey(username));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.stats ? parsed.stats : null;
  } catch {
    return null;
  }
}

function writeCachedStats(username, stats) {
  try {
    localStorage.setItem(
      getCacheKey(username),
      JSON.stringify({ stats, updatedAt: Date.now() })
    );
  } catch {
    // ignore storage quota/private-mode failures
  }
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
      },
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export default function GitHubStats() {
  const { data: githubConfig } = useFirestoreData("portfolio", "githubStats");

  const config = useMemo(() => {
    const merged = { ...DEFAULT_CONFIG, ...(githubConfig || {}) };
    return {
      ...merged,
      username: String(merged.username || DEFAULT_CONFIG.username).trim(),
    };
  }, [githubConfig]);

  const [stats, setStats] = useState(() => {
    const cached = readCachedStats(DEFAULT_CONFIG.username);
    if (cached) {
      return {
        ...cached,
        loading: false,
        error: null,
      };
    }

    return {
      ...emptyStats,
      totalCommits: "...",
      currentStreak: "...",
      longestStreak: "...",
      totalRepos: "...",
      totalStars: "...",
      loading: true,
      error: null,
    };
  });

  const [imageVisible, setImageVisible] = useState({
    contributions: true,
    streak: true,
    summary: true,
  });

  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const loggedOnce = useRef(false);

  useEffect(() => {
    if (sectionInView && !loggedOnce.current) {
      logSectionView("github-stats");
      loggedOnce.current = true;
    }
  }, [sectionInView]);

  useEffect(() => {
    setImageVisible({
      contributions: true,
      streak: true,
      summary: true,
    });
  }, [config.username]);

  useEffect(() => {
    if (!config.enabled || !config.username) {
      setStats((prev) => ({ ...prev, loading: false }));
      return undefined;
    }

    let active = true;

    const applyRateLimitUntil = () => {
      try {
        localStorage.setItem(
          getRateLimitKey(config.username),
          String(Date.now() + RATE_LIMIT_BACKOFF_MS)
        );
      } catch {
        // ignore
      }
    };

    const fetchGitHubStats = async () => {
      const cachedStats = readCachedStats(config.username);
      const blockedUntil = Number(localStorage.getItem(getRateLimitKey(config.username)) || 0);

      if (blockedUntil > Date.now()) {
        if (!active) return;
        if (cachedStats) {
          setStats({
            ...cachedStats,
            loading: false,
            error: "GitHub API rate limited. Showing cached stats.",
          });
        } else {
          setStats({
            ...emptyStats,
            loading: false,
            error: "GitHub API rate limited. Try again later.",
          });
        }
        return;
      }

      try {
        if (cachedStats) {
          setStats({
            ...cachedStats,
            loading: true,
            error: null,
          });
        } else {
          setStats((prev) => ({ ...prev, loading: true, error: null }));
        }

        const userResponse = await fetchJson(`https://api.github.com/users/${config.username}`);
        if (userResponse.status === 403) {
          applyRateLimitUntil();
          throw new Error("GitHub API rate limit reached (403)");
        }
        if (!userResponse.ok) {
          throw new Error(`User fetch failed (${userResponse.status})`);
        }

        const userData = await userResponse.json();

        const reposResponse = await fetchJson(
          `https://api.github.com/users/${config.username}/repos?per_page=100&type=owner&sort=updated`
        );

        if (reposResponse.status === 403) {
          applyRateLimitUntil();
          throw new Error("GitHub API rate limit reached (403)");
        }
        if (!reposResponse.ok) {
          throw new Error(`Repo fetch failed (${reposResponse.status})`);
        }

        const repos = await reposResponse.json();
        const totalStars = repos.reduce(
          (acc, repo) => acc + (Number(repo.stargazers_count) || 0),
          0
        );

        let recentCommits = "N/A";
        let currentStreak = "N/A";
        let longestStreak = "N/A";

        const eventsResponse = await fetchJson(
          `https://api.github.com/users/${config.username}/events/public?per_page=100`
        );

        if (eventsResponse.ok) {
          const events = await eventsResponse.json();
          const pushEvents = events.filter((event) => event.type === "PushEvent").length;

          recentCommits =
            pushEvents > 50
              ? `${Math.floor(pushEvents / 10) * 10}+`
              : String(pushEvents);

          const eventDates = new Set(
            events.map((event) => new Date(event.created_at).toDateString())
          );

          let running = 0;
          let streakNow = 0;
          let streakMax = 0;
          const today = new Date();

          for (let i = 0; i < 30; i += 1) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const hasActivity = eventDates.has(checkDate.toDateString());

            if (hasActivity) {
              running += 1;
              if (i === running - 1) streakNow = running;
            } else {
              if (i === 0) streakNow = 0;
              running = 0;
            }

            if (running > streakMax) streakMax = running;
          }

          currentStreak = String(streakNow);
          longestStreak = String(streakMax);
        } else if (eventsResponse.status === 403) {
          applyRateLimitUntil();
        }

        const nextStats = {
          totalCommits: recentCommits,
          currentStreak,
          longestStreak,
          totalRepos: String(userData.public_repos ?? 0),
          totalStars: String(totalStars),
        };

        writeCachedStats(config.username, nextStats);

        if (!active) return;
        setStats({
          ...nextStats,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!active) return;

        const cached = readCachedStats(config.username);
        const message = error?.message || "Failed to load GitHub stats";

        if (cached) {
          setStats({
            ...cached,
            loading: false,
            error: message.includes("rate limit")
              ? "GitHub API rate limited. Showing cached stats."
              : message,
          });
        } else {
          setStats({
            ...emptyStats,
            loading: false,
            error: message,
          });
        }
      }
    };

    fetchGitHubStats();
    const interval = setInterval(fetchGitHubStats, REFRESH_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [config.enabled, config.username]);

  if (!config.enabled) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, duration: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const statCards = [
    { label: "Recent Commits", value: stats.totalCommits, Icon: FaCodeBranch },
    { label: "Day Streak", value: stats.currentStreak, Icon: FaFire },
    { label: "Repositories", value: stats.totalRepos, Icon: FaGithub },
    { label: "Stars Earned", value: stats.totalStars, Icon: FaStar },
  ];

  return (
    <section
      id="github-stats"
      ref={sectionRef}
      className="relative w-full overflow-hidden px-4 py-16 scroll-mt-24 sm:px-6 lg:px-8 lg:py-24"
    >
      <motion.div
        className="mx-auto w-full max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate={sectionInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-10 grid gap-5 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-faint)]">
              <FaGithub className="h-3.5 w-3.5" />
              GitHub Stats
            </div>
            <h2 className="portfolio-gradient-text text-4xl font-extrabold leading-tight sm:text-5xl">
              Code activity snapshot
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
              Repository activity, contribution history, and public profile signals from GitHub.
            </p>
            {stats.error && <p className="mt-3 text-sm text-[var(--color-muted)]">{stats.error}</p>}
          </div>

          <div className="portfolio-panel rounded-2xl p-4 sm:max-w-sm lg:ml-auto">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-faint)]">Profile</div>
            <div className="mt-1 flex items-center gap-3">
              <FaGithub className="h-7 w-7 text-[var(--color-text)]" />
              <div className="min-w-0">
                <div className="truncate text-xl font-black text-[var(--color-text)]">@{config.username}</div>
                <div className="text-sm text-[var(--color-muted)]">Public GitHub activity</div>
              </div>
            </div>
          </div>
        </motion.div>

        {config.showStats && (
          <motion.div variants={itemVariants} className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statCards.map(({ label, value, Icon }) => (
              <motion.div
                key={label}
                whileHover={{ y: -5 }}
                className="portfolio-panel rounded-2xl p-5 text-center"
              >
                <Icon className="mx-auto mb-4 h-7 w-7 text-[var(--color-text)]" />
                <div className="mb-1 text-3xl font-black text-[var(--color-text)] sm:text-4xl">
                  {stats.loading ? "..." : value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-faint)]">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {(config.showContributions || config.showStreak) && (
          <motion.div variants={itemVariants} className="portfolio-panel mb-8 rounded-2xl p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-[var(--color-text)]">Contribution Overview</h3>
                <p className="text-sm text-[var(--color-muted)]">A monochrome read of recent GitHub consistency.</p>
              </div>
              <a
                href={`https://github.com/${config.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-secondary-button hidden rounded-xl px-4 py-2 text-sm font-bold sm:inline-flex"
              >
                Open GitHub
              </a>
            </div>

            {config.showContributions && (
              <div className="w-full overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white p-4">
                {imageVisible.contributions ? (
                  <img
                    src={`https://ghchart.rshah.org/9ca3af/${config.username}`}
                    alt="GitHub Contributions"
                    className="mx-auto w-full max-w-5xl rounded-lg"
                    style={{ minWidth: "600px" }}
                    onError={() => setImageVisible((prev) => ({ ...prev, contributions: false }))}
                  />
                ) : (
                  <p className="text-center text-sm text-zinc-500">Contributions graph is temporarily unavailable.</p>
                )}
              </div>
            )}

            {config.showStreak && (
              <div className="mt-5 flex justify-center rounded-2xl border border-[var(--color-border)] bg-white p-4">
                {imageVisible.streak ? (
                  <img
                    src={`https://streak-stats.demolab.com/?user=${config.username}&hide_border=true&background=FFFFFF&ring=111827&fire=6B7280&currStreakLabel=111827&sideLabels=6B7280&currStreakNum=111827&sideNums=111827&dates=6B7280`}
                    alt="GitHub Streak"
                    className="max-w-full rounded-lg"
                    onError={() => setImageVisible((prev) => ({ ...prev, streak: false }))}
                  />
                ) : (
                  <p className="text-center text-sm text-zinc-500">Streak card is temporarily unavailable.</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="portfolio-panel flex justify-center rounded-2xl bg-white p-4">
            {imageVisible.summary ? (
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${config.username}&show_icons=true&hide_border=true&bg_color=ffffff&title_color=111827&icon_color=6b7280&text_color=4b5563&count_private=true`}
                alt="GitHub Stats"
                className="max-w-full rounded-lg"
                onError={() => setImageVisible((prev) => ({ ...prev, summary: false }))}
              />
            ) : (
              <div className="rounded-xl border border-[var(--color-border)] px-6 py-4 text-sm text-zinc-600">
                GitHub summary card is temporarily unavailable.
              </div>
            )}
          </div>

          <a
            href={`https://github.com/${config.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-primary-button inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-bold"
          >
            View GitHub <span aria-hidden="true">-&gt;</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
