"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAnalyticsData } from "../../utils/analytics";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Download,
  FileText,
  Users,
  Calendar,
  Clock,
  Activity,
  BarChart3,
  Zap,
  Target,
  Award,
  Sparkles,
  UserCheck,
  UserPlus,
} from "lucide-react";

export default function AnalysisDashboard() {
  const [data, setData] = useState({
    totalsData: {},
    usersData: {},
    sectionData: {},
    linkData: {},
    dailyArr: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("week");
  const [chartType, setChartType] = useState("area");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    setRefreshing(true);
    const result = await getAnalyticsData();
    setData(result);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { totalsData, usersData, sectionData, linkData, dailyArr } = data;

  const filteredDaily =
    viewMode === "week"
      ? dailyArr.slice(-7)
      : viewMode === "month"
      ? dailyArr.slice(-30)
      : dailyArr;

  // Calculate insights
  const calculateInsights = () => {
    const recent = dailyArr.slice(-7);
    const avgViews = recent.reduce((sum, d) => sum + (d.views || 0), 0) / (recent.length || 1);
    const avgClicks = recent.reduce((sum, d) => sum + (d.clicks || 0), 0) / (recent.length || 1);
    const avgUsers = recent.reduce((sum, d) => sum + (d.uniqueUsers || 0), 0) / (recent.length || 1);
    const clickRate = totalsData.totalViews ? ((totalsData.totalClicks / totalsData.totalViews) * 100).toFixed(1) : 0;
    const downloadRate = totalsData.totalViews ? ((totalsData.totalDownloads / totalsData.totalViews) * 100).toFixed(1) : 0;

    return { avgViews, avgClicks, avgUsers, clickRate, downloadRate };
  };

  const insights = calculateInsights();

  // Top sections
  const topSections = Object.entries(sectionData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Top links
  const topLinks = Object.entries(linkData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Growth calculations
  const getGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const todayGrowth = getGrowth(usersData.uniqueToday, usersData.uniqueYesterday);
  const weekGrowth = getGrowth(usersData.uniqueThisWeek, usersData.uniqueLastWeek);
  const monthGrowth = getGrowth(usersData.uniqueThisMonth, usersData.uniqueLastMonth);

  // Radar chart data
  const radarData = [
    { metric: "Views", value: Math.min((totalsData.totalViews || 0) / 10, 100) },
    { metric: "Clicks", value: Math.min((totalsData.totalClicks || 0) / 5, 100) },
    { metric: "Downloads", value: Math.min((totalsData.totalDownloads || 0) / 2, 100) },
    { metric: "Resume", value: Math.min((totalsData.totalResumeOpens || 0) / 2, 100) },
    { metric: "Users", value: Math.min((usersData.uniqueOverall || 0) / 5, 100) },
  ];

  // User timeline data for graphs
  const userTimelineData = [
    { period: "Today", users: usersData.uniqueToday || 0, color: "#00D9FF" },
    { period: "Yesterday", users: usersData.uniqueYesterday || 0, color: "#A855F7" },
    { period: "This Week", users: usersData.uniqueThisWeek || 0, color: "#10B981" },
    { period: "Last Week", users: usersData.uniqueLastWeek || 0, color: "#F59E0B" },
    { period: "This Month", users: usersData.uniqueThisMonth || 0, color: "#EC4899" },
    { period: "Last Month", users: usersData.uniqueLastMonth || 0, color: "#8B5CF6" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6 border-4 border-cyan-500 border-t-transparent rounded-full"
          />
          <h2 className="text-3xl font-bold text-white mb-2">Loading Analytics</h2>
          <p className="text-gray-400">Fetching your data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                <Activity className="w-8 h-8 text-cyan-400" />
                Analytics Hub
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ""}
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {["overview", "users", "trends", "breakdown", "insights"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  icon={<Eye className="w-6 h-6" />}
                  label="Total Views"
                  value={totalsData.totalViews || 0}
                  color="from-cyan-500 to-blue-500"
                  subtitle={`${insights.avgViews.toFixed(0)} avg/day`}
                />
                <MetricCard
                  icon={<MousePointerClick className="w-6 h-6" />}
                  label="Total Clicks"
                  value={totalsData.totalClicks || 0}
                  color="from-purple-500 to-pink-500"
                  subtitle={`${insights.clickRate}% click rate`}
                />
                <MetricCard
                  icon={<Download className="w-6 h-6" />}
                  label="Downloads"
                  value={totalsData.totalDownloads || 0}
                  color="from-emerald-500 to-teal-500"
                  subtitle={`${insights.downloadRate}% conversion`}
                />
                <MetricCard
                  icon={<FileText className="w-6 h-6" />}
                  label="Resume Opens"
                  value={totalsData.totalResumeOpens || 0}
                  color="from-orange-500 to-red-500"
                  subtitle="Document views"
                />
              </div>

              {/* User Stats Quick View */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickUserStat label="Today" value={usersData.uniqueToday} growth={todayGrowth} />
                <QuickUserStat label="Yesterday" value={usersData.uniqueYesterday} />
                <QuickUserStat label="This Week" value={usersData.uniqueThisWeek} growth={weekGrowth} />
                <QuickUserStat label="This Month" value={usersData.uniqueThisMonth} growth={monthGrowth} />
              </div>

              {/* Performance Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Performance Overview" icon={<Target className="w-5 h-5" />}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="metric" stroke="#999" />
                      <PolarRadiusAxis stroke="#999" />
                      <Radar
                        dataKey="value"
                        stroke="#00D9FF"
                        fill="#00D9FF"
                        fillOpacity={0.4}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a2e",
                          border: "1px solid #00D9FF",
                          borderRadius: "8px",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <InsightsCard
                  clickRate={insights.clickRate}
                  downloadRate={insights.downloadRate}
                  weekGrowth={weekGrowth}
                  monthGrowth={monthGrowth}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* User Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <UserCard
                  label="Today"
                  value={usersData.uniqueToday}
                  comparison={usersData.uniqueYesterday}
                  growth={todayGrowth}
                  icon={<UserCheck className="w-5 h-5" />}
                  color="from-cyan-500 to-blue-500"
                />
                <UserCard
                  label="Yesterday"
                  value={usersData.uniqueYesterday}
                  icon={<Clock className="w-5 h-5" />}
                  color="from-purple-500 to-pink-500"
                />
                <UserCard
                  label="This Week"
                  value={usersData.uniqueThisWeek}
                  comparison={usersData.uniqueLastWeek}
                  growth={weekGrowth}
                  icon={<Calendar className="w-5 h-5" />}
                  color="from-emerald-500 to-teal-500"
                />
                <UserCard
                  label="This Month"
                  value={usersData.uniqueThisMonth}
                  comparison={usersData.uniqueLastMonth}
                  growth={monthGrowth}
                  icon={<Users className="w-5 h-5" />}
                  color="from-orange-500 to-red-500"
                />
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ComparisonCard
                  title="Weekly Comparison"
                  current={usersData.uniqueThisWeek}
                  previous={usersData.uniqueLastWeek}
                  currentLabel="This Week"
                  previousLabel="Last Week"
                  growth={weekGrowth}
                />
                <ComparisonCard
                  title="Monthly Comparison"
                  current={usersData.uniqueThisMonth}
                  previous={usersData.uniqueLastMonth}
                  currentLabel="This Month"
                  previousLabel="Last Month"
                  growth={monthGrowth}
                />
                <ComparisonCard
                  title="Daily Comparison"
                  current={usersData.uniqueToday}
                  previous={usersData.uniqueYesterday}
                  currentLabel="Today"
                  previousLabel="Yesterday"
                  growth={todayGrowth}
                />
              </div>

              {/* User Timeline Chart */}
              <ChartCard title="User Timeline" icon={<BarChart3 className="w-5 h-5" />}>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={userTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="period" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #00D9FF",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="users" radius={[8, 8, 0, 0]}>
                      {userTimelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Daily User Trend */}
              <ChartCard title="Daily User Trend" icon={<TrendingUp className="w-5 h-5" />}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={filteredDaily}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #00D9FF",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="uniqueUsers"
                      stroke="#00D9FF"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      name="Unique Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 backdrop-blur-sm p-6">
                  <Users className="w-8 h-8 text-cyan-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Total Unique Users</p>
                  <p className="text-4xl font-bold text-white">{usersData.uniqueOverall || 0}</p>
                  <p className="text-xs text-gray-500 mt-2">All time</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm p-6">
                  <Activity className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Avg Daily Users</p>
                  <p className="text-4xl font-bold text-white">{insights.avgUsers.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm p-6">
                  <UserPlus className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Active Days</p>
                  <p className="text-4xl font-bold text-white">{dailyArr.length}</p>
                  <p className="text-xs text-gray-500 mt-2">Total tracking days</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "trends" && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* View Mode Selector */}
              <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="flex gap-2">
                  {["week", "month", "all"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === mode
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {mode === "week" ? "7 Days" : mode === "month" ? "30 Days" : "All Time"}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  {["area", "line", "bar"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setChartType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        chartType === type
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Trend Chart */}
              <ChartCard title="Activity Trends" icon={<TrendingUp className="w-5 h-5" />}>
                <ResponsiveContainer width="100%" height={400}>
                  {chartType === "area" ? (
                    <AreaChart data={filteredDaily}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #00D9FF",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#00D9FF"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#A855F7"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  ) : chartType === "line" ? (
                    <LineChart data={filteredDaily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #00D9FF",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#00D9FF" strokeWidth={3} />
                      <Line type="monotone" dataKey="clicks" stroke="#A855F7" strokeWidth={3} />
                      <Line type="monotone" dataKey="downloads" stroke="#10B981" strokeWidth={3} />
                      <Line type="monotone" dataKey="resumeOpens" stroke="#F59E0B" strokeWidth={3} />
                    </LineChart>
                  ) : (
                    <BarChart data={filteredDaily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #00D9FF",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="views" fill="#00D9FF" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="clicks" fill="#A855F7" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </ChartCard>

              {/* Comparison Chart */}
              <ChartCard title="Metrics Comparison" icon={<BarChart3 className="w-5 h-5" />}>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={filteredDaily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #00D9FF",
                        borderRadius: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="downloads" fill="#10B981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="resumeOpens" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                    <Line type="monotone" dataKey="clicks" stroke="#A855F7" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>
          )}

          {activeTab === "breakdown" && (
            <motion.div
              key="breakdown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Top Sections */}
              <ChartCard title="Top Sections" icon={<Award className="w-5 h-5" />}>
                <div className="space-y-3">
                  {topSections.length > 0 ? (
                    topSections.map((section, index) => (
                      <RankingBar
                        key={section.name}
                        rank={index + 1}
                        name={section.name}
                        value={section.value}
                        max={topSections[0]?.value || 1}
                        color={`hsl(${190 + index * 20}, 70%, 50%)`}
                      />
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-8">No section data available</p>
                  )}
                </div>
              </ChartCard>

              {/* Top Links */}
              <ChartCard title="Top Links" icon={<Zap className="w-5 h-5" />}>
                <div className="space-y-3">
                  {topLinks.length > 0 ? (
                    topLinks.map((link, index) => (
                      <RankingBar
                        key={link.name}
                        rank={index + 1}
                        name={link.name}
                        value={link.value}
                        max={topLinks[0]?.value || 1}
                        color={`hsl(${270 + index * 20}, 70%, 50%)`}
                      />
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-8">No link data available</p>
                  )}
                </div>
              </ChartCard>

              {/* Daily Breakdown Table */}
              <ChartCard title="Daily Breakdown" icon={<Calendar className="w-5 h-5" />}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                        <th className="px-4 py-3 text-center font-semibold text-cyan-400">Views</th>
                        <th className="px-4 py-3 text-center font-semibold text-purple-400">Clicks</th>
                        <th className="px-4 py-3 text-center font-semibold text-emerald-400">Downloads</th>
                        <th className="px-4 py-3 text-center font-semibold text-orange-400">Resume</th>
                        <th className="px-4 py-3 text-center font-semibold text-blue-400">Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDaily.length > 0 ? (
                        filteredDaily.slice().reverse().map((day, i) => (
                          <motion.tr
                            key={day.date}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium">{day.date}</td>
                            <td className="px-4 py-3 text-center text-cyan-400">{day.views || 0}</td>
                            <td className="px-4 py-3 text-center text-purple-400">{day.clicks || 0}</td>
                            <td className="px-4 py-3 text-center text-emerald-400">{day.downloads || 0}</td>
                            <td className="px-4 py-3 text-center text-orange-400">{day.resumeOpens || 0}</td>
                            <td className="px-4 py-3 text-center text-blue-400">{day.uniqueUsers || 0}</td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-400">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InsightCard
                  icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
                  title="Engagement Rate"
                  value={`${insights.clickRate}%`}
                  description="Visitors who clicked on at least one link"
                  trend={parseFloat(insights.clickRate) > 10 ? "positive" : "neutral"}
                />
                <InsightCard
                  icon={<Target className="w-6 h-6 text-cyan-400" />}
                  title="Conversion Rate"
                  value={`${insights.downloadRate}%`}
                  description="Visitors who downloaded content"
                  trend={parseFloat(insights.downloadRate) > 5 ? "positive" : "neutral"}
                />
                <InsightCard
                  icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                  title="Weekly Growth"
                  value={`${Math.abs(weekGrowth)}%`}
                  description="Change in unique visitors (week over week)"
                  trend={weekGrowth > 0 ? "positive" : weekGrowth < 0 ? "negative" : "neutral"}
                />
                <InsightCard
                  icon={<Activity className="w-6 h-6 text-purple-400" />}
                  title="Daily Average"
                  value={insights.avgViews.toFixed(0)}
                  description="Average views per day (last 7 days)"
                  trend="neutral"
                />
              </div>

              <ChartCard title="Performance Summary" icon={<Award className="w-5 h-5" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-cyan-400">Top Performing</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Most Viewed Section</span>
                        <span className="font-bold text-cyan-400">{topSections[0]?.name || "N/A"}</span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Most Clicked Link</span>
                        <span className="font-bold text-purple-400">{topLinks[0]?.name || "N/A"}</span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Best Day</span>
                        <span className="font-bold text-emerald-400">
                          {dailyArr.length ? dailyArr.reduce((max, d) => d.views > max.views ? d : max).date : "N/A"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-orange-400">Key Metrics</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Total Interactions</span>
                        <span className="font-bold text-orange-400">
                          {(totalsData.totalClicks || 0) + (totalsData.totalDownloads || 0)}
                        </span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Active Days</span>
                        <span className="font-bold text-pink-400">{dailyArr.length}</span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Avg. Daily Users</span>
                        <span className="font-bold text-blue-400">{insights.avgUsers.toFixed(1)}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ChartCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ===== Components ===== */
import { Cell } from "recharts";

function MetricCard({ icon, label, value, color, subtitle }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function QuickUserStat({ label, value, growth }) {
  const hasGrowth = growth !== undefined;
  const isPositive = growth > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm p-4"
    >
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value || 0}</p>
      {hasGrowth && (
        <span className={`flex items-center gap-1 text-xs font-semibold mt-1 ${
          isPositive ? "text-emerald-400" : "text-red-400"
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(growth)}%
        </span>
      )}
    </motion.div>
  );
}

function UserCard({ label, value, comparison, growth, icon, color }) {
  const isPositive = growth > 0;
  const hasGrowth = growth !== undefined;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`rounded-2xl bg-gradient-to-br ${color.replace('to', 'via')}/10 border border-white/10 backdrop-blur-sm p-6 relative overflow-hidden`}
    >
      <div className={`absolute top-4 right-4 w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
      <p className="text-4xl font-bold text-white mb-2">{value || 0}</p>
      {hasGrowth && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">vs {comparison || 0}</span>
          <span className={`flex items-center gap-1 text-sm font-semibold ${
            isPositive ? "text-emerald-400" : "text-red-400"
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(growth)}%
          </span>
        </div>
      )}
    </motion.div>
  );
}

function ComparisonCard({ title, current, previous, currentLabel, previousLabel, growth }) {
  const isPositive = growth > 0;
  const max = Math.max(current || 0, previous || 0);
  const currentPercent = max > 0 ? (current / max) * 100 : 0;
  const previousPercent = max > 0 ? (previous / max) * 100 : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{currentLabel}</span>
            <span className="text-xl font-bold text-cyan-400">{current || 0}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentPercent}%` }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{previousLabel}</span>
            <span className="text-xl font-bold text-gray-500">{previous || 0}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${previousPercent}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/20 h-2 rounded-full"
            />
          </div>
        </div>
        <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
          isPositive ? "bg-emerald-500/20 text-emerald-400" : growth < 0 ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
        }`}>
          {isPositive ? <TrendingUp className="w-5 h-5" /> : growth < 0 ? <TrendingDown className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
          <span className="font-bold">{isPositive ? "+" : ""}{growth}% change</span>
        </div>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InsightsCard({ clickRate, downloadRate, weekGrowth, monthGrowth }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold">Quick Insights</h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Click-Through Rate</span>
            <span className="text-2xl font-bold text-purple-400">{clickRate}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${Math.min(clickRate, 100)}%` }} />
          </div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Download Rate</span>
            <span className="text-2xl font-bold text-cyan-400">{downloadRate}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: `${Math.min(downloadRate, 100)}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-xs text-gray-400 mb-1">Week Growth</p>
            <p className={`text-xl font-bold ${weekGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {weekGrowth >= 0 ? "+" : ""}{weekGrowth}%
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-xs text-gray-400 mb-1">Month Growth</p>
            <p className={`text-xl font-bold ${monthGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {monthGrowth >= 0 ? "+" : ""}{monthGrowth}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RankingBar({ rank, name, value, max, color }) {
  const percentage = (value / max) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="flex items-center gap-3"
    >
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm" style={{ color }}>
        {rank}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-300">{name}</span>
          <span className="text-sm font-bold" style={{ color }}>{value}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: rank * 0.1 }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function InsightCard({ icon, title, value, description, trend }) {
  const trendColors = {
    positive: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    negative: "from-red-500/20 to-orange-500/20 border-red-500/30",
    neutral: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`rounded-2xl bg-gradient-to-br ${trendColors[trend]} border backdrop-blur-sm p-6`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
          {icon}
        </div>
        {trend === "positive" && <TrendingUp className="w-5 h-5 text-emerald-400" />}
        {trend === "negative" && <TrendingDown className="w-5 h-5 text-red-400" />}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-4xl font-bold text-white mb-2">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </motion.div>
  );
}