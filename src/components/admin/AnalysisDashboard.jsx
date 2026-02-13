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
  PieChart,
  Pie,
  Cell,
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
  Smartphone,
  Monitor,
  Globe,
  Link2,
  BookOpen,
  Timer,
  AlertCircle,
} from "lucide-react";

export default function AnalysisDashboard() {
  const [data, setData] = useState({
    totalsData: {},
    usersData: {},
    sectionData: {},
    linkData: {},
    dailyArr: [],
    devicesData: {},
    trafficData: {},
    blogData: {},
    performanceData: {},
    errorsData: {},
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

  const { totalsData, usersData, sectionData, linkData, dailyArr, devicesData, trafficData, blogData, performanceData, errorsData } = data;

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

  // Device data
  const COLORS = ["#00D9FF", "#A855F7", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];
  
  const browserData = devicesData?.browsers 
    ? Object.entries(devicesData.browsers).map(([name, value]) => ({ name, value }))
    : [];
  
  const osData = devicesData?.os 
    ? Object.entries(devicesData.os).map(([name, value]) => ({ name, value }))
    : [];
  
  const deviceTypeData = devicesData?.deviceTypes 
    ? Object.entries(devicesData.deviceTypes).map(([name, value]) => ({ name, value }))
    : [];

  // Traffic data
  const trafficSourceData = trafficData?.sources 
    ? Object.entries(trafficData.sources).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
    : [];

  const trafficMediumData = trafficData?.mediums 
    ? Object.entries(trafficData.mediums).map(([name, value]) => ({ name, value }))
    : [];

  const trafficCampaignData = trafficData?.campaigns 
    ? Object.entries(trafficData.campaigns).map(([name, value]) => ({ name, value }))
    : [];

  // Blog data
  const blogPostsData = Object.entries(blogData || {})
    .filter(([key]) => key !== "lastUpdated")
    .map(([slug, data]) => ({
      slug,
      title: data.title || slug,
      views: data.views || 0,
      likes: data.likes || 0,
      totalReadTime: data.totalReadTime || 0,
      readCount: data.readCount || 0,
      avgReadTime: data.readCount ? Math.floor(data.totalReadTime / data.readCount) : 0,
      engagementRate: data.views ? ((data.likes / data.views) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  // Performance data
  const pageLoadData = performanceData?.pageLoads 
    ? Object.entries(performanceData.pageLoads).map(([name, data]) => ({
        name,
        count: data.count || 0,
        avgTime: data.count ? Math.floor(data.totalTime / data.count) : 0,
      }))
    : [];

  const pageDurationData = performanceData?.pageDurations 
    ? Object.entries(performanceData.pageDurations).map(([name, data]) => ({
        name,
        count: data.count || 0,
        avgDuration: data.count ? Math.floor(data.totalTime / data.count / 1000) : 0,
      }))
    : [];

  // Errors data
  const errorsArray = Object.entries(errorsData || {})
    .filter(([key]) => key.startsWith("error_"))
    .map(([id, error]) => ({
      id,
      message: error.message,
      component: error.component,
      userAgent: error.userAgent,
      timestamp: error.timestamp,
    }))
    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
    .slice(0, 20);

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
            {["overview", "users", "trends", "breakdown", "devices", "traffic", "blog", "performance", "errors", "insights"].map((tab) => (
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

          {activeTab === "devices" && (
            <motion.div
              key="devices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Device Type Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Device Types" icon={<Smartphone className="w-5 h-5" />}>
                  {deviceTypeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={deviceTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {deviceTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #00D9FF",
                            borderRadius: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-center py-16">No device data</p>
                  )}
                </ChartCard>

                <ChartCard title="Browsers" icon={<Globe className="w-5 h-5" />}>
                  {browserData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={browserData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {browserData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #00D9FF",
                            borderRadius: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-center py-16">No browser data</p>
                  )}
                </ChartCard>

                <ChartCard title="Operating Systems" icon={<Monitor className="w-5 h-5" />}>
                  {osData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={osData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {osData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #00D9FF",
                            borderRadius: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-center py-16">No OS data</p>
                  )}
                </ChartCard>
              </div>

              {/* Detailed Device Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm p-6">
                  <Smartphone className="w-8 h-8 text-cyan-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Most Used Device</p>
                  <p className="text-3xl font-bold text-white">
                    {deviceTypeData.length > 0 ? deviceTypeData.sort((a, b) => b.value - a.value)[0].name : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {deviceTypeData.length > 0 ? `${deviceTypeData.sort((a, b) => b.value - a.value)[0].value} visits` : ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm p-6">
                  <Globe className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Most Used Browser</p>
                  <p className="text-3xl font-bold text-white">
                    {browserData.length > 0 ? browserData.sort((a, b) => b.value - a.value)[0].name : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {browserData.length > 0 ? `${browserData.sort((a, b) => b.value - a.value)[0].value} visits` : ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm p-6">
                  <Monitor className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Most Used OS</p>
                  <p className="text-3xl font-bold text-white">
                    {osData.length > 0 ? osData.sort((a, b) => b.value - a.value)[0].name : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {osData.length > 0 ? `${osData.sort((a, b) => b.value - a.value)[0].value} visits` : ""}
                  </p>
                </div>
              </div>

              {/* Bar Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Browser Distribution" icon={<Globe className="w-5 h-5" />}>
                  {browserData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={browserData.sort((a, b) => b.value - a.value)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #00D9FF",
                            borderRadius: "12px",
                          }}
                        />
                        <Bar dataKey="value" fill="#00D9FF" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-center py-16">No data</p>
                  )}
                </ChartCard>

                <ChartCard title="OS Distribution" icon={<Monitor className="w-5 h-5" />}>
                  {osData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={osData.sort((a, b) => b.value - a.value)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #00D9FF",
                            borderRadius: "12px",
                          }}
                        />
                        <Bar dataKey="value" fill="#A855F7" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-400 text-center py-16">No data</p>
                  )}
                </ChartCard>
              </div>
            </motion.div>
          )}

          {activeTab === "traffic" && (
            <motion.div
              key="traffic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Traffic Sources */}
              <ChartCard title="Traffic Sources" icon={<Link2 className="w-5 h-5" />}>
                {trafficSourceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={trafficSourceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #00D9FF",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar dataKey="value" fill="#00D9FF" radius={[8, 8, 0, 0]}>
                        {trafficSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-16">No traffic data available</p>
                )}
              </ChartCard>

              {/* Top Traffic Source */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 backdrop-blur-sm p-6">
                  <Link2 className="w-8 h-8 text-cyan-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Top Traffic Source</p>
                  <p className="text-3xl font-bold text-white">
                    {trafficSourceData.length > 0 ? trafficSourceData[0].name : "Direct"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {trafficSourceData.length > 0 ? `${trafficSourceData[0].value} visits` : "No data"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm p-6">
                  <Globe className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Total Sources</p>
                  <p className="text-3xl font-bold text-white">{trafficSourceData.length}</p>
                  <p className="text-xs text-gray-500 mt-2">Unique traffic sources</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm p-6">
                  <Activity className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Total Visits</p>
                  <p className="text-3xl font-bold text-white">
                    {trafficSourceData.reduce((sum, item) => sum + item.value, 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">From all sources</p>
                </div>
              </div>

              {/* Medium & Campaign Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Traffic Mediums" icon={<Target className="w-5 h-5" />}>
                  {trafficMediumData.length > 0 ? (
                    <div className="space-y-3">
                      {trafficMediumData.map((medium, index) => (
                        <RankingBar
                          key={medium.name}
                          rank={index + 1}
                          name={medium.name}
                          value={medium.value}
                          max={trafficMediumData[0]?.value || 1}
                          color={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-16">No medium data</p>
                  )}
                </ChartCard>

                <ChartCard title="Campaigns" icon={<Zap className="w-5 h-5" />}>
                  {trafficCampaignData.length > 0 ? (
                    <div className="space-y-3">
                      {trafficCampaignData.map((campaign, index) => (
                        <RankingBar
                          key={campaign.name}
                          rank={index + 1}
                          name={campaign.name}
                          value={campaign.value}
                          max={trafficCampaignData[0]?.value || 1}
                          color={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-16">No campaign data</p>
                  )}
                </ChartCard>
              </div>
            </motion.div>
          )}

          {activeTab === "blog" && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Blog Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm p-6">
                  <BookOpen className="w-8 h-8 text-cyan-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Total Posts</p>
                  <p className="text-3xl font-bold text-white">{blogPostsData.length}</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm p-6">
                  <Eye className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-white">
                    {blogPostsData.reduce((sum, post) => sum + post.views, 0)}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm p-6">
                  <Sparkles className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Total Likes</p>
                  <p className="text-3xl font-bold text-white">
                    {blogPostsData.reduce((sum, post) => sum + post.likes, 0)}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-sm p-6">
                  <Timer className="w-8 h-8 text-orange-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Avg Read Time</p>
                  <p className="text-3xl font-bold text-white">
                    {blogPostsData.length > 0
                      ? Math.floor(
                          blogPostsData.reduce((sum, post) => sum + post.avgReadTime, 0) / blogPostsData.length
                        )
                      : 0}
                    s
                  </p>
                </div>
              </div>

              {/* Blog Posts Table */}
              <ChartCard title="Blog Post Analytics" icon={<BookOpen className="w-5 h-5" />}>
                {blogPostsData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Title</th>
                          <th className="px-4 py-3 text-center font-semibold text-cyan-400">Views</th>
                          <th className="px-4 py-3 text-center font-semibold text-purple-400">Likes</th>
                          <th className="px-4 py-3 text-center font-semibold text-emerald-400">Reads</th>
                          <th className="px-4 py-3 text-center font-semibold text-orange-400">Avg Time</th>
                          <th className="px-4 py-3 text-center font-semibold text-pink-400">Engagement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogPostsData.map((post, i) => (
                          <motion.tr
                            key={post.slug}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                            <td className="px-4 py-3 text-center text-cyan-400">{post.views}</td>
                            <td className="px-4 py-3 text-center text-purple-400">{post.likes}</td>
                            <td className="px-4 py-3 text-center text-emerald-400">{post.readCount}</td>
                            <td className="px-4 py-3 text-center text-orange-400">{post.avgReadTime}s</td>
                            <td className="px-4 py-3 text-center text-pink-400">{post.engagementRate}%</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-16">No blog data available</p>
                )}
              </ChartCard>

              {/* Top Posts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Most Viewed Posts" icon={<Eye className="w-5 h-5" />}>
                  {blogPostsData.length > 0 ? (
                    <div className="space-y-3">
                      {blogPostsData.slice(0, 5).map((post, index) => (
                        <RankingBar
                          key={post.slug}
                          rank={index + 1}
                          name={post.title}
                          value={post.views}
                          max={blogPostsData[0]?.views || 1}
                          color={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No data</p>
                  )}
                </ChartCard>

                <ChartCard title="Most Liked Posts" icon={<Sparkles className="w-5 h-5" />}>
                  {blogPostsData.length > 0 ? (
                    <div className="space-y-3">
                      {blogPostsData
                        .sort((a, b) => b.likes - a.likes)
                        .slice(0, 5)
                        .map((post, index) => (
                          <RankingBar
                            key={post.slug}
                            rank={index + 1}
                            name={post.title}
                            value={post.likes}
                            max={blogPostsData.sort((a, b) => b.likes - a.likes)[0]?.likes || 1}
                            color={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No data</p>
                  )}
                </ChartCard>
              </div>
            </motion.div>
          )}

          {activeTab === "performance" && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Page Load Performance */}
              <ChartCard title="Page Load Times" icon={<Zap className="w-5 h-5" />}>
                {pageLoadData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={pageLoadData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #00D9FF",
                          borderRadius: "12px",
                        }}
                        formatter={(value, name) => {
                          if (name === "avgTime") return [`${value}ms`, "Avg Load Time"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="#00D9FF" radius={[8, 8, 0, 0]} name="Load Count" />
                      <Bar dataKey="avgTime" fill="#A855F7" radius={[8, 8, 0, 0]} name="Avg Time (ms)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-16">No performance data available</p>
                )}
              </ChartCard>

              {/* Page Duration */}
              <ChartCard title="Page Visit Duration" icon={<Timer className="w-5 h-5" />}>
                {pageDurationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={pageDurationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #00D9FF",
                          borderRadius: "12px",
                        }}
                        formatter={(value, name) => {
                          if (name === "avgDuration") return [`${value}s`, "Avg Duration"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} name="Visit Count" />
                      <Bar dataKey="avgDuration" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Avg Duration (s)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-400 text-center py-16">No duration data available</p>
                )}
              </ChartCard>

              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm p-6">
                  <Zap className="w-8 h-8 text-cyan-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Fastest Page</p>
                  <p className="text-2xl font-bold text-white">
                    {pageLoadData.length > 0
                      ? pageLoadData.sort((a, b) => a.avgTime - b.avgTime)[0].name
                      : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {pageLoadData.length > 0
                      ? `${pageLoadData.sort((a, b) => a.avgTime - b.avgTime)[0].avgTime}ms avg`
                      : ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm p-6">
                  <Timer className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Longest Visit</p>
                  <p className="text-2xl font-bold text-white">
                    {pageDurationData.length > 0
                      ? pageDurationData.sort((a, b) => b.avgDuration - a.avgDuration)[0].name
                      : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {pageDurationData.length > 0
                      ? `${pageDurationData.sort((a, b) => b.avgDuration - a.avgDuration)[0].avgDuration}s avg`
                      : ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm p-6">
                  <Activity className="w-8 h-8 text-emerald-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Total Page Loads</p>
                  <p className="text-2xl font-bold text-white">
                    {pageLoadData.reduce((sum, page) => sum + page.count, 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">All pages combined</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "errors" && (
            <motion.div
              key="errors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Error Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/50 backdrop-blur-sm p-6">
                  <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Total Errors</p>
                  <p className="text-4xl font-bold text-white">{errorsData.errorCount || 0}</p>
                  <p className="text-xs text-gray-500 mt-2">All time</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 backdrop-blur-sm p-6">
                  <FileText className="w-8 h-8 text-orange-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Recent Errors</p>
                  <p className="text-4xl font-bold text-white">{errorsArray.length}</p>
                  <p className="text-xs text-gray-500 mt-2">Last 20 logged</p>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 backdrop-blur-sm p-6">
                  <Activity className="w-8 h-8 text-yellow-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">Error Rate</p>
                  <p className="text-4xl font-bold text-white">
                    {totalsData.totalViews > 0
                      ? ((errorsData.errorCount / totalsData.totalViews) * 100).toFixed(2)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Per view</p>
                </div>
              </div>

              {/* Error Log */}
              <ChartCard title="Error Log" icon={<AlertCircle className="w-5 h-5" />}>
                {errorsArray.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {errorsArray.map((error, i) => (
                      <motion.div
                        key={error.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <span className="font-semibold text-red-400">{error.component}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {error.timestamp?.seconds
                              ? new Date(error.timestamp.seconds * 1000).toLocaleString()
                              : "Unknown time"}
                          </span>
                        </div>
                        <p className="text-sm text-white mb-2">{error.message}</p>
                        <details className="text-xs text-gray-400">
                          <summary className="cursor-pointer hover:text-gray-300">View stack trace</summary>
                          <pre className="mt-2 p-3 bg-black/30 rounded-lg overflow-x-auto text-[10px]">
                            {error.stack || "No stack trace available"}
                          </pre>
                        </details>
                        <p className="text-[10px] text-gray-600 mt-2 truncate">
                          User Agent: {error.userAgent}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Sparkles className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-2">No Errors! 🎉</p>
                    <p className="text-gray-400">Your application is running smoothly</p>
                  </div>
                )}
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
                          {dailyArr.length ? dailyArr.reduce((max, d) => (d.views > max.views ? d : max)).date : "N/A"}
                        </span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Top Traffic Source</span>
                        <span className="font-bold text-orange-400">
                          {trafficSourceData[0]?.name || "Direct"}
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
                      <li className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Total Blog Posts</span>
                        <span className="font-bold text-purple-400">{blogPostsData.length}</span>
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
        <span
          className={`flex items-center gap-1 text-xs font-semibold mt-1 ${
            isPositive ? "text-emerald-400" : "text-red-400"
          }`}
        >
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
      className={`rounded-2xl bg-gradient-to-br ${color.replace("to", "via")}/10 border border-white/10 backdrop-blur-sm p-6 relative overflow-hidden`}
    >
      <div className={`absolute top-4 right-4 w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
      <p className="text-4xl font-bold text-white mb-2">{value || 0}</p>
      {hasGrowth && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">vs {comparison || 0}</span>
          <span
            className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? "text-emerald-400" : "text-red-400"
            }`}
          >
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
        <div
          className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            isPositive
              ? "bg-emerald-500/20 text-emerald-400"
              : growth < 0
              ? "bg-red-500/20 text-red-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-5 h-5" />
          ) : growth < 0 ? (
            <TrendingDown className="w-5 h-5" />
          ) : (
            <Activity className="w-5 h-5" />
          )}
          <span className="font-bold">
            {isPositive ? "+" : ""}
            {growth}% change
          </span>
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
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${Math.min(clickRate, 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Download Rate</span>
            <span className="text-2xl font-bold text-cyan-400">{downloadRate}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min(downloadRate, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-xs text-gray-400 mb-1">Week Growth</p>
            <p className={`text-xl font-bold ${weekGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {weekGrowth >= 0 ? "+" : ""}
              {weekGrowth}%
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl text-center">
            <p className="text-xs text-gray-400 mb-1">Month Growth</p>
            <p className={`text-xl font-bold ${monthGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {monthGrowth >= 0 ? "+" : ""}
              {monthGrowth}%
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
      <div
        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm"
        style={{ color }}
      >
        {rank}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-300 truncate max-w-xs">{name}</span>
          <span className="text-sm font-bold" style={{ color }}>
            {value}
          </span>
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
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">{icon}</div>
        {trend === "positive" && <TrendingUp className="w-5 h-5 text-emerald-400" />}
        {trend === "negative" && <TrendingDown className="w-5 h-5 text-red-400" />}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-4xl font-bold text-white mb-2">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </motion.div>
  );
}