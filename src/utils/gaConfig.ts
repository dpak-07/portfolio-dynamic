/**
 * 📊 Google Analytics Configuration and Setup Guide
 * 
 * This file contains the configuration and helper functions for Google Analytics 4 (GA4),
 * Google Tag Manager (GTM), and advanced analytics tracking.
 */

export const GA_CONFIG = {
  // Google Analytics 4 Measurement ID (from Firebase)
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  
  // Google Tag Manager ID
  gtmId: import.meta.env.VITE_GTM_ID || 'GTM-XXXXXXXX',
  
  // Enable debug mode (set to true to see analytics in console)
  debugMode: import.meta.env.MODE === 'development',
  
  // Anonymous user tracking
  anonymousUserTracking: true,
  
  // Event batching
  batchEvents: true,
  batchSize: 5,
  
  // Session tracking
  trackSessions: true,
  sessionLength: 30 * 60 * 1000, // 30 minutes
};

/**
 * 📱 Device Information Helper
 * Collects device, browser, and OS information for analytics
 */
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  // Detect OS
  let os = 'Unknown';
  if (ua.indexOf('Win') > -1) os = 'Windows';
  else if (ua.indexOf('Mac') > -1) os = 'macOS';
  else if (ua.indexOf('Linux') > -1) os = 'Linux';
  else if (ua.indexOf('X11') > -1) os = 'UNIX';
  else if (ua.indexOf('Android') > -1) os = 'Android';
  else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) os = 'iOS';
  
  // Detect Browser
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (ua.indexOf('Chrome') > -1) {
    browser = 'Chrome';
    browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || 'Unknown';
  } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    browser = 'Safari';
    browserVersion = ua.split('Version/')[1]?.split(' ')[0] || 'Unknown';
  } else if (ua.indexOf('Firefox') > -1) {
    browser = 'Firefox';
    browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || 'Unknown';
  } else if (ua.indexOf('Edge') > -1) {
    browser = 'Edge';
    browserVersion = ua.split('Edge/')[1]?.split(' ')[0] || 'Unknown';
  }
  
  // Detect Device Type
  let deviceType = 'desktop';
  if (/mobile/i.test(ua)) deviceType = 'mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';
  
  return {
    os,
    browser,
    browserVersion,
    deviceType,
    userAgent: ua,
    screenResolution: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
  };
};

/**
 * 🌐 Traffic Source Detection
 * Identifies where the user came from
 */
export const getTrafficSource = () => {
  const referrer = document.referrer;
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  
  let source = 'direct';
  let medium = 'none';
  let campaign = '';
  
  // Check for UTM parameters
  if (params.get('utm_source')) {
    source = params.get('utm_source') || source;
    medium = params.get('utm_medium') || 'organic';
    campaign = params.get('utm_campaign') || '';
  } else if (referrer) {
    // Detect source from referrer
    if (referrer.includes('google')) {
      source = 'google';
      medium = 'organic';
    } else if (referrer.includes('linkedin')) {
      source = 'linkedin';
      medium = 'social';
    } else if (referrer.includes('twitter')) {
      source = 'twitter';
      medium = 'social';
    } else if (referrer.includes('facebook')) {
      source = 'facebook';
      medium = 'social';
    } else if (referrer.includes('github')) {
      source = 'github';
      medium = 'referral';
    } else {
      source = new URL(referrer).hostname;
      medium = 'referral';
    }
  }
  
  return {
    source,
    medium,
    campaign,
    referrer,
    originalUrl: window.location.href,
  };
};

/**
 * 🎯 Ecommerce Event Data Helper
 * Format data for e-commerce analytics (if applicable)
 */
export const createEcommerceEvent = (
  currency: string,
  value: number,
  items: Array<{
    item_id?: string;
    item_name: string;
    quantity?: number;
    price?: number;
    item_category?: string;
  }>
) => {
  return {
    currency,
    value,
    items: items.map(item => ({
      item_id: item.item_id || item.item_name,
      item_name: item.item_name,
      quantity: item.quantity || 1,
      price: item.price || 0,
      item_category: item.item_category || 'default',
    })),
  };
};

/**
 * 📊 Custom Dimensions and Metrics
 * Pre-defined custom dimensions for GA4
 */
export const customDimensions = {
  userRole: 'user_role', // 'visitor' | 'admin' | 'subscriber'
  accountType: 'account_type', // 'free' | 'premium'
  contentType: 'content_type', // Type of content being viewed
  pageSection: 'page_section', // Which section of the page
  userEngagement: 'user_engagement', // 'low' | 'medium' | 'high'
};

/**
 * 📊 Custom Metrics
 * Pre-defined custom metrics for GA4
 */
export const customMetrics = {
  timeOnPage: 'time_on_page',
  scrollDepth: 'scroll_depth',
  formCompletionTime: 'form_completion_time',
  pageLoadTime: 'page_load_time',
};

/**
 * 🎯 Event Categories for Easy Organization
 */
export const eventCategories = {
  navigation: 'navigation',
  engagement: 'engagement',
  conversion: 'conversion',
  error: 'error',
  performance: 'performance',
  social: 'social',
  video: 'video', // If you have videos
  file: 'file',
  search: 'search',
  checkout: 'checkout', // If you have e-commerce
};

/**
 * 🔍 Search Analytics Helper
 * Track search queries
 */
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  return {
    event_name: 'search',
    search_term: searchTerm,
    results_count: resultsCount,
  };
};

/**
 * 🎬 Video Analytics Helper
 * Track video interactions (if you have videos)
 */
export const trackVideoEvent = (
  videoTitle: string,
  eventAction: 'play' | 'pause' | 'complete',
  duration?: number
) => {
  return {
    event_name: 'video_engagement',
    video_title: videoTitle,
    video_action: eventAction,
    video_duration: duration,
  };
};

/**
 * 🛒 Ecommerce Analytics Helper
 * Track purchase events (if applicable)
 */
export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string,
  itemList: Array<{
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
  }>
) => {
  return {
    event_name: 'purchase',
    transaction_id: transactionId,
    value,
    currency,
    items: itemList,
    shipping: 0,
    tax: 0,
  };
};

/**
 * 💬 User Feedback Analytics
 * Track user satisfaction/feedback
 */
export const trackUserFeedback = (
  rating: number,
  feedback: string,
  feedbackType: string
) => {
  return {
    event_name: 'user_feedback',
    rating: Math.min(5, Math.max(1, rating)), // 1-5 rating
    feedback_text: feedback?.substring(0, 500),
    feedback_type: feedbackType,
  };
};

/**
 * 🔐 Consent Mode Helper
 * Manage cookie and data consent for GDPR/CCPA
 */
export const updateConsentMode = (consentStatus: {
  analytics_storage?: 'granted' | 'denied';
  ad_storage?: 'granted' | 'denied';
  ad_user_data?: 'granted' | 'denied';
  ad_personalization?: 'granted' | 'denied';
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', consentStatus);
  }
};

/**
 * 📈 Performance Monitoring
 * Track Core Web Vitals and other performance metrics
 */
export const trackPerformanceMetrics = () => {
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('FID:', entry.processingDuration);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (err) {
      console.warn('⚠️ Performance Observer not supported:', err);
    }
  }
};

/**
 * 🔗 UTM Parameter Helper
 * Build URLs with UTM parameters for tracking
 */
export const buildUTMUrl = (
  baseUrl: string,
  utmParams: {
    source: string;
    medium: string;
    campaign: string;
    content?: string;
    term?: string;
  }
) => {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', utmParams.source);
  url.searchParams.set('utm_medium', utmParams.medium);
  url.searchParams.set('utm_campaign', utmParams.campaign);
  if (utmParams.content) url.searchParams.set('utm_content', utmParams.content);
  if (utmParams.term) url.searchParams.set('utm_term', utmParams.term);
  return url.toString();
};

export default GA_CONFIG;
