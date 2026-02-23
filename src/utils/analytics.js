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
 * 📊 Google Analytics 4 & GTM Integration
 * Initialize Google Analytics and Google Tag Manager
 */
export const initializeGA = () => {
  try {
    const gaId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || import.meta.env.VITE_GA_ID;
    if (!gaId) {
      console.warn("⚠️ GA_ID not configured");
      return;
    }

    // Load Google Analytics script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", gaId, {
      page_path: window.location.pathname,
    });

    window.gtag = gtag;
    console.log("✅ Google Analytics initialized:", gaId);
  } catch (err) {
    console.error("❌ Failed to initialize Google Analytics:", err);
  }
};

/**
 * 🏷️ Google Tag Manager Integration
 * Initialize GTM container
 */
export const initializeGTM = () => {
  try {
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (!gtmId) {
      console.warn("⚠️ GTM_ID not configured");
      return;
    }

    // Load GTM script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "gtm.js",
      "gtm.start": new Date().getTime(),
      "gtm.uniqueEventId": Math.random(),
    });

    console.log("✅ Google Tag Manager initialized:", gtmId);
  } catch (err) {
    console.error("❌ Failed to initialize GTM:", err);
  }
};

/**
 * 📈 Send custom events to Google Analytics
 */
export const sendGAEvent = (eventName, eventData = {}) => {
  if (window.gtag) {
    window.gtag("event", eventName, eventData);
  }
};

/**
 * Backward-compatible event tracking helper expected by App.jsx
 */
export const trackEvent = (eventName, eventData = {}) => {
  sendGAEvent(eventName, eventData);
};

/**
 * Backward-compatible page view helper expected by App.jsx
 */
export const logPageView = (pagePath = window.location.pathname, pageTitle = document.title) => {
  sendGAEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
  });
};

const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
const sessionCache = new Map(); // 🧠 In-memory cache (cleared when tab closes)

async function ensureAnalyticsDocs() {
  const refs = [
    "totals",
    "sections",
    "links",
    "daily",
    "users",
    "devices",
    "traffic",
    "blog",
    "performance",
    "errors",
  ].map((id) => doc(db, "analytics", id));
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
   📱 Device Detection & Tracking
------------------------------------------------------- */
function getDeviceInfo() {
  const ua = navigator.userAgent;

  // Detect Browser
  let browser = "Other";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";

  // Detect OS
  let os = "Other";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  // Detect Device Type
  let deviceType = "Desktop";
  if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";

  return { browser, os, deviceType };
}

export const logDeviceInfo = async () => {
  try {
    if (isRecentEvent("device_info", 1440)) { // Once per day
      return;
    }

    await ensureAnalyticsDocs();
    const { browser, os, deviceType } = getDeviceInfo();

    const devicesRef = doc(db, "analytics", "devices");
    await updateDoc(devicesRef, {
      [`browsers.${browser}`]: increment(1),
      [`os.${os}`]: increment(1),
      [`deviceTypes.${deviceType}`]: increment(1),
      lastUpdated: serverTimestamp(),
    });

    console.log(`📱 Device info logged → ${browser}, ${os}, ${deviceType}`);
  } catch (err) {
    console.error("❌ Error logging device info:", err);
  }
};

/* -------------------------------------------------------
   🔗 Traffic Source Tracking
------------------------------------------------------- */
function getTrafficSource() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const referrer = document.referrer;

  let source = "Direct";
  if (utmSource) {
    source = utmSource;
  } else if (referrer) {
    try {
      const refDomain = new URL(referrer).hostname;
      if (refDomain.includes("google")) source = "Google";
      else if (refDomain.includes("linkedin")) source = "LinkedIn";
      else if (refDomain.includes("twitter") || refDomain.includes("t.co")) source = "Twitter";
      else if (refDomain.includes("facebook")) source = "Facebook";
      else source = refDomain;
    } catch (e) {
      source = "Referral";
    }
  }

  return { source, medium: utmMedium, campaign: utmCampaign };
}

export const logTrafficSource = async () => {
  try {
    if (isRecentEvent("traffic_source", 1440)) { // Once per day
      return;
    }

    await ensureAnalyticsDocs();
    const { source, medium, campaign } = getTrafficSource();

    const trafficRef = doc(db, "analytics", "traffic");
    const updates = {
      [`sources.${source}`]: increment(1),
      lastUpdated: serverTimestamp(),
    };

    if (medium) updates[`mediums.${medium}`] = increment(1);
    if (campaign) updates[`campaigns.${campaign}`] = increment(1);

    await updateDoc(trafficRef, updates);

    console.log(`🔗 Traffic source logged → ${source}${medium ? ` (${medium})` : ""}${campaign ? ` [${campaign}]` : ""}`);
  } catch (err) {
    console.error("❌ Error logging traffic source:", err);
  }
};

/* -------------------------------------------------------
   📖 Blog Analytics
------------------------------------------------------- */
export const logBlogView = async (postSlug, postTitle) => {
  try {
    if (!postSlug) return;

    await ensureAnalyticsDocs();
    const blogRef = doc(db, "analytics", "blog");

    await updateDoc(blogRef, {
      [`${postSlug}.title`]: postTitle,
      [`${postSlug}.views`]: increment(1),
      [`${postSlug}.lastViewed`]: serverTimestamp(),
    });

    console.log(`📖 Blog view logged → ${postSlug}`);
  } catch (err) {
    console.error("❌ Error logging blog view:", err);
  }
};

export const logBlogLike = async (postSlug) => {
  try {
    if (!postSlug) return;

    await ensureAnalyticsDocs();
    const blogRef = doc(db, "analytics", "blog");

    await updateDoc(blogRef, {
      [`${postSlug}.likes`]: increment(1),
    });

    console.log(`❤️ Blog like logged → ${postSlug}`);
  } catch (err) {
    console.error("❌ Error logging blog like:", err);
  }
};

export const logBlogReadTime = async (postSlug, seconds) => {
  try {
    if (!postSlug || seconds < 5) return; // Only log if read for 5+ seconds

    await ensureAnalyticsDocs();
    const blogRef = doc(db, "analytics", "blog");

    await updateDoc(blogRef, {
      [`${postSlug}.totalReadTime`]: increment(Math.floor(seconds)),
      [`${postSlug}.readCount`]: increment(1),
    });

    console.log(`⏱️ Blog read time logged → ${postSlug}: ${Math.floor(seconds)}s`);
  } catch (err) {
    console.error("❌ Error logging blog read time:", err);
  }
};

/* -------------------------------------------------------
   ⚡ Performance Tracking
------------------------------------------------------- */
export const logPageLoad = async (pageName, loadTimeMs) => {
  try {
    if (!pageName || loadTimeMs < 0) return;

    await ensureAnalyticsDocs();
    const perfRef = doc(db, "analytics", "performance");

    await updateDoc(perfRef, {
      [`pageLoads.${pageName}.count`]: increment(1),
      [`pageLoads.${pageName}.totalTime`]: increment(Math.floor(loadTimeMs)),
      lastUpdated: serverTimestamp(),
    });

    console.log(`⚡ Page load logged → ${pageName}: ${Math.floor(loadTimeMs)}ms`);
  } catch (err) {
    console.error("❌ Error logging page load:", err);
  }
};

export const logPageDuration = async (pageName, durationMs) => {
  try {
    if (!pageName || durationMs < 1000) return; // Only log if 1+ second

    await ensureAnalyticsDocs();
    const perfRef = doc(db, "analytics", "performance");

    await updateDoc(perfRef, {
      [`pageDurations.${pageName}.count`]: increment(1),
      [`pageDurations.${pageName}.totalTime`]: increment(Math.floor(durationMs)),
      lastUpdated: serverTimestamp(),
    });

    console.log(`⏱️ Page duration logged → ${pageName}: ${Math.floor(durationMs / 1000)}s`);
  } catch (err) {
    console.error("❌ Error logging page duration:", err);
  }
};

/* -------------------------------------------------------
   ❌ Error Tracking
------------------------------------------------------- */
export const logError = async (errorMessage, errorStack, componentName = "Unknown") => {
  try {
    // Don't log errors from browser extensions
    if (errorStack && errorStack.includes("chrome-extension://")) return;

    await ensureAnalyticsDocs();
    const errorsRef = doc(db, "analytics", "errors");

    const errorId = `error_${Date.now()}`;
    await updateDoc(errorsRef, {
      [errorId]: {
        message: errorMessage || "Unknown error",
        stack: errorStack || "No stack trace",
        component: componentName,
        userAgent: navigator.userAgent,
        timestamp: serverTimestamp(),
      },
      errorCount: increment(1),
    });

    console.log(`❌ Error logged → ${componentName}: ${errorMessage}`);
  } catch (err) {
    console.error("❌ Error logging error (meta!):", err);
  }
};

/* -------------------------------------------------------
   📊 Fetch Analytics Data (for dashboard) — Extended
------------------------------------------------------- */
export const getAnalyticsData = async () => {
  try {
    await ensureAnalyticsDocs();

    const [
      totalsSnap,
      sectionsSnap,
      linksSnap,
      dailySnap,
      usersSnap,
      devicesSnap,
      trafficSnap,
      blogSnap,
      performanceSnap,
      errorsSnap,
    ] = await Promise.all([
      getDoc(doc(db, "analytics", "totals")),
      getDoc(doc(db, "analytics", "sections")),
      getDoc(doc(db, "analytics", "links")),
      getDoc(doc(db, "analytics", "daily")),
      getDoc(doc(db, "analytics", "users")),
      getDoc(doc(db, "analytics", "devices")),
      getDoc(doc(db, "analytics", "traffic")),
      getDoc(doc(db, "analytics", "blog")),
      getDoc(doc(db, "analytics", "performance")),
      getDoc(doc(db, "analytics", "errors")),
    ]);

    const totals = totalsSnap.exists() ? totalsSnap.data() : {};
    const sections = sectionsSnap.exists() ? sectionsSnap.data() : {};
    const links = linksSnap.exists() ? linksSnap.data() : {};
    const daily = dailySnap.exists() ? dailySnap.data() : {};
    const users = usersSnap.exists() ? usersSnap.data() : {};
    const devices = devicesSnap.exists() ? devicesSnap.data() : {};
    const traffic = trafficSnap.exists() ? trafficSnap.data() : {};
    const blog = blogSnap.exists() ? blogSnap.data() : {};
    const performance = performanceSnap.exists() ? performanceSnap.data() : {};
    const errors = errorsSnap.exists() ? errorsSnap.data() : {};

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
      devicesData: devices,
      trafficData: traffic,
      blogData: blog,
      performanceData: performance,
      errorsData: errors,
    };
  } catch (err) {
    console.error("❌ Error fetching analytics data:", err);
    return {
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
    };
  }
};

/* -------------------------------------------------------
   🧹 Reset All Analytics (Admin Only)
------------------------------------------------------- */
export const resetAnalytics = async () => {
  try {
    const refs = ["totals", "sections", "links", "daily", "users", "devices", "traffic", "blog", "performance", "errors"].map((id) =>
      doc(db, "analytics", id)
    );
    await Promise.all(refs.map((ref) => setDoc(ref, {}, { merge: false })));
    console.log("🧹 Analytics reset successfully");
  } catch (err) {
    console.error("❌ Error resetting analytics:", err);
  }
};
