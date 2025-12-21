# 🚀 Canva App Publication Walkthrough

Based on the [official Canva documentation](https://www.canva.dev/docs/apps/submitting-apps), this guide walks you through the complete publication process for your Canva app.

## 📋 Overview

Before your app can be released to the public, it must:
1. Be properly prepared and tested
2. Be submitted for review via the Developer Portal
3. Pass Canva's app review process
4. Be released after approval

**Important**: You can only submit an app for review up to **5 times per day** to prevent spam.

---

## ✅ Phase 1: Pre-Submission Preparation

### 1.1 Read Canva's Terms and Conditions

**Required**: Read and understand:
- [Terms of Use](https://www.canva.com/policies/terms-of-use/)
- [Canva Developer Terms](https://www.canva.com/policies/canva-developer-terms/)

You'll be asked to agree to these when submitting.

### 1.2 Ensure Your App is Unique

- Check the [Apps Marketplace](https://www.canva.com/apps) to ensure your app doesn't duplicate existing apps
- Copycat apps (replicating name, layout, or functionality of existing apps) are not allowed
- Focus on solving unique problems and creating original experiences

### 1.3 Code Quality Checks

Run these commands to ensure your code is ready:

```bash
# Build production bundle
npm run build

# Type checking
npm run lint:types

# Linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Run tests
npm test

# Format code
npm run format
```

### 1.4 Security & Hosting

- **Security**: Follow [Security guidelines](https://www.canva.dev/docs/apps/security-guidelines)
- **Hosting**: Use reliable, secure hosting (avoid free services like Glitch for production)
- **Backend**: Ensure your backend can handle expected traffic

### 1.5 Design Guidelines Compliance

Review and follow:
- [Design Guidelines](https://www.canva.dev/docs/apps/design-guidelines)
- [App UI Kit](https://www.canva.dev/docs/apps/app-ui-kit) usage
- Test in both **light and dark themes** using the Dev Toolkit

### 1.6 Localization

- Upload UI strings for translation (see [Localization docs](https://www.canva.dev/docs/apps/localization))
- Canva will translate your app to all [supported locales](https://www.canva.dev/docs/apps/localization#supported-locales) for free

### 1.7 Testing Checklist

Test thoroughly before submission:

- ✅ **Core functionality** works as expected
- ✅ **Authentication flow** (if applicable):
  - With and without active session
  - With existing user
  - With newly signed-up user
- ✅ **All endpoints** respond correctly
- ✅ **All links and buttons** work
- ✅ **Scopes** are properly configured (see [Configuring scopes](https://www.canva.dev/docs/apps/configuring-scopes))
- ✅ **Themes**: App works in both light and dark themes
- ✅ **Feature support**: Test in both fixed and responsive design types if using unsupported APIs
- ✅ **Error handling** is robust

### 1.8 Create App Listing Assets

Prepare your Apps Marketplace listing:

**Visual Assets:**
- **App Icon**: 512x512 pixels (PNG)
- **Featured Image**: 1920x1080 pixels (PNG or JPG)
- **Screenshots**: 3-5 screenshots showing your app in action

**Written Content:**
- **App Name**: Short, descriptive name
- **Short Description**: 1-2 sentences about what the app does
- **Full Description**: Detailed explanation of features and benefits
- **Instructions**: How to use the app

See [App Listing Guidelines](https://www.canva.dev/docs/apps/app-listing-guidelines) for complete requirements.

### 1.9 Review Written Content

- Proofread all text
- Run spellcheck
- Check grammar and punctuation
- Remove any external links
- Keep language simple and clear

### 1.10 Prepare Testing Instructions (if needed)

If your app uses authentication, prepare:
- **Test account credentials** that allow reviewers to test full functionality
- **Documentation** explaining how your platform works
- **Documentation** showing where to find content (if your app provides content)

---

## 📤 Phase 2: Submission Process

### 2.1 Generate Production Bundle

1. Open terminal in your project directory
2. Run the build command:

```bash
npm run build
```

This creates a production bundle in the `dist/` folder. **This bundle is what you'll upload to Canva.**

### 2.2 Access Developer Portal

1. Go to [https://www.canva.com/developers/apps](https://www.canva.com/developers/apps)
2. Log in with your Canva account
3. Select your app from the list

**Important**: Make sure the email you use is integrated with your external platform (if applicable).

### 2.3 Upload Code Bundle

1. Navigate to the **Code upload** page in the Developer Portal
2. In the **App source** section, click **Upload** or **Choose file**
3. Select the bundle file from your `dist/` folder
4. Wait for upload to complete

**⚠️ Critical**: 
- Remove or clear the **Development URL** (if present)
- Your app should NOT point to `localhost:8080` in production
- The bundle must be the production build, not development code

### 2.4 Configure App Listing Details

Navigate to **App listing details** and fill in:

**Basic Information:**
- App name
- Short description
- Full description
- Categories and tags

**Visual Assets:**
- Upload app icon (512x512px)
- Upload featured image (1920x1080px)
- Upload screenshots (3-5 images)

**Support Information:**
- Support URL (if applicable)
- Privacy policy URL (if applicable)

See [App Listing Guidelines](https://www.canva.dev/docs/apps/app-listing-guidelines) for detailed requirements.

### 2.5 Provide Testing Instructions (if applicable)

If your app uses authentication:

1. Go to the **Testing instructions** page
2. Provide:
   - Test account login credentials
   - Explanation of how your platform works
   - Instructions on how to test the app
   - Information about third-party integrations

### 2.6 Submit for Review

1. Navigate to **App status** → **Submit app** page
2. Read and agree to the [Canva Developer Terms](https://www.canva.com/policies/canva-developer-terms/)
3. Click **Submit app**

**What happens next:**
- ✅ App is added to Canva's review queue
- ✅ A **Jira Service Desk (JSD) ticket** is automatically created
- ✅ All communication will happen via this ticket
- ✅ App status changes to **"Submitted"** (app cannot be modified in this state)

---

## ⏳ Phase 3: Review Process

### 3.1 Review Timeline

- **Duration**: Varies based on app complexity and feedback required
- **No fixed timeline**: Canva reviews as quickly as possible
- **Updates**: Provided via the JSD ticket

### 3.2 Review Criteria

Canva's review team (engineers, designers, QA experts) checks:

- ✅ Functionality and code quality
- ✅ Design guidelines compliance
- ✅ Security standards
- ✅ User experience
- ✅ App listing quality
- ✅ Uniqueness and originality

See [Submission Checklist](https://www.canva.dev/docs/apps/submission-checklist) for complete criteria.

### 3.3 Communication

- All updates come via the **Jira Service Desk ticket**
- You can ask questions through the ticket
- Feedback is also visible in the Developer Portal under **View feedback**

### 3.4 Possible Outcomes

#### ✅ Approved

If approved:
- Review process is complete
- You can release the app on-demand
- See [Phase 4: Release](#phase-4-release) below

#### ❌ Rejected

If rejected:
- You'll receive detailed feedback explaining required changes
- Feedback visible in Developer Portal → **View feedback**
- **Important**: The rejected version cannot be modified
- You must create a **new version** of the app
- See [App Versioning](https://www.canva.dev/docs/apps/versioning-apps) for details
- Make changes and resubmit

---

## 🎉 Phase 4: Release

### 4.1 Release Public App

After approval:

1. Navigate to your app in the Developer Portal
2. Go to the **Release app** page
3. Click **Release app**
4. Confirm in the dialog

**What happens:**
- ✅ App immediately becomes discoverable in the **Canva editor**
- ⏳ App appears in the **Apps Marketplace** within ~1 week (manually added by Canva)

### 4.2 Post-Release

Once released:

- Monitor app health (Canva monitors error rates)
- Track analytics (see [Analytics](https://www.canva.dev/docs/apps/analytics))
- Respond to user feedback
- Plan updates and new versions

---

## 🔄 Modifying Submitted Apps

### If You Need to Make Changes

**Before Review:**
- If app is in **"Submitted"** state, you must cancel the submission first

**To Cancel Submission:**
1. Go to **App status** → **Submit app** page
2. Click **Cancel submission**
3. Confirm cancellation
4. App is removed from review queue
5. You can now make changes
6. Resubmit when ready

**After Rejection:**
- Create a new version of the app
- Make required changes
- Submit the new version

---

## 📚 Key Resources

### Official Documentation
- [Submitting Apps](https://www.canva.dev/docs/apps/submitting-apps)
- [Submission Checklist](https://www.canva.dev/docs/apps/submission-checklist)
- [App Review Process](https://www.canva.dev/docs/apps/app-review-process)
- [Releasing Apps](https://www.canva.dev/docs/apps/releasing-apps)
- [App Listing Guidelines](https://www.canva.dev/docs/apps/app-listing-guidelines)

### Developer Resources
- [Developer Portal](https://www.canva.com/developers/apps)
- [Apps Marketplace](https://www.canva.com/apps)
- [Community](https://community.canva.dev)
- [Support](https://canva-external.atlassian.net/servicedesk/customer/portal/2/group/2)

### Important Policies
- [Terms of Use](https://www.canva.com/policies/terms-of-use/)
- [Canva Developer Terms](https://www.canva.com/policies/canva-developer-terms/)
- [Brand Guidelines](https://public.canva.site/our-brand)

---

## ⚠️ Common Pitfalls to Avoid

1. **Submitting too many times**: Max 5 submissions per day
2. **Using development URLs**: Remove localhost URLs before submission
3. **Incomplete testing**: Test thoroughly before submission
4. **Poor app listing**: Invest time in quality assets and descriptions
5. **Ignoring feedback**: Address all reviewer feedback carefully
6. **Security issues**: Follow security guidelines strictly
7. **Copycat apps**: Ensure your app is unique and original

---

## 💡 Tips for Success

1. **Test extensively** before submission
2. **Follow design guidelines** closely
3. **Create quality assets** for your listing
4. **Write clear descriptions** that explain value
5. **Respond promptly** to reviewer feedback
6. **Be patient** - review takes time
7. **Consider making your app free** - leads to more adoption

---

## 🆘 Getting Help

If you encounter issues:

1. **Check the JSD ticket** for your submission
2. **Review official documentation** links above
3. **Ask in the community**: [community.canva.dev](https://community.canva.dev)
4. **Create a support ticket**: [Support Portal](https://canva-external.atlassian.net/servicedesk/customer/portal/2/group/2)

---

**Good luck with your app submission! 🚀**

