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

  const [stats, setStats] = useState({
    ...emptyStats,
    totalCommits: "...",
    currentStreak: "...",
    longestStreak: "...",
    totalRepos: "...",
    totalStars: "...",
    loading: true,
    error: null,
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
        setStats((prev) => ({ ...prev, loading: true, error: null }));

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

  return (
    <section
      id="github-stats"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <motion.div
        className="w-full max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={sectionInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyansoft mb-4 font-mono">
            CODING_STATS
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
          {stats.error && <p className="mt-3 text-sm text-red-400">{stats.error}</p>}
        </motion.div>

        {(config.showContributions || config.showStreak) && (
          <motion.div
            variants={itemVariants}
            className="mb-12 bg-gray-900/50 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaGithub className="text-cyan-400 text-2xl" />
              <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">GITHUB</h3>
            </div>

            {config.showContributions && (
              <div className="w-full overflow-x-auto">
                {imageVisible.contributions ? (
                  <img
                    src={`https://ghchart.rshah.org/00e5ff/${config.username}`}
                    alt="GitHub Contributions"
                    className="w-full max-w-4xl mx-auto rounded-lg"
                    style={{ minWidth: "600px" }}
                    onError={() =>
                      setImageVisible((prev) => ({ ...prev, contributions: false }))
                    }
                  />
                ) : (
                  <p className="text-center text-gray-400">Contributions graph is temporarily unavailable.</p>
                )}
              </div>
            )}

            {config.showStreak && (
              <div className="mt-6 flex justify-center">
                {imageVisible.streak ? (
                  <img
                    src={`https://streak-stats.demolab.com/?user=${config.username}&theme=dark&hide_border=true&background=0D1117&ring=00E5FF&fire=00E5FF&currStreakLabel=00E5FF&sideLabels=00E5FF&currStreakNum=FFFFFF&sideNums=FFFFFF&dates=8B949E`}
                    alt="GitHub Streak"
                    className="rounded-lg max-w-full"
                    onError={() => setImageVisible((prev) => ({ ...prev, streak: false }))}
                  />
                ) : (
                  <p className="text-center text-gray-400">Streak card is temporarily unavailable.</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {config.showStats && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 text-center"
            >
              <FaCodeBranch className="text-cyan-400 text-3xl mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.loading ? "..." : stats.totalCommits}
              </div>
              <div className="text-sm text-gray-400 font-mono">Total Commits</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 text-center"
            >
              <FaFire className="text-orange-400 text-3xl mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.loading ? "..." : stats.currentStreak}
              </div>
              <div className="text-sm text-gray-400 font-mono">Day Streak</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 text-center"
            >
              <FaGithub className="text-cyan-400 text-3xl mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.loading ? "..." : stats.totalRepos}
              </div>
              <div className="text-sm text-gray-400 font-mono">Repositories</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 text-center"
            >
              <FaStar className="text-yellow-400 text-3xl mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {stats.loading ? "..." : stats.totalStars}
              </div>
              <div className="text-sm text-gray-400 font-mono">Stars Earned</div>
            </motion.div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="text-center">
          <a
            href={`https://github.com/${config.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            style={{
              boxShadow: "0 0 30px rgba(0, 255, 255, 0.4)",
            }}
          >
            VIEW_GH <span className="text-2xl">-&gt;</span>
          </a>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex justify-center">
          {imageVisible.summary ? (
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${config.username}&show_icons=true&theme=dark&hide_border=true&bg_color=0D1117&title_color=00E5FF&icon_color=00E5FF&text_color=FFFFFF&count_private=true`}
              alt="GitHub Stats"
              className="rounded-lg max-w-full"
              onError={() => setImageVisible((prev) => ({ ...prev, summary: false }))}
            />
          ) : (
            <div className="rounded-lg border border-cyan-400/20 bg-gray-900/40 px-6 py-4 text-gray-300">
              GitHub summary card is temporarily unavailable.
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
