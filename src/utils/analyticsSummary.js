export function toDateKey(input = new Date()) {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function sumByRange(items, startKey, endKey, key) {
  return items.reduce((total, item) => {
    if (item.date < startKey || item.date > endKey) {
      return total;
    }

    return total + (Number(item[key]) || 0);
  }, 0);
}

function countVisitorsByDate(visitors, targetDate) {
  return visitors.filter((visitor) => Boolean(visitor.visitDays?.[targetDate])).length;
}

function countVisitorsByRange(visitors, startKey, endKey) {
  return visitors.filter((visitor) =>
    Object.keys(visitor.visitDays || {}).some(
      (dateKey) => isDateKey(dateKey) && dateKey >= startKey && dateKey <= endKey
    )
  ).length;
}

function countVisitorsByFirstSeen(visitors, startKey, endKey) {
  return visitors.filter((visitor) => {
    const firstSeenDate = visitor.firstSeenDate;
    return isDateKey(firstSeenDate) && firstSeenDate >= startKey && firstSeenDate <= endKey;
  }).length;
}

function calculateGrowth(current, previous) {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function getPeakDay(dailyArr) {
  if (!dailyArr.length) return null;

  return dailyArr.reduce((best, current) => {
    const bestScore = (best.views || 0) + (best.clicks || 0) + (best.downloads || 0);
    const currentScore = (current.views || 0) + (current.clicks || 0) + (current.downloads || 0);
    return currentScore > bestScore ? current : best;
  }, dailyArr[0]);
}

function getActivityStreak(dailyArr) {
  let streak = 0;

  for (let index = dailyArr.length - 1; index >= 0; index -= 1) {
    const item = dailyArr[index];
    const hasActivity =
      (item.views || 0) > 0 ||
      (item.clicks || 0) > 0 ||
      (item.downloads || 0) > 0 ||
      (item.uniqueUsers || 0) > 0;

    if (!hasActivity) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export function buildAnalyticsSummary({
  totals = {},
  sections = {},
  links = {},
  daily = {},
  visitors = [],
  devices = {},
  traffic = {},
  blog = {},
  performance = {},
  errors = {},
  now = new Date(),
} = {}) {
  const dailyArr = Object.keys(daily)
    .filter((key) => isDateKey(key) && typeof daily[key] === "object")
    .map((date) => ({
      date,
      views: daily[date]?.views || 0,
      clicks: daily[date]?.clicks || 0,
      downloads: daily[date]?.downloads || 0,
      resumeOpens: daily[date]?.resumeOpens || 0,
      uniqueUsers: daily[date]?.uniqueUsers || 0,
      newUsers: daily[date]?.newUsers || 0,
      returningUsers: daily[date]?.returningUsers || 0,
      sessions: daily[date]?.sessions || 0,
    }))
    .sort((left, right) => left.date.localeCompare(right.date));

  const todayKey = toDateKey(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = toDateKey(yesterdayDate);

  const thisWeekStartDate = new Date(now);
  thisWeekStartDate.setDate(thisWeekStartDate.getDate() - 6);
  const thisWeekStartKey = toDateKey(thisWeekStartDate);

  const lastWeekStartDate = new Date(now);
  lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 13);
  const lastWeekStartKey = toDateKey(lastWeekStartDate);

  const lastWeekEndDate = new Date(now);
  lastWeekEndDate.setDate(lastWeekEndDate.getDate() - 7);
  const lastWeekEndKey = toDateKey(lastWeekEndDate);

  const thisMonthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthStartKey = toDateKey(thisMonthStartDate);

  const lastMonthStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStartKey = toDateKey(lastMonthStartDate);

  const lastMonthEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthEndKey = toDateKey(lastMonthEndDate);

  const totalViews = totals.totalViews || 0;
  const totalClicks = totals.totalClicks || 0;
  const totalDownloads = totals.totalDownloads || 0;
  const totalResumeOpens = totals.totalResumeOpens || 0;
  const totalSessions = dailyArr.reduce((sum, day) => sum + (day.sessions || 0), 0);

  const uniqueToday = countVisitorsByDate(visitors, todayKey);
  const uniqueYesterday = countVisitorsByDate(visitors, yesterdayKey);
  const uniqueThisWeek = countVisitorsByRange(visitors, thisWeekStartKey, todayKey);
  const uniqueLastWeek = countVisitorsByRange(visitors, lastWeekStartKey, lastWeekEndKey);
  const uniqueThisMonth = countVisitorsByRange(visitors, thisMonthStartKey, todayKey);
  const uniqueLastMonth = countVisitorsByRange(visitors, lastMonthStartKey, lastMonthEndKey);

  const newToday = countVisitorsByFirstSeen(visitors, todayKey, todayKey);
  const newThisWeek = countVisitorsByFirstSeen(visitors, thisWeekStartKey, todayKey);
  const newThisMonth = countVisitorsByFirstSeen(visitors, thisMonthStartKey, todayKey);

  const sessionsToday = daily[todayKey]?.sessions || 0;
  const sessionsThisWeek = sumByRange(dailyArr, thisWeekStartKey, todayKey, "sessions");
  const sessionsLastWeek = sumByRange(dailyArr, lastWeekStartKey, lastWeekEndKey, "sessions");

  const returningToday = Math.max(uniqueToday - newToday, 0);
  const returningThisWeek = Math.max(uniqueThisWeek - newThisWeek, 0);
  const returningThisMonth = Math.max(uniqueThisMonth - newThisMonth, 0);

  const viewsThisWeek = sumByRange(dailyArr, thisWeekStartKey, todayKey, "views");
  const viewsLastWeek = sumByRange(dailyArr, lastWeekStartKey, lastWeekEndKey, "views");
  const clicksThisWeek = sumByRange(dailyArr, thisWeekStartKey, todayKey, "clicks");
  const downloadsThisWeek = sumByRange(dailyArr, thisWeekStartKey, todayKey, "downloads");

  const repeatVisitors = visitors.filter((visitor) => (visitor.visitCount || 0) > 1).length;
  const uniqueOverall = visitors.length;
  const repeatVisitorRate = uniqueOverall ? (repeatVisitors / uniqueOverall) * 100 : 0;
  const avgViewsPerVisitor = uniqueOverall ? totalViews / uniqueOverall : 0;
  const avgViewsPerSession = totalSessions ? totalViews / totalSessions : 0;
  const interactionRate = totalViews
    ? ((totalClicks + totalDownloads + totalResumeOpens) / totalViews) * 100
    : 0;
  const clickRate = totalViews ? (totalClicks / totalViews) * 100 : 0;
  const downloadRate = totalViews ? (totalDownloads / totalViews) * 100 : 0;
  const resumeRate = totalViews ? (totalResumeOpens / totalViews) * 100 : 0;
  const peakDay = getPeakDay(dailyArr);
  const activeDays = dailyArr.filter(
    (day) =>
      (day.views || 0) > 0 ||
      (day.clicks || 0) > 0 ||
      (day.downloads || 0) > 0 ||
      (day.uniqueUsers || 0) > 0
  ).length;
  const activityStreak = getActivityStreak(dailyArr);

  return {
    totalsData: {
      totalViews,
      totalClicks,
      totalDownloads,
      totalResumeOpens,
    },
    usersData: {
      uniqueToday,
      uniqueYesterday,
      uniqueThisWeek,
      uniqueLastWeek,
      uniqueThisMonth,
      uniqueLastMonth,
      uniqueOverall,
      newToday,
      newThisWeek,
      newThisMonth,
      returningToday,
      returningThisWeek,
      returningThisMonth,
      sessionsToday,
      totalSessions,
      repeatVisitorRate: Number(repeatVisitorRate.toFixed(1)),
    },
    sectionData: sections,
    linkData: links,
    dailyArr,
    devicesData: devices,
    trafficData: traffic,
    blogData: blog,
    performanceData: performance,
    errorsData: errors,
    summaryData: {
      activeDays,
      activityStreak,
      avgViewsPerVisitor: Number(avgViewsPerVisitor.toFixed(2)),
      avgViewsPerSession: Number(avgViewsPerSession.toFixed(2)),
      bestDay: peakDay,
      clickRate: Number(clickRate.toFixed(1)),
      downloadRate: Number(downloadRate.toFixed(1)),
      interactionRate: Number(interactionRate.toFixed(1)),
      repeatVisitorRate: Number(repeatVisitorRate.toFixed(1)),
      resumeRate: Number(resumeRate.toFixed(1)),
      sessionsLastWeek,
      sessionsThisWeek,
      sessionsTrend: calculateGrowth(sessionsThisWeek, sessionsLastWeek),
      viewsLastWeek,
      viewsThisWeek,
      viewsTrend: calculateGrowth(viewsThisWeek, viewsLastWeek),
      userTrend: calculateGrowth(uniqueThisWeek, uniqueLastWeek),
      clicksThisWeek,
      downloadsThisWeek,
      newVisitorsThisWeek: newThisWeek,
      returningVisitorsThisWeek: returningThisWeek,
    },
  };
}
