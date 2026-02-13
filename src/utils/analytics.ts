import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '';
const GTM_ID = import.meta.env.VITE_GTM_ID || '';

/**
 * ✅ Initialize Google Analytics 4
 * Call once in App.jsx on mount
 */
export const initializeGA = () => {
    if (!GA_MEASUREMENT_ID) {
        console.warn('⚠️ Google Analytics Measurement ID not configured');
        return;
    }

    try {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        console.log('✅ Google Analytics initialized:', GA_MEASUREMENT_ID);
    } catch (err) {
        console.error('❌ Failed to initialize GA:', err);
    }
};

/**
 * ✅ Initialize Google Tag Manager (GTM)
 * Adds GTM script to document head
 */
export const initializeGTM = () => {
    if (!GTM_ID) {
        console.warn('⚠️ Google Tag Manager ID not configured');
        return;
    }

    try {
        // GTM script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=G-${GTM_ID}`;
        document.head.appendChild(script);

        // GTM noscript
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.appendChild(noscript);

        // Initialize dataLayer
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = function () {
            (window as any).dataLayer.push(arguments);
        };
        (window as any).gtag('js', new Date());
        (window as any).gtag('config', GA_MEASUREMENT_ID);

        console.log('✅ Google Tag Manager initialized:', GTM_ID);
    } catch (err) {
        console.error('❌ Failed to initialize GTM:', err);
    }
};

/**
 * ✅ Track Page View (GA4)
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
    try {
        ReactGA.send({
            hitType: 'pageview',
            page: pagePath,
            title: pageTitle || document.title,
        });

        // Also track with GTM
        trackGTMEvent('page_view', {
            page_path: pagePath,
            page_title: pageTitle || document.title,
        });

        console.log(`📄 Page view tracked: ${pagePath}`);
    } catch (err) {
        console.error('❌ Error tracking page view:', err);
    }
};

/**
 * ✅ Track Custom Event (GA4)
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    try {
        ReactGA.event(eventName, eventParams || {});
        console.log(`🎯 Event tracked (GA4): ${eventName}`, eventParams);
    } catch (err) {
        console.error('❌ Error tracking event:', err);
    }
};

/**
 * ✅ Track GTM Event (Google Tag Manager dataLayer)
 */
export const trackGTMEvent = (eventName: string, eventParams?: Record<string, any>) => {
    try {
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: eventName,
                ...eventParams,
                timestamp: new Date().toISOString(),
            });
            console.log(`📊 Event tracked (GTM): ${eventName}`, eventParams);
        }
    } catch (err) {
        console.error('❌ Error tracking GTM event:', err);
    }
};

/**
 * ✅ Track User ID (GA4)
 */
export const setUserID = (userID: string) => {
    try {
        ReactGA.set({ 'user_id': userID });
        console.log(`👤 User ID set: ${userID}`);
    } catch (err) {
        console.error('❌ Error setting user ID:', err);
    }
};

/**
 * ✅ Set Custom User Properties (GA4)
 */
export const setUserProperties = (properties: Record<string, any>) => {
    try {
        ReactGA.set(properties);
        console.log('🔧 User properties set:', properties);
    } catch (err) {
        console.error('❌ Error setting user properties:', err);
    }
};

/* ═══════════════════════════════════════════════════════════
   📊 COMMON EVENT TRACKERS — Use These Throughout App
═══════════════════════════════════════════════════════════ */

export const analytics = {
    // Page & Section Tracking
    pageView: (pageName: string) => {
        trackPageView(`/${pageName.toLowerCase().replace(/ /g, '-')}`);
        trackEvent('section_view', { section_name: pageName });
    },

    sectionScroll: (sectionName: string) => {
        trackEvent('section_scroll', {
            section_name: sectionName,
            timestamp: new Date().toISOString(),
        });
    },

    // Project Interactions
    projectClick: (projectTitle: string, category: string, url?: string) => {
        trackEvent('project_click', {
            project_title: projectTitle,
            project_category: category,
            project_url: url,
            value: 1,
        });
        trackGTMEvent('project_interaction', {
            project_name: projectTitle,
            category: category,
        });
    },

    projectView: (projectTitle: string, category: string) => {
        trackEvent('project_view', {
            project_title: projectTitle,
            project_category: category,
        });
    },

    // Resume/Download Tracking
    downloadResume: (fileType?: string, fileName?: string) => {
        trackEvent('download', {
            file_name: fileName || 'resume',
            file_type: fileType || 'pdf',
            value: 1,
        });
        trackGTMEvent('file_download', {
            file_name: fileName || 'resume',
            file_extension: fileType || 'pdf',
        });
    },

    openResumePreview: (fileName?: string) => {
        trackEvent('open_preview', {
            file_name: fileName || 'resume',
            value: 1,
        });
    },

    // Form Tracking
    contactFormSubmit: (formType?: string, status?: 'success' | 'error') => {
        trackEvent('form_submit', {
            form_type: formType || 'contact',
            status: status || 'success',
            value: 1,
        });
        trackGTMEvent('lead', {
            form_type: formType || 'contact',
            status: status || 'success',
        });
    },

    contactFormStart: (formType?: string) => {
        trackEvent('form_start', {
            form_type: formType || 'contact',
        });
    },

    contactFormError: (errorMessage: string, field?: string) => {
        trackEvent('form_error', {
            error_message: errorMessage,
            field_name: field,
            value: 1,
        });
    },

    // Social Media Tracking
    socialClick: (platform: string, action?: string) => {
        trackEvent('social_click', {
            platform: platform.toLowerCase(),
            action: action || 'visit_profile',
            value: 1,
        });
        trackGTMEvent('social_engagement', {
            platform: platform,
        });
    },

    // Blog Tracking
    blogPostView: (postTitle: string, postID?: string, category?: string) => {
        trackEvent('blog_post_view', {
            post_title: postTitle,
            post_id: postID,
            category: category,
            value: 1,
        });
    },

    blogPostClick: (postTitle: string, postID?: string) => {
        trackEvent('blog_post_click', {
            post_title: postTitle,
            post_id: postID,
            value: 1,
        });
    },

    blogShare: (postTitle: string, platform: string) => {
        trackEvent('share', {
            content_type: 'blog_post',
            item_id: postTitle,
            method: platform,
        });
    },

    // Link Clicks
    linkClick: (linkName: string, linkURL?: string, category?: string) => {
        trackEvent('link_click', {
            link_name: linkName,
            link_url: linkURL,
            link_category: category,
            value: 1,
        });
    },

    // Admin Actions
    adminLogin: (success: boolean) => {
        trackEvent('login', {
            method: 'admin_panel',
            success: success,
        });
        trackGTMEvent('admin_login', {
            success: success,
        });
    },

    adminLogout: () => {
        trackEvent('logout', {
            value: 1,
        });
    },

    adminContentUpdate: (contentType: string, action: string) => {
        trackEvent('content_update', {
            content_type: contentType,
            action: action,
            value: 1,
        });
        trackGTMEvent('admin_action', {
            action_type: `content_${action}`,
            content_type: contentType,
        });
    },

    // Engagement Tracking
    timeOnPage: (pageName: string, timeSeconds: number) => {
        trackEvent('engagement', {
            engagement_type: 'time_on_page',
            page_name: pageName,
            engagement_time: timeSeconds,
            value: Math.round(timeSeconds / 10), // Engagement value
        });
    },

    scrollDepth: (percentage: number, pageName: string) => {
        trackEvent('scroll', {
            scroll_depth: `${percentage}%`,
            page_name: pageName,
        });
    },

    // Error Tracking
    logError: (errorMessage: string, errorStack?: string, source?: string) => {
        trackEvent('exception', {
            description: errorMessage,
            fatal: false,
            error_source: source,
        });
        trackGTMEvent('js_error', {
            error_message: errorMessage,
            error_stack: errorStack?.substring(0, 500),
            error_source: source,
        });
        console.error('🚨 Error logged:', errorMessage);
    },

    // Device & Performance
    deviceInfo: (deviceType: string, osName: string, browserName: string) => {
        trackEvent('device_info', {
            device_type: deviceType,
            os_name: osName,
            browser_name: browserName,
        });
    },

    performanceMetric: (metricName: string, value: number, unit?: string) => {
        trackEvent('performance', {
            metric_name: metricName,
            metric_value: value,
            metric_unit: unit || 'ms',
        });
    },

    // Conversion Tracking
    conversion: (conversionType: string, conversionValue?: number) => {
        trackEvent('conversion', {
            conversion_type: conversionType,
            conversion_value: conversionValue || 1,
        });
    },

    // Outbound Links
    outboundLink: (linkName: string, url: string) => {
        trackEvent('click', {
            event_category: 'engagement',
            event_label: linkName,
            value: url,
        });
        trackGTMEvent('outbound_link', {
            link_name: linkName,
            link_url: url,
        });
    },
};

// ✅ Alias for compatibility
export const logPageView = trackPageView;
