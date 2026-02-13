# 🔐 GitHub Secrets Setup Guide

This guide explains how to configure GitHub Secrets for automated Firebase deployment with all required environment variables.

---

## 📋 Required Secrets

Add these secrets to your GitHub repository for CI/CD pipeline to work:

### Firebase Configuration
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_SERVICE_ACCOUNT_DEEPAKPORTFOLIO_0607` (JSON file)

### Supabase Configuration (Optional)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Stripe Configuration (Optional)
- `VITE_STRIPE_PUBLISHABLE_KEY`

### EmailJS Configuration
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

### Google Analytics/Tag Manager
- `VITE_GTM_ID`

---

## 🛠️ How to Add Secrets

### Step 1: Go to Repository Settings
1. Navigate to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)

### Step 2: Add Individual Secrets
1. Click **New repository secret**
2. Enter secret name (e.g., `VITE_FIREBASE_API_KEY`)
3. Paste secret value from your `.env` file
4. Click **Add secret**

### Step 3: Add Firebase Service Account
For `FIREBASE_SERVICE_ACCOUNT_DEEPAKPORTFOLIO_0607`:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Project Settings** (⚙️ icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Copy the entire JSON content
7. In GitHub Secrets, create new secret with name: `FIREBASE_SERVICE_ACCOUNT_DEEPAKPORTFOLIO_0607`
8. Paste the JSON content as value

---

## 📋 Secret Values Reference

| Secret Name | Source | Example |
|------------|--------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase Console > Project Settings | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console > Project Settings | `deepakportfolio-0607.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console | `deepakportfolio-0607` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console > Project Settings | `deepakportfolio-0607.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console > Project Settings | `87960124367` |
| `VITE_FIREBASE_APP_ID` | Firebase Console > Project Settings | `1:87960124367:web:...` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Console > Analytics | `G-97XVZZ0X98` |
| `VITE_SUPABASE_URL` | Supabase Dashboard | `https://msnquctipzicvejmuvli.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings | `eyJhbGc...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | `sb_publishable_...` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS Dashboard | `service_...` |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS Dashboard | `template_...` |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS Dashboard | `public_...` |
| `VITE_GTM_ID` | Google Tag Manager | `GTM-WZML4WNP` |
| `FIREBASE_SERVICE_ACCOUNT_DEEPAKPORTFOLIO_0607` | Firebase Console > Service Accounts | Full JSON object |

---

## ✅ Verification

After adding all secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see all secrets listed (values are hidden)
3. Push code to `main` branch to trigger deployment
4. Check **Actions** tab to see workflow execution

---

## 🔄 Workflow Files

The project includes two GitHub Actions workflows:

### 1. **firebase-hosting-merge.yml** (Main Deployment)
- **Trigger**: Push to `main` branch
- **Action**: Builds and deploys to production
- **Uses all environment variables**

### 2. **firebase-hosting-pull-request.yml** (Preview Deployment)
- **Trigger**: Pull requests
- **Action**: Builds and deploys preview channel
- **Uses all environment variables**

Both workflows:
1. Check out code
2. Set up Node.js v20
3. Install dependencies (`npm ci`)
4. Create `.env` file from secrets
5. Build project (`npm run build`)
6. Deploy to Firebase Hosting

---

## 🚨 Security Best Practices

✅ **DO:**
- Use different secrets for dev/staging/production if possible
- Rotate Firebase service account keys periodically
- Review GitHub Actions logs for any exposed values
- Keep `.env` file in `.gitignore` (already configured)

❌ **DON'T:**
- Commit `.env` files to repository
- Share secret values in Slack, email, etc.
- Use the same secrets across multiple repositories
- Log secret values in CI/CD output

---

## 🐛 Troubleshooting

### Build fails with env variable errors
- Check that all secrets are added correctly
- Verify secret names match exactly (case-sensitive)
- Check `.env` is not committed to git

### Firebase deployment fails
- Verify `FIREBASE_SERVICE_ACCOUNT_DEEPAKPORTFOLIO_0607` is valid JSON
- Check Firebase project ID matches in secret
- Ensure Firebase CLI token is current

### Email/Analytics not working in deployed site
- Verify API keys are for production environment
- Check that secrets were properly populated in `.env`
- Review GitHub Actions logs for errors

### Secrets not available in workflow
- Wait 30 seconds after adding secret before triggering workflow
- Check that workflow file references correct secret names
- Ensure workflow has `secrets: inherit` or explicit secret access

---

## 📚 References

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Deployment Guide](https://firebase.google.com/docs/hosting/github-integration)
- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup)

---

**Last Updated**: February 2026
