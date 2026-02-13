"use client";

import { motion } from "framer-motion";
import { FaGithub, FaStar, FaCodeBranch, FaFire } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { logSectionView } from "../utils/analytics";

const GITHUB_USERNAME = "dpak-07";

export default function GitHubStats() {
    const [stats, setStats] = useState({
        totalCommits: "...",
        currentStreak: "...",
        longestStreak: "...",
        totalRepos: "...",
        totalStars: "...",
        loading: true,
        error: null,
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
        // Fetch real-time GitHub stats
        const fetchGitHubStats = async () => {
            try {
                setStats(prev => ({ ...prev, loading: true, error: null }));

                // Fetch user data
                const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
                if (!userResponse.ok) throw new Error('Failed to fetch user data');
                const userData = await userResponse.json();

                // Fetch all repos (handle pagination)
                let allRepos = [];
                let page = 1;
                let hasMore = true;

                while (hasMore && page <= 10) { // Limit to 10 pages (1000 repos max)
                    const reposResponse = await fetch(
                        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`
                    );
                    if (!reposResponse.ok) throw new Error('Failed to fetch repos');
                    const repos = await reposResponse.json();

                    if (repos.length === 0) {
                        hasMore = false;
                    } else {
                        allRepos = [...allRepos, ...repos];
                        page++;
                    }
                }

                // Calculate total stars
                const totalStars = allRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

                // Fetch events to calculate commits (approximate from recent activity)
                const eventsResponse = await fetch(
                    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`
                );
                const events = eventsResponse.ok ? await eventsResponse.json() : [];

                // Count push events as proxy for recent commits
                const recentCommits = events.filter(e => e.type === 'PushEvent').length;

                // Calculate streak from events (simplified)
                let currentStreak = 0;
                let longestStreak = 0;
                let tempStreak = 0;
                const today = new Date();
                const eventDates = new Set();

                events.forEach(event => {
                    const eventDate = new Date(event.created_at).toDateString();
                    eventDates.add(eventDate);
                });

                // Simple streak calculation (last 30 days)
                for (let i = 0; i < 30; i++) {
                    const checkDate = new Date(today);
                    checkDate.setDate(today.getDate() - i);
                    const dateStr = checkDate.toDateString();

                    if (eventDates.has(dateStr)) {
                        tempStreak++;
                        if (i === 0 || tempStreak > 0) currentStreak = tempStreak;
                    } else if (i === 0) {
                        break; // Current streak broken
                    }

                    longestStreak = Math.max(longestStreak, tempStreak);
                }

                setStats({
                    totalCommits: recentCommits > 50 ? `${Math.floor(recentCommits / 10) * 10}+` : recentCommits.toString(),
                    currentStreak: currentStreak.toString(),
                    longestStreak: longestStreak.toString(),
                    totalRepos: userData.public_repos,
                    totalStars: totalStars,
                    loading: false,
                    error: null,
                });

            } catch (error) {
                console.error("Error fetching GitHub stats:", error);
                setStats({
                    totalCommits: "N/A",
                    currentStreak: "N/A",
                    longestStreak: "N/A",
                    totalRepos: "N/A",
                    totalStars: "N/A",
                    loading: false,
                    error: error.message,
                });
            }
        };

        fetchGitHubStats();

        // Refresh every 5 minutes
        const interval = setInterval(fetchGitHubStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

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
            {/* Background Effects */}

            <motion.div
                className="w-full max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate={sectionInView ? "visible" : "hidden"}
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyansoft mb-4 font-mono">
                        CODING_STATS
                    </h2>
                    <div className="h-1 w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
                </motion.div>

                {/* GitHub Contributions Graph */}
                <motion.div
                    variants={itemVariants}
                    className="mb-12 bg-gray-900/50 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 sm:p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FaGithub className="text-cyan-400 text-2xl" />
                        <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">GITHUB</h3>
                    </div>

                    {/* Contributions Graph - Using GitHub Readme Stats */}
                    <div className="w-full overflow-x-auto">
                        <img
                            src={`https://ghchart.rshah.org/00e5ff/${GITHUB_USERNAME}`}
                            alt="GitHub Contributions"
                            className="w-full max-w-4xl mx-auto rounded-lg"
                            style={{ minWidth: "600px" }}
                        />
                    </div>

                    {/* Alternative: GitHub Streak Stats */}
                    <div className="mt-6 flex justify-center">
                        <img
                            src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&theme=dark&hide_border=true&background=0D1117&ring=00E5FF&fire=00E5FF&currStreakLabel=00E5FF&sideLabels=00E5FF&currStreakNum=FFFFFF&sideNums=FFFFFF&dates=8B949E`}
                            alt="GitHub Streak"
                            className="rounded-lg max-w-full"
                        />
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
                >
                    {/* Total Commits */}
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

                    {/* Current Streak */}
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

                    {/* Total Repos */}
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

                    {/* Total Stars */}
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

                {/* GitHub Profile Link */}
                <motion.div variants={itemVariants} className="text-center">
                    <a
                        href={`https://github.com/${GITHUB_USERNAME}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                        style={{
                            boxShadow: "0 0 30px rgba(0, 255, 255, 0.4)",
                        }}
                    >
                        VIEW_GH <span className="text-2xl">→</span>
                    </a>
                </motion.div>

                {/* GitHub Stats Image */}
                <motion.div variants={itemVariants} className="mt-12 flex justify-center">
                    <img
                        src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=dark&hide_border=true&bg_color=0D1117&title_color=00E5FF&icon_color=00E5FF&text_color=FFFFFF&count_private=true`}
                        alt="GitHub Stats"
                        className="rounded-lg max-w-full"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
