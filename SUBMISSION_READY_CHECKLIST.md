# ✅ Submission Ready Checklist

Complete checklist for submitting your Canva app to the Apps Marketplace.

---

## 📋 Phase 1: Content Preparation

### ✅ App Listing Content (See `SUBMISSION_CONTENT.md`)

- [x] **App Name**: "Alvo Songs - Automatic Lyrics Slides"
- [x] **Short Description**: Ready (1-2 sentences)
- [x] **Full Description**: Complete with features and benefits
- [x] **Benefits**: Listed and explained
- [x] **Instructions**: Step-by-step user guide
- [x] **Categories**: Productivity, Design Tools, Content Creation
- [x] **Tags**: lyrics, songs, slides, presentation, automation, music, worship, karaoke, text, generator
- [x] **Testing Instructions**: Complete for reviewers

### 🎨 Visual Assets (See `VISUAL_ASSETS_GUIDE.md`)

- [ ] **App Icon** (512x512 PNG)
  - [ ] Created and saved
  - [ ] Professional appearance
  - [ ] Recognizable at small sizes
  - [ ] Under 1MB

- [ ] **Featured Image** (1920x1080 PNG/JPG)
  - [ ] Created and saved
  - [ ] Shows app in action
  - [ ] Includes app name
  - [ ] Professional design
  - [ ] Under 5MB

- [ ] **Screenshots** (3-5 images)
  - [ ] Screenshot 1: Main interface
  - [ ] Screenshot 2: Settings panel
  - [ ] Screenshot 3: Progress indicator
  - [ ] Screenshot 4: Final slides result
  - [ ] Screenshot 5: Search functionality
  - [ ] All are actual app screenshots
  - [ ] Text is readable
  - [ ] Each under 2MB

---

## 🔧 Phase 2: Code Preparation

### Build & Quality Checks

- [x] **Production Build**
  ```bash
  npm run build
  ```
  - [x] Build completes without errors
  - [x] Bundle created in `dist/app.js`
  - [x] No localhost URLs in production build
  - [x] BACKEND_HOST warning is acceptable (app doesn't use backend)

- [ ] **Code Quality**
  ```bash
  npm run lint:types    # Type checking
  npm run lint          # Linting
  npm run test          # Tests
  ```
  - [ ] No TypeScript errors
  - [ ] No linting errors
  - [ ] All tests pass

- [ ] **Design Guidelines Compliance**
  - [ ] Uses App UI Kit components
  - [ ] Works in light theme
  - [ ] Works in dark theme
  - [ ] Accessible (keyboard navigation, screen readers)
  - [ ] Follows Canva design patterns

### Security & Configuration

- [ ] **Security**
  - [ ] No hardcoded credentials
  - [ ] Proper error handling
  - [ ] No sensitive data in code
  - [ ] Follows security guidelines

- [ ] **S3 Configuration** (if using external songs)
  - [ ] S3 bucket has CORS configured
  - [ ] CORS allows Canva app origins
  - [ ] Object is publicly readable (or using signed URLs)
  - [ ] Content-Type is set correctly
  - [ ] Tested and working

- [ ] **App Configuration**
  - [ ] `canva-app.json` is correct
  - [ ] Scopes are properly configured
  - [ ] Intent is correctly set (design_editor)

---

## 📤 Phase 3: Developer Portal Setup

### Code Upload

- [ ] **Upload Bundle**
  - [ ] Go to Developer Portal → Code upload
  - [ ] Upload `dist/app.js`
  - [ ] Wait for upload to complete
  - [ ] Verify upload was successful

- [ ] **Development URL**
  - [ ] Clear/remove Development URL
  - [ ] Ensure no localhost URLs remain
  - [ ] App should use uploaded bundle only

### App Listing Details

- [ ] **Basic Information**
  - [ ] App name: "Alvo Songs - Automatic Lyrics Slides"
  - [ ] Short description: (from SUBMISSION_CONTENT.md)
  - [ ] Full description: (from SUBMISSION_CONTENT.md)
  - [ ] Categories: Selected
  - [ ] Tags: Added

- [ ] **Visual Assets**
  - [ ] App icon uploaded (512x512 PNG)
  - [ ] Featured image uploaded (1920x1080 PNG/JPG)
  - [ ] Screenshots uploaded (3-5 images)
  - [ ] All assets display correctly

- [ ] **Support Information**
  - [ ] Support URL (if applicable)
  - [ ] Privacy policy URL (if applicable)
  - [ ] Terms of service URL (if applicable)

### Translations (MANDATORY)

- [ ] **Upload UI Strings**
  - [ ] Go to **Translations** section in Developer Portal
  - [ ] Upload `dist/messages_en.json` file
  - [ ] Verify file is accepted (under 1MB, valid JSON)
  - [ ] All strings are in English (US)
  - [ ] All strings have descriptions for translators
  - [ ] See `TRANSLATIONS_GUIDE.md` for details

### Testing Instructions

- [ ] **Testing Instructions Page**
  - [ ] Instructions provided (from SUBMISSION_CONTENT.md)
  - [ ] Step-by-step guide for reviewers
  - [ ] Expected behavior documented
  - [ ] Known limitations noted
  - [ ] External dependencies explained (S3)

---

## ✅ Phase 4: Pre-Submission Review

### Content Review

- [ ] **Written Content**
  - [ ] Proofread all text
  - [ ] No typos or grammar errors
  - [ ] No external links in descriptions
  - [ ] Language is clear and simple
  - [ ] All content is in English

- [ ] **Visual Assets**
  - [ ] All assets are professional quality
  - [ ] No copyrighted material
  - [ ] Follows Canva brand guidelines
  - [ ] Text is readable in all images

### Functionality Review

- [ ] **Core Functionality**
  - [ ] App loads songs correctly
  - [ ] Search works properly
  - [ ] Settings can be customized
  - [ ] Slides are generated correctly
  - [ ] Progress indicator works
  - [ ] Error handling works

- [ ] **Edge Cases**
  - [ ] Works with short songs
  - [ ] Works with long songs
  - [ ] Handles network errors (S3 fallback)
  - [ ] Shows appropriate message for non-Presentation designs
  - [ ] Handles rate limiting gracefully

- [ ] **Themes & Compatibility**
  - [ ] Works in light theme
  - [ ] Works in dark theme
  - [ ] Responsive design (if applicable)
  - [ ] Works in different browsers

### Final Checks

- [ ] **Terms & Conditions**
  - [ ] Read Canva Terms of Use
  - [ ] Read Canva Developer Terms
  - [ ] Understand requirements
  - [ ] Ready to agree when submitting

- [ ] **Uniqueness**
  - [ ] Checked Apps Marketplace for similar apps
  - [ ] App is unique and original
  - [ ] Not a copycat app

---

## 🚀 Phase 5: Submission

### Final Steps

1. [ ] **Review Everything**
   - [ ] All content is complete
   - [ ] All assets are uploaded
   - [ ] Code is production-ready
   - [ ] Testing instructions are clear

2. [ ] **Submit for Review**
   - [ ] Go to App status → Submit app
   - [ ] Read and agree to Canva Developer Terms
   - [ ] Click "Submit app"
   - [ ] Note the JSD ticket number

3. [ ] **Post-Submission**
   - [ ] Monitor JSD ticket for updates
   - [ ] Be ready to respond to feedback
   - [ ] Don't modify app while in "Submitted" state

---

## 📚 Reference Documents

All content is prepared in these documents:

1. **`SUBMISSION_CONTENT.md`**
   - App name, descriptions, benefits
   - Instructions for use
   - Testing instructions
   - Categories and tags

2. **`VISUAL_ASSETS_GUIDE.md`**
   - Detailed specifications for all visual assets
   - Step-by-step creation guides
   - Tools and resources
   - Checklists

3. **`PUBLICATION_WALKTHROUGH.md`**
   - Complete publication process guide
   - Based on official Canva documentation
   - Step-by-step instructions

4. **`S3_RESTRICTIONS_GUIDE.md`**
   - S3 CORS configuration
   - Security requirements
   - Testing methods

---

## ⚠️ Important Reminders

### Before Submission

- ⚠️ **Max 5 submissions per day** - Make sure everything is ready
- ⚠️ **No localhost URLs** - Remove all development URLs
- ⚠️ **No external links** - Remove from descriptions
- ⚠️ **Test thoroughly** - Test all functionality before submitting
- ⚠️ **Proofread** - Check all text for errors

### During Review

- 📧 **Monitor JSD ticket** - All communication via ticket
- ⏱️ **Be patient** - Review takes time (varies)
- 📝 **Respond promptly** - Address feedback quickly
- 🔄 **Create new version** - If rejected, create new version (can't modify rejected version)

### After Approval

- 🎉 **Release on-demand** - You control when to release
- 📊 **Monitor analytics** - Track app performance
- 💬 **Respond to feedback** - Engage with users
- 🔄 **Plan updates** - Prepare for future versions

---

## 🎯 Quick Reference: What You Need

### Files to Prepare

1. **Production Bundle**: `dist/app.js` (from `npm run build`)
2. **App Icon**: 512x512 PNG
3. **Featured Image**: 1920x1080 PNG/JPG
4. **Screenshots**: 3-5 images (PNG/JPG)

### Content to Prepare

1. **App Name**: "Alvo Songs - Automatic Lyrics Slides"
2. **Short Description**: (see SUBMISSION_CONTENT.md)
3. **Full Description**: (see SUBMISSION_CONTENT.md)
4. **Testing Instructions**: (see SUBMISSION_CONTENT.md)

### Portal Actions

1. Upload bundle to Code upload
2. Clear Development URL
3. Fill in App listing details
4. Upload visual assets
5. Provide testing instructions
6. Submit for review

---

## ✅ Final Status

**Content**: ✅ Ready (see SUBMISSION_CONTENT.md)
**Visual Assets Guide**: ✅ Ready (see VISUAL_ASSETS_GUIDE.md)
**Code**: ✅ Build working (needs final testing)
**Documentation**: ✅ Complete

**Next Steps:**
1. Create visual assets (icon, featured image, screenshots)
2. Final testing of app functionality
3. Upload to Developer Portal
4. Submit for review

---

**You're almost ready!** 🚀

Complete the visual assets and final testing, then you can submit your app!

