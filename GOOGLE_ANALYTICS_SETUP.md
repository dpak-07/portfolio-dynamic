# 📊 Google Analytics 4 Setup & Integration Guide

## Overview

Your portfolio project now has **full Google Analytics 4 (GA4)** and **Google Tag Manager (GTM)** integration with comprehensive event tracking.

### What's Included

✅ **Google Analytics 4** - Modern analytics with real-time data
✅ **Google Tag Manager** - Advanced event tracking and management
✅ **Custom Events** - Pre-built event tracking for common interactions
✅ **Custom Hooks** - React hooks for easy analytics integration
✅ **Device Tracking** - OS, browser, device type detection
✅ **Traffic Source** - Referrer and UTM parameter tracking
✅ **Performance Monitoring** - Page load and Core Web Vitals tracking
✅ **Ecommerce Ready** - Transaction and purchase event tracking
✅ **Error Tracking** - Automatic JavaScript error logging

---

## 🚀 Quick Setup

### 1. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property for your portfolio
3. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Add to `.env`:

```env
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXXX
```

### 2. Verify in Your `.env` File

Your `.env` should already have:

```env
# Google Analytics
VITE_FIREBASE_MEASUREMENT_ID=G-97XVZZ0X98
VITE_GTM_ID=GTM-WZML4WNP
```

### 3. Run Your Project

```powershell
npm run dev
```

Check browser console for:
```
✅ Google Analytics initialized: G-XXXXXXXXXX
✅ Google Tag Manager initialized: GTM-XXXXXXXX
```

---

## 📊 Available Event Trackers

### Common Events

The `analytics` object in [src/utils/analytics.ts](../utils/analytics.ts) provides pre-built event trackers:

#### Page & Section Tracking
```javascript
import { analytics } from '@/utils/analytics';

// Track page view
analytics.pageView('About');

// Track section scroll
analytics.sectionScroll('Projects');
```

#### Project Interactions
```javascript
// Track project click
analytics.projectClick('My Awesome Project', 'Web Development', 'https://github.com/...');

// Track project view
analytics.projectView('My Awesome Project', 'Web Development');
```

#### Resume/Download
```javascript
// Track resume download
analytics.downloadResume('pdf', 'deepak-resume.pdf');

// Track resume preview open
analytics.openResumePreview('deepak-resume.pdf');
```

#### Form Tracking
```javascript
// Form submission
analytics.contactFormSubmit('contact', 'success');
analytics.contactFormSubmit('contact', 'error');

// Form interaction
analytics.contactFormStart('contact');
analytics.contactFormError('Invalid email format', 'email_field');
```

#### Social Media
```javascript
// Track social clicks
analytics.socialClick('GitHub', 'visit_profile');
analytics.socialClick('LinkedIn', 'follow');
analytics.socialClick('Twitter', 'visit_profile');
```

#### Blog Tracking
```javascript
// Blog analytics
analytics.blogPostView('How to Build a Portfolio', 'post-123', 'React');
analytics.blogPostClick('How to Build a Portfolio', 'post-123');
analytics.blogShare('How to Build a Portfolio', 'LinkedIn');
```

#### Link Clicks
```javascript
// Track any link
analytics.linkClick('Documentation Link', 'https://docs.example.com', 'external');
analytics.outboundLink('My Website', 'https://mysite.com');
```

#### Admin Actions
```javascript
// Admin tracking
analytics.adminLogin(true);  // true = success, false = failure
analytics.adminLogout();
analytics.adminContentUpdate('projects', 'create');
```

#### Engagement Metrics
```javascript
// Track time on page (in seconds)
analytics.timeOnPage('Projects', 45);

// Track scroll depth (0-100%)
analytics.scrollDepth(75, 'About');
```

#### Error Tracking
```javascript
// Log errors
analytics.logError(
  'Failed to fetch data',
  'Error: Network request failed',
  'ProjectComponent'
);
```

#### Device & Performance
```javascript
// Device info
analytics.deviceInfo('desktop', 'Windows', 'Chrome');

// Performance metrics
analytics.performanceMetric('page_load_time', 1200, 'ms');
```

---

## 🎯 Using Analytics Hooks

### useGoogleAnalytics

Automatically tracks page views and provides helper methods:

```jsx
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

function MyComponent() {
  const { 
    trackEvent, 
    trackTimeOnPage, 
    trackScrollDepth,
    getDevice,
    getTraffic 
  } = useGoogleAnalytics();

  // Manual event tracking
  const handleClick = () => {
    trackEvent('download_resume');
  };

  // Get user info
  const deviceInfo = getDevice();
  const trafficSource = getTraffic();

  return (
    <button onClick={handleClick}>
      Download Resume - {deviceInfo.deviceType}
    </button>
  );
}
```

### useEngagementTracking

Automatically tracks time on page and scroll depth:

```jsx
import { useEngagementTracking } from '@/hooks/useGoogleAnalytics';

function MyPage() {
  // Automatically tracks:
  // - Time spent on page (when leaving)
  // - Scroll depth at 25%, 50%, 75%, 100%
  useEngagementTracking();

  return <div>Page content...</div>;
}
```

### useOutboundLinkTracking

Automatically tracks external link clicks:

```jsx
import { useOutboundLinkTracking } from '@/hooks/useGoogleAnalytics';

function MyComponent() {
  // Automatically tracks all external link clicks
  useOutboundLinkTracking();

  return (
    <>
      <a href="https://github.com">GitHub</a>
      <a href="https://linkedin.com">LinkedIn</a>
    </>
  );
}
```

### useErrorTracking

Automatically tracks errors in a component:

```jsx
import { useErrorTracking } from '@/hooks/useGoogleAnalytics';

function MyComponent() {
  // Automatically logs errors from this component
  useErrorTracking('MyComponent');

  return <div>Component content...</div>;
}
```

---

## 🔧 Advanced Configuration

### Custom Dimensions

Set custom user properties:

```javascript
import { setUserProperties } from '@/utils/analytics';

setUserProperties({
  user_role: 'admin',
  account_type: 'premium',
  subscription_status: 'active',
});
```

### Device Information

Get detailed device information:

```javascript
import { getDeviceInfo } from '@/utils/gaConfig';

const device = getDeviceInfo();
console.log(device);
// {
//   os: 'Windows',
//   browser: 'Chrome',
//   browserVersion: '120.0',
//   deviceType: 'desktop',
//   screenResolution: '1920x1080',
//   language: 'en-US',
//   timezone: 'America/New_York',
//   cookiesEnabled: true,
//   onLine: true
// }
```

### Traffic Source

Detect where users come from:

```javascript
import { getTrafficSource } from '@/utils/gaConfig';

const traffic = getTrafficSource();
console.log(traffic);
// {
//   source: 'google', // or 'direct', 'linkedin', 'github', etc.
//   medium: 'organic',
//   campaign: '',
//   referrer: 'https://google.com/...',
//   originalUrl: 'https://yourportfolio.com'
// }
```

### UTM Parameters

Build URLs with UTM tracking:

```javascript
import { buildUTMUrl } from '@/utils/gaConfig';

const socialLink = buildUTMUrl('https://yourportfolio.com', {
  source: 'linkedin',
  medium: 'social',
  campaign: 'portfolio_launch',
  content: 'header_cta',
});

// Result: https://yourportfolio.com?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio_launch&utm_content=header_cta
```

### Consent Mode (GDPR/CCPA)

Manage user consent:

```javascript
import { updateConsentMode } from '@/utils/gaConfig';

// After user grants consent
updateConsentMode({
  analytics_storage: 'granted',
  ad_storage: 'granted',
});

// If user denies
updateConsentMode({
  analytics_storage: 'denied',
  ad_storage: 'denied',
});
```

---

## 📈 Real-Time Monitoring

### View Your Analytics

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your portfolio property
3. Click **Real-time** to see live traffic
4. Click **Reports** for detailed analytics

### Key Metrics to Monitor

- **Users**: Unique visitors
- **Sessions**: User sessions
- **Page views**: Total page views
- **Engagement rate**: % of engaged sessions
- **Average session duration**: Time users spend
- **Bounce rate**: Sessions with only 1 page
- **Conversion rate**: Goals completed

### Custom Events Dashboard

To create a custom dashboard for your events:

1. Go to **Reports** → **Events**
2. Click **Create event**
3. Name and configure your custom events
4. Save to dashboard

---

## 🎯 Implementation Examples

### Tracking a Download Button

```jsx
import { analytics } from '@/utils/analytics';

function DownloadButton() {
  const handleDownload = () => {
    // Track the download
    analytics.downloadResume('pdf', 'my-resume.pdf');
    
    // Then download
    const link = document.createElement('a');
    link.href = '/my-resume.pdf';
    link.download = 'my-resume.pdf';
    link.click();
  };

  return (
    <button onClick={handleDownload}>
      📥 Download Resume
    </button>
  );
}
```

### Tracking Form Submission

```jsx
import { analytics } from '@/utils/analytics';
import { useState } from 'react';

function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Track form start
    analytics.contactFormStart('contact_form');
    setLoading(true);

    try {
      // Submit form...
      await submitForm();
      
      // Track success
      analytics.contactFormSubmit('contact_form', 'success');
    } catch (error) {
      // Track error
      analytics.contactFormError(error.message, 'form');
      analytics.contactFormSubmit('contact_form', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        Send Message
      </button>
    </form>
  );
}
```

### Tracking Project Clicks

```jsx
import { analytics } from '@/utils/analytics';

function ProjectCard({ project }) {
  const handleClick = () => {
    // Track the click
    analytics.projectClick(project.title, project.category, project.url);
    
    // Then navigate
    window.open(project.url, '_blank');
  };

  return (
    <div onClick={handleClick}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
    </div>
  );
}
```

### Tracking Social Clicks

```jsx
import { analytics } from '@/utils/analytics';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function SocialLinks() {
  return (
    <div>
      <a href="https://github.com/yourname" 
         onClick={() => analytics.socialClick('GitHub')}>
        <FaGithub />
      </a>
      <a href="https://linkedin.com/in/yourname"
         onClick={() => analytics.socialClick('LinkedIn')}>
        <FaLinkedin />
      </a>
    </div>
  );
}
```

---

## 🔍 Troubleshooting

### Analytics Not Showing Up

1. **Check Environment Variables**
   ```powershell
   # In .env file
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_GTM_ID=GTM-XXXXXXXX
   ```

2. **Check Console for Errors**
   - Open browser Developer Tools (F12)
   - Look for error messages starting with "❌"

3. **Verify GA is Initialized**
   - Should see: `✅ Google Analytics initialized: G-XXXXXXXXXX`
   - Should see: `✅ Google Tag Manager initialized: GTM-XXXXXXXX`

4. **Check Real-time in Google Analytics**
   - Go to Google Analytics → Real-time
   - You should see traffic in real-time

### Events Not Tracking

1. **Verify Event Names** - Use exactly as defined in analytics module
2. **Check Development Mode** - Some events work differently in dev mode
3. **Clear Cache** - Hard refresh the page (Ctrl+Shift+R)
4. **Check GA4 Configuration** - Ensure events are configured in GA4 property

### Performance Issues

If tracking is slowing down your app:

```javascript
// Disable in development (optional)
if (import.meta.env.DEV) {
  // Skip analytics in development
}

// Or batch events
const GA_CONFIG = {
  batchEvents: true,
  batchSize: 5,
};
```

---

## 📱 Mobile Analytics

Google Analytics automatically tracks:
- **Mobile traffic** - Separate from desktop
- **App-like experiences** - PWA tracking
- **Touch interactions** - Mobile-specific events
- **Device types** - Phone, tablet, desktop

---

## ⚡ Performance Optimization

Analytics is loaded asynchronously to avoid impacting page performance:

```javascript
// Non-blocking initialization
useEffect(() => {
  initializeGA();
  initializeGTM();
}, []);

// Events are queued and sent in batches
```

---

## 🔐 Data Privacy

Your analytics respects user privacy:

- ✅ **GDPR Compliant** - Consent management supported
- ✅ **CCPA Compliant** - User data controls
- ✅ **No personal data** - Only aggregate metrics
- ✅ **Secure** - Data encrypted in transit

---

## 📚 Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Google Tag Manager Guide](https://support.google.com/tagmanager)
- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)
- [Web Vitals Guide](https://web.dev/vitals/)

---

## 🎓 Next Steps

1. ✅ Configure your GA4 measurement ID (done!)
2. ✅ Configure your GTM ID (done!)
3. 📊 Set up conversion goals in GA4
4. 📈 Create custom dashboards
5. 🎯 Define success metrics for your portfolio
6. 📱 Test on mobile and desktop
7. 🔍 Monitor analytics regularly

---

**Version**: 1.0
**Last Updated**: February 2026
**Status**: Production Ready ✨
