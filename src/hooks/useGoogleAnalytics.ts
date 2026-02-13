import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, analytics, setUserProperties } from '../utils/analytics';
import { getDeviceInfo, getTrafficSource } from '../utils/gaConfig';

/**
 * 🎯 useGoogleAnalytics Hook
 * 
 * Automatically tracks page views and manages Google Analytics integration
 * Use this hook in your main app component or route components
 * 
 * Features:
 * - Automatic page view tracking on route changes
 * - Device and traffic source tracking
 * - Custom user properties
 * - Engagement tracking helpers
 * 
 * Usage:
 * ```jsx
 * function MyComponent() {
 *   const { trackEvent, trackTime } = useGoogleAnalytics();
 *   
 *   const handleClick = () => {
 *     trackEvent('custom_event', { param: 'value' });
 *   };
 * }
 * ```
 */
export const useGoogleAnalytics = () => {
  const location = useLocation();

  // Auto-track page views on route change
  useEffect(() => {
    const pagePath = location.pathname;
    const pageTitle = document.title;
    trackPageView(pagePath, pageTitle);

    // Set user properties based on device info
    const deviceInfo = getDeviceInfo();
    setUserProperties({
      device_type: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
    });
  }, [location]);

  /**
   * 🎯 Track custom event
   */
  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    (analytics as Record<string, any>)[eventName]?.(params) || 
      console.warn(`Event "${eventName}" not defined in analytics module`);
  }, []);

  /**
   * ⏱️ Track time spent on page
   */
  const trackTimeOnPage = useCallback((timeSeconds: number) => {
    const pageName = location.pathname.replace('/', '');
    analytics.timeOnPage(pageName, timeSeconds);
  }, [location]);

  /**
   * 📊 Track scroll depth
   */
  const trackScrollDepth = useCallback((percentage: number) => {
    const pageName = location.pathname.replace('/', '');
    analytics.scrollDepth(percentage, pageName);
  }, [location]);

  /**
   * 👤 Track user info
   */
  const trackUserInfo = useCallback((userProps: Record<string, any>) => {
    setUserProperties(userProps);
  }, []);

  /**
   * 📱 Get device information
   */
  const getDevice = useCallback(() => {
    return getDeviceInfo();
  }, []);

  /**
   * 🌐 Get traffic source
   */
  const getTraffic = useCallback(() => {
    return getTrafficSource();
  }, []);

  return {
    trackEvent,
    trackTimeOnPage,
    trackScrollDepth,
    trackUserInfo,
    getDevice,
    getTraffic,
    currentPage: location.pathname,
  };
};

/**
 * 🎬 useEngagementTracking Hook
 * 
 * Tracks user engagement metrics like time on page and scroll depth
 * 
 * Usage:
 * ```jsx
 * function MyComponent() {
 *   useEngagementTracking();
 * }
 * ```
 */
export const useEngagementTracking = () => {
  const location = useLocation();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    // Track time on page when leaving
    return () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 1) { // Only track if spent more than 1 second
        const pageName = location.pathname.replace('/', '') || 'home';
        analytics.timeOnPage(pageName, timeSpent);
      }
    };
  }, [location]);

  // Track scroll depth
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercentage = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        // Track at 25%, 50%, 75%, 100%
        const milestones = [25, 50, 75, 100];
        milestones.forEach((milestone) => {
          if (scrollPercentage >= milestone) {
            const pageName = location.pathname.replace('/', '') || 'home';
            analytics.scrollDepth(milestone, pageName);
          }
        });
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [location]);
};

/**
 * 🔗 useOutboundLinkTracking Hook
 * 
 * Automatically tracks clicks on external links
 * 
 * Usage:
 * ```jsx
 * function MyComponent() {
 *   const linkRef = useOutboundLinkTracking();
 *   return <a ref={linkRef} href="https://example.com">Link</a>;
 * }
 * ```
 */
export const useOutboundLinkTracking = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        const isExternal = !target.href.includes(window.location.hostname);
        if (isExternal) {
          analytics.outboundLink(target.textContent || 'Unnamed Link', target.href);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
};

/**
 * 🐛 useErrorTracking Hook
 * 
 * Automatically tracks JavaScript errors
 * 
 * Usage:
 * ```jsx
 * function MyComponent() {
 *   useErrorTracking('ComponentName');
 * }
 * ```
 */
export const useErrorTracking = (componentName: string) => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      analytics.logError(event.message, event.error?.stack, componentName);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [componentName]);
};

export default useGoogleAnalytics;
