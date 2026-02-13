// Google Tag Manager event tracking
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
            event: eventName,
            ...eventParams
        });
    }
};

// Common event trackers
export const analytics = {
    pageView: (pageName: string) => {
        trackEvent('page_view', { page_name: pageName });
    },

    projectClick: (projectTitle: string, category: string) => {
        trackEvent('project_click', {
            project_title: projectTitle,
            project_category: category
        });
    },

    downloadResume: () => {
        trackEvent('download_resume');
    },

    contactFormSubmit: (formType: string) => {
        trackEvent('contact_form_submit', { form_type: formType });
    },

    socialClick: (platform: string) => {
        trackEvent('social_click', { platform });
    }
};
