// ✅ src/utils/analytics.js
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

/**
 * ⚡ Firebase Analytics Utility (No localStorage)
 * Tracks:
 *  - Section Views (with 2-min throttling)
 *  - Link Clicks
 *  - Resume Downloads & Opens
 *  - Unique Users (daily, weekly, monthly)
 *  - Extended: today, yesterday, last week, last month, overall users
 *  - Fully server-safe
 */

const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
const sessionCache = new Map(); // 🧠 In-memory cache (cleared when tab closes)

/* -------------------------------------------------------
   ⚙️ Ensure All Required Analytics Docs Exist
------------------------------------------------------- */
async function ensureAnalyticsDocs() {
  const refs = ["totals", "sections", "links", "daily", "users"].map((id) =>
    doc(db, "analytics", id)
  );
  await Promise.all(refs.map((ref) => setDoc(ref, {}, { merge: true })));
}

/* -------------------------------------------------------
   🕒 Helper: Prevent double counts (e.g. spam reloads)
------------------------------------------------------- */
function isRecentEvent(key, limitMins = 2) {
  const now = Date.now();
  const last = sessionCache.get(key);
  if (last && now - last < limitMins * 60 * 1000) return true;
  sessionCache.set(key, now);
  return false;
}

/* -------------------------------------------------------
   👁️ Log Section View (throttled)
------------------------------------------------------- */
export const logSectionView = async (sectionName = "unknown") => {
  try {
    await ensureAnalyticsDocs();

    if (isRecentEvent(`view_${sectionName}`)) {
      console.log(`⚠️ Skipped duplicate section view: ${sectionName}`);
      return;
    }

    const totalsRef = doc(db, "analytics", "totals");
    const sectionsRef = doc(db, "analytics", "sections");
    const dailyRef = doc(db, "analytics", "daily");

    await Promise.all([
      updateDoc(totalsRef, { totalViews: increment(1) }),
      updateDoc(sectionsRef, { [sectionName]: increment(1) }),
      updateDoc(dailyRef, {
        [`${today}.views`]: increment(1),
        [`${today}.sectionViews.${sectionName}`]: increment(1),
        [`${today}.lastUpdated`]: serverTimestamp(),
      }),
    ]);

    console.log(`👁️ Logged section view → ${sectionName}`);
  } catch (err) {
    console.error("❌ Error logging section view:", err);
  }
};

/* -------------------------------------------------------
   🔗 Log Link Click
------------------------------------------------------- */
export const logLinkClick = async (linkName = "unknown") => {
  try {
    await ensureAnalyticsDocs();

    const totalsRef = doc(db, "analytics", "totals");
    const linksRef = doc(db, "analytics", "links");
    const dailyRef = doc(db, "analytics", "daily");

    await Promise.all([
      updateDoc(totalsRef, { totalClicks: increment(1) }),
      updateDoc(linksRef, { [linkName]: increment(1) }),
      updateDoc(dailyRef, {
        [`${today}.clicks`]: increment(1),
        [`${today}.linkClicks.${linkName}`]: increment(1),
        [`${today}.lastUpdated`]: serverTimestamp(),
      }),
    ]);

    console.log(`🔗 Logged link click → ${linkName}`);
  } catch (err) {
    console.error("❌ Error logging link click:", err);
  }
};

/* -------------------------------------------------------
   📄 Log Resume or File Download
------------------------------------------------------- */
export const logDownload = async (fileName = "resume") => {
  try {
    await ensureAnalyticsDocs();

    const totalsRef = doc(db, "analytics", "totals");
    const dailyRef = doc(db, "analytics", "daily");

    await Promise.all([
      updateDoc(totalsRef, { totalDownloads: increment(1) }),
      updateDoc(dailyRef, {
        [`${today}.downloads`]: increment(1),
        [`${today}.downloadedFiles.${fileName}`]: increment(1),
        [`${today}.lastUpdated`]: serverTimestamp(),
      }),
    ]);

    console.log(`📄 Logged download → ${fileName}`);
  } catch (err) {
    console.error("❌ Error logging download:", err);
  }
};

/* -------------------------------------------------------
   📑 Log Resume Opens (throttled)
------------------------------------------------------- */
export const logResumeOpen = async () => {
  try {
    await ensureAnalyticsDocs();

    if (isRecentEvent("resume_open")) {
      console.log("⚠️ Skipped duplicate resume open (within 2 mins)");
      return;
    }

    const totalsRef = doc(db, "analytics", "totals");
    const dailyRef = doc(db, "analytics", "daily");

    await Promise.all([
      updateDoc(totalsRef, { totalResumeOpens: increment(1) }),
      updateDoc(dailyRef, {
        [`${today}.resumeOpens`]: increment(1),
        [`${today}.lastUpdated`]: serverTimestamp(),
      }),
    ]);

    console.log("📑 Logged resume open");
  } catch (err) {
    console.error("❌ Error logging resume open:", err);
  }
};

/* -------------------------------------------------------
   🧍 Log Unique User (per session)
------------------------------------------------------- */
export const logUniqueUser = async () => {
  try {
    await ensureAnalyticsDocs();
    const usersRef = doc(db, "analytics", "users");
    const dailyRef = doc(db, "analytics", "daily");

    // 🧠 Create random session-based visitor ID
    let visitorId = sessionCache.get("visitor_id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      sessionCache.set("visitor_id", visitorId);
    }

    const snap = await getDoc(usersRef);
    const data = snap.exists() ? snap.data() : {};
    const lastSeen = data.lastSeen || {};

    // Prevent double counting same session same day
    if (lastSeen[visitorId] === today) {
      console.log("⚠️ Session already logged today");
      return;
    }

    lastSeen[visitorId] = today;

    await Promise.all([
      setDoc(
        usersRef,
        {
          lastSeen,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      ),
      // Track daily unique user count
      updateDoc(dailyRef, {
        [`${today}.uniqueUsers`]: increment(1),
        [`${today}.lastUpdated`]: serverTimestamp(),
      }),
    ]);

    console.log("🧍 Logged unique user session");
  } catch (err) {
    console.error("❌ Error logging unique user:", err);
  }
};

/* -------------------------------------------------------
   ⚡ Log Custom Events
------------------------------------------------------- */
export const logCustomEvent = async (category, eventName, meta = {}) => {
  try {
    await ensureAnalyticsDocs();

    const dailyRef = doc(db, "analytics", "daily");
    await updateDoc(dailyRef, {
      [`${today}.customEvents.${category}.${eventName}`]: increment(1),
      [`${today}.customEventsMeta.${category}.${eventName}`]: meta,
      [`${today}.lastUpdated`]: serverTimestamp(),
    });

    console.log(`⚡ Custom Event Logged: ${category}.${eventName}`, meta);
  } catch (err) {
    console.error("❌ Error logging custom event:", err);
  }
};

/* -------------------------------------------------------
   📊 Fetch Analytics Data (for dashboard) — Extended
   Includes:
   ✅ Today / Yesterday
   ✅ This Week / Last Week
   ✅ This Month / Last Month
   ✅ Overall unique users
------------------------------------------------------- */
export const getAnalyticsData = async () => {
  try {
    await ensureAnalyticsDocs();

    const [totalsSnap, sectionsSnap, linksSnap, dailySnap, usersSnap] =
      await Promise.all([
        getDoc(doc(db, "analytics", "totals")),
        getDoc(doc(db, "analytics", "sections")),
        getDoc(doc(db, "analytics", "links")),
        getDoc(doc(db, "analytics", "daily")),
        getDoc(doc(db, "analytics", "users")),
      ]);

    const totals = totalsSnap.exists() ? totalsSnap.data() : {};
    const sections = sectionsSnap.exists() ? sectionsSnap.data() : {};
    const links = linksSnap.exists() ? linksSnap.data() : {};
    const daily = dailySnap.exists() ? dailySnap.data() : {};
    const users = usersSnap.exists() ? usersSnap.data() : {};

    const dailyArr = Object.keys(daily)
      .filter((k) => typeof daily[k] === "object")
      .map((date) => ({
        date,
        views: daily[date]?.views || 0,
        clicks: daily[date]?.clicks || 0,
        downloads: daily[date]?.downloads || 0,
        resumeOpens: daily[date]?.resumeOpens || 0,
        uniqueUsers: daily[date]?.uniqueUsers || 0,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 🧠 Extended user stats
    const lastSeen = users.lastSeen || {};
    const allDates = Object.values(lastSeen);
    const now = new Date();
    
    // Get today and yesterday dates
    const todayDate = now.toISOString().split("T")[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];

    const getWeekStart = (date, offset = 0) => {
      const d = new Date(date);
      const diff = d.getDate() - d.getDay() + offset * 7;
      const start = new Date(d.setDate(diff));
      start.setHours(0, 0, 0, 0);
      return start;
    };

    const thisWeekStart = getWeekStart(now);
    const lastWeekStart = getWeekStart(now, -1);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(thisWeekStart.getDate() - 1);

    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const isToday = (d) => d === todayDate;
    const isYesterday = (d) => d === yesterdayDate;
    const isThisWeek = (d) => {
      const date = new Date(d);
      return date >= thisWeekStart && date <= now;
    };
    const isLastWeek = (d) => {
      const date = new Date(d);
      return date >= lastWeekStart && date <= lastWeekEnd;
    };
    const isThisMonth = (d) => {
      const date = new Date(d);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    };
    const isLastMonth = (d) => {
      const date = new Date(d);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    };

    const uniqueOverall = new Set(Object.keys(lastSeen)).size;
    const uniqueToday = allDates.filter(isToday).length;
    const uniqueYesterday = allDates.filter(isYesterday).length;
    const uniqueThisWeek = allDates.filter(isThisWeek).length;
    const uniqueLastWeek = allDates.filter(isLastWeek).length;
    const uniqueThisMonth = allDates.filter(isThisMonth).length;
    const uniqueLastMonth = allDates.filter(isLastMonth).length;

    return {
      totalsData: {
        totalViews: totals.totalViews || 0,
        totalClicks: totals.totalClicks || 0,
        totalDownloads: totals.totalDownloads || 0,
        totalResumeOpens: totals.totalResumeOpens || 0,
      },
      usersData: {
        uniqueToday,
        uniqueYesterday,
        uniqueThisWeek,
        uniqueLastWeek,
        uniqueThisMonth,
        uniqueLastMonth,
        uniqueOverall,
      },
      sectionData: sections,
      linkData: links,
      dailyArr,
    };
  } catch (err) {
    console.error("❌ Error fetching analytics data:", err);
    return {
      totalsData: {},
      usersData: {},
      sectionData: {},
      linkData: {},
      dailyArr: [],
    };
  }
};

/* -------------------------------------------------------
   🧹 Reset All Analytics (Admin Only)
------------------------------------------------------- */
export const resetAnalytics = async () => {
  try {
    const refs = ["totals", "sections", "links", "daily", "users"].map((id) =>
      doc(db, "analytics", id)
    );
    await Promise.all(refs.map((ref) => setDoc(ref, {}, { merge: false })));
    console.log("🧹 Analytics reset successfully");
  } catch (err) {
    console.error("❌ Error resetting analytics:", err);
  }
};