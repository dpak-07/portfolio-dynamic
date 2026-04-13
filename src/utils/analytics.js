import { db } from "../firebase";
import { buildAnalyticsSummary, toDateKey } from "./analyticsSummary";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const sessionCache = new Map();
const STORAGE_KEYS = {
  visitorId: "portfolio.analytics.visitor-id",
  sessionId: "portfolio.analytics.session-id",
};

let uniqueUserPromise = null;

export const initializeGA = () => {
  try {
    const gaId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || import.meta.env.VITE_GA_ID;
    if (!gaId) {
      console.warn("GA_ID not configured");
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }

    gtag("js", new Date());
    gtag("config", gaId, {
      page_path: window.location.pathname,
    });

    window.gtag = gtag;
    console.log("Google Analytics initialized:", gaId);
  } catch (error) {
    console.error("Failed to initialize Google Analytics:", error);
  }
};

export const initializeGTM = () => {
  try {
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (!gtmId) {
      console.warn("GTM_ID not configured");
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "gtm.js",
      "gtm.start": Date.now(),
      "gtm.uniqueEventId": Math.random(),
    });

    console.log("Google Tag Manager initialized:", gtmId);
  } catch (error) {
    console.error("Failed to initialize Google Tag Manager:", error);
  }
};

export const sendGAEvent = (eventName, eventData = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventData);
  }
};

export const trackEvent = (eventName, eventData = {}) => {
  sendGAEvent(eventName, eventData);
};

export const logPageView = (
  pagePath = typeof window !== "undefined" ? window.location.pathname : "/",
  pageTitle = typeof document !== "undefined" ? document.title : "Portfolio"
) => {
  if (typeof window === "undefined") return;

  sendGAEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
  });
};

function getTodayDate() {
  return toDateKey(new Date());
}

function createAnalyticsId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStorage(type) {
  if (typeof window === "undefined") return null;

  try {
    return type === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

function getOrCreateStoredId(storageType, storageKey, cacheKey) {
  const storage = getStorage(storageType);

  if (storage) {
    const existing = storage.getItem(storageKey);
    if (existing) return existing;

    const created = createAnalyticsId(cacheKey);
    storage.setItem(storageKey, created);
    return created;
  }

  let fallback = sessionCache.get(cacheKey);
  if (!fallback) {
    fallback = createAnalyticsId(cacheKey);
    sessionCache.set(cacheKey, fallback);
  }

  return fallback;
}

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

function isRecentEvent(key, limitMins = 2) {
  const now = Date.now();
  const last = sessionCache.get(key);

  if (last && now - last < limitMins * 60 * 1000) {
    return true;
  }

  sessionCache.set(key, now);
  return false;
}

export const logSectionView = async (sectionName = "unknown") => {
  try {
    await ensureAnalyticsDocs();
    const currentDay = getTodayDate();

    if (isRecentEvent(`view_${sectionName}`)) {
      console.log(`Skipped duplicate section view: ${sectionName}`);
      return;
    }

    const totalsRef = doc(db, "analytics", "totals");
    const sectionsRef = doc(db, "analytics", "sections");
    const dailyRef = doc(db, "analytics", "daily");

    await Promise.all([
      updateDoc(totalsRef, { totalViews: increment(1) }),
      updateDoc(sectionsRef, { [sectionName]: increment(1) }),
      updateDoc(dailyRef, {
        [`${currentDay}.views`]: increment(1),
        [`${currentDay}.sectionViews.${sectionName}`]: increment(1),
        [`${currentDay}.lastUpdated`]: serverTimestamp(),
      }),
    ]);
  } catch (error) {
    console.error("Error logging section view:", error);
  }
};

export const logLinkClick = async (linkName = "unknown") => {
  try {
    await ensureAnalyticsDocs();
    const currentDay = getTodayDate();

    const totalsRef = doc(db, "analytics", "totals");
    const linksRef = doc(db, "analytics", "links");
    const dailyRef = doc(db, "analytics", "daily");

    await Promise.all([
      updateDoc(totalsRef, { totalClicks: increment(1) }),
      updateDoc(linksRef, { [linkName]: increment(1) }),
      updateDoc(dailyRef, {
        [`${currentDay}.clicks`]: increment(1),
        [`${currentDay}.linkClicks.${linkName}`]: increment(1),
        [`${currentDay}.lastUpdated`]: serverTimestamp(),
      }),
    ]);
  } catch (error) {
    console.error("Error logging link click:", error);
  }
};

export const logDownload = async (fileName = "resume") => {
  try {
    await ensureAnalyticsDocs();
    const currentDay = getTodayDate();

    const totalsRef = doc(db, "analytics", "totals");
    const dailyRef = doc(db, "analytics", "daily");

    await Promise.all([
      updateDoc(totalsRef, { totalDownloads: increment(1) }),
      updateDoc(dailyRef, {
        [`${currentDay}.downloads`]: increment(1),
        [`${currentDay}.downloadedFiles.${fileName}`]: increment(1),
        [`${currentDay}.lastUpdated`]: serverTimestamp(),
      }),
    ]);
  } catch (error) {
    console.error("Error logging download:", error);
  }
};

export const logResumeOpen = async () => {
  try {
    await ensureAnalyticsDocs();
    const currentDay = getTodayDate();

    if (isRecentEvent("resume_open")) {
      console.log("Skipped duplicate resume open");
      return;
    }

    const totalsRef = doc(db, "analytics", "totals");
    const dailyRef = doc(db, "analytics", "daily");

    await Promise.all([
      updateDoc(totalsRef, { totalResumeOpens: increment(1) }),
      updateDoc(dailyRef, {
        [`${currentDay}.resumeOpens`]: increment(1),
        [`${currentDay}.lastUpdated`]: serverTimestamp(),
      }),
    ]);
  } catch (error) {
    console.error("Error logging resume open:", error);
  }
};

export const logUniqueUser = async () => {
  if (uniqueUserPromise) {
    return uniqueUserPromise;
  }

  uniqueUserPromise = (async () => {
    try {
      await ensureAnalyticsDocs();

      const currentDay = getTodayDate();
      const visitorId = getOrCreateStoredId("local", STORAGE_KEYS.visitorId, "visitor_id");
      const sessionId = getOrCreateStoredId("session", STORAGE_KEYS.sessionId, "session_id");
      const visitorRef = doc(db, "analytics_visitors", visitorId);
      const usersRef = doc(db, "analytics", "users");
      const dailyRef = doc(db, "analytics", "daily");

      const visitorSnap = await getDoc(visitorRef);
      const visitorData = visitorSnap.exists() ? visitorSnap.data() : {};
      const visitDays = visitorData.visitDays || {};
      const hasVisitedToday = Boolean(visitDays[currentDay]);
      const isNewVisitor = !visitorSnap.exists();
      const isNewSession = visitorData.lastSessionId !== sessionId;

      const visitorUpdate = {
        lastSeenAt: serverTimestamp(),
        lastSeenDate: currentDay,
        lastSessionId: sessionId,
        visitDays: {
          ...visitDays,
          [currentDay]: true,
        },
      };

      if (isNewVisitor) {
        visitorUpdate.firstSeenAt = serverTimestamp();
        visitorUpdate.firstSeenDate = currentDay;
      }

      if (!hasVisitedToday) {
        visitorUpdate.visitCount = increment(1);
      }

      if (isNewSession) {
        visitorUpdate.sessionCount = increment(1);
      }

      const usersSummaryUpdate = {
        lastSeenDate: currentDay,
        lastUpdated: serverTimestamp(),
      };

      if (isNewVisitor) {
        usersSummaryUpdate.totalVisitors = increment(1);
      }

      if (isNewSession) {
        usersSummaryUpdate.totalSessions = increment(1);
      }

      const dailyUpdate = {
        [`${currentDay}.lastUpdated`]: serverTimestamp(),
      };

      if (!hasVisitedToday) {
        dailyUpdate[`${currentDay}.uniqueUsers`] = increment(1);
        dailyUpdate[`${currentDay}.${isNewVisitor ? "newUsers" : "returningUsers"}`] = increment(1);
      }

      if (isNewSession) {
        dailyUpdate[`${currentDay}.sessions`] = increment(1);
      }

      await Promise.all([
        setDoc(visitorRef, visitorUpdate, { merge: true }),
        setDoc(usersRef, usersSummaryUpdate, { merge: true }),
        updateDoc(dailyRef, dailyUpdate),
      ]);
    } catch (error) {
      console.error("Error logging unique user:", error);
    } finally {
      uniqueUserPromise = null;
    }
  })();

  return uniqueUserPromise;
};

export const logCustomEvent = async (category, eventName, meta = {}) => {
  try {
    await ensureAnalyticsDocs();
    const currentDay = getTodayDate();
    const dailyRef = doc(db, "analytics", "daily");

    await updateDoc(dailyRef, {
      [`${currentDay}.customEvents.${category}.${eventName}`]: increment(1),
      [`${currentDay}.customEventsMeta.${category}.${eventName}`]: meta,
      [`${currentDay}.lastUpdated`]: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging custom event:", error);
  }
};

function getDeviceInfo() {
  const ua = navigator.userAgent;

  let browser = "Other";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";

  let os = "Other";
  if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iOS")) os = "iOS";
  else if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";

  let deviceType = "Desktop";
  if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";
  else if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";

  return { browser, os, deviceType };
}

export const logDeviceInfo = async () => {
  try {
    if (isRecentEvent("device_info", 1440)) {
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
  } catch (error) {
    console.error("Error logging device info:", error);
  }
};

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
    } catch {
      source = "Referral";
    }
  }

  return { source, medium: utmMedium, campaign: utmCampaign };
}

export const logTrafficSource = async () => {
  try {
    if (isRecentEvent("traffic_source", 1440)) {
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
  } catch (error) {
    console.error("Error logging traffic source:", error);
  }
};

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
  } catch (error) {
    console.error("Error logging blog view:", error);
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
  } catch (error) {
    console.error("Error logging blog like:", error);
  }
};

export const logBlogReadTime = async (postSlug, seconds) => {
  try {
    if (!postSlug || seconds < 5) return;

    await ensureAnalyticsDocs();
    const blogRef = doc(db, "analytics", "blog");

    await updateDoc(blogRef, {
      [`${postSlug}.totalReadTime`]: increment(Math.floor(seconds)),
      [`${postSlug}.readCount`]: increment(1),
    });
  } catch (error) {
    console.error("Error logging blog read time:", error);
  }
};

export const logPageLoad = async (pageName, loadTimeMs) => {
  try {
    if (!pageName || loadTimeMs < 0) return;

    await ensureAnalyticsDocs();
    const performanceRef = doc(db, "analytics", "performance");

    await updateDoc(performanceRef, {
      [`pageLoads.${pageName}.count`]: increment(1),
      [`pageLoads.${pageName}.totalTime`]: increment(Math.floor(loadTimeMs)),
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging page load:", error);
  }
};

export const logPageDuration = async (pageName, durationMs) => {
  try {
    if (!pageName || durationMs < 1000) return;

    await ensureAnalyticsDocs();
    const performanceRef = doc(db, "analytics", "performance");

    await updateDoc(performanceRef, {
      [`pageDurations.${pageName}.count`]: increment(1),
      [`pageDurations.${pageName}.totalTime`]: increment(Math.floor(durationMs)),
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging page duration:", error);
  }
};

export const logError = async (errorMessage, errorStack, componentName = "Unknown") => {
  try {
    if (errorStack && errorStack.includes("chrome-extension://")) {
      return;
    }

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
  } catch (error) {
    console.error("Error logging error:", error);
  }
};

export const getAnalyticsData = async () => {
  try {
    await ensureAnalyticsDocs();

    const [
      totalsSnap,
      sectionsSnap,
      linksSnap,
      dailySnap,
      devicesSnap,
      trafficSnap,
      blogSnap,
      performanceSnap,
      errorsSnap,
      visitorsSnap,
    ] = await Promise.all([
      getDoc(doc(db, "analytics", "totals")),
      getDoc(doc(db, "analytics", "sections")),
      getDoc(doc(db, "analytics", "links")),
      getDoc(doc(db, "analytics", "daily")),
      getDoc(doc(db, "analytics", "devices")),
      getDoc(doc(db, "analytics", "traffic")),
      getDoc(doc(db, "analytics", "blog")),
      getDoc(doc(db, "analytics", "performance")),
      getDoc(doc(db, "analytics", "errors")),
      getDocs(collection(db, "analytics_visitors")),
    ]);

    return buildAnalyticsSummary({
      totals: totalsSnap.exists() ? totalsSnap.data() : {},
      sections: sectionsSnap.exists() ? sectionsSnap.data() : {},
      links: linksSnap.exists() ? linksSnap.data() : {},
      daily: dailySnap.exists() ? dailySnap.data() : {},
      visitors: visitorsSnap.docs.map((snapshot) => ({
        id: snapshot.id,
        ...snapshot.data(),
      })),
      devices: devicesSnap.exists() ? devicesSnap.data() : {},
      traffic: trafficSnap.exists() ? trafficSnap.data() : {},
      blog: blogSnap.exists() ? blogSnap.data() : {},
      performance: performanceSnap.exists() ? performanceSnap.data() : {},
      errors: errorsSnap.exists() ? errorsSnap.data() : {},
      now: new Date(),
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);

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
      summaryData: {},
    };
  }
};

export const resetAnalytics = async () => {
  try {
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

    const visitorsSnap = await getDocs(collection(db, "analytics_visitors"));

    await Promise.all([
      ...refs.map((ref) => setDoc(ref, {}, { merge: false })),
      ...visitorsSnap.docs.map((snapshot) => deleteDoc(snapshot.ref)),
    ]);
  } catch (error) {
    console.error("Error resetting analytics:", error);
  }
};
