# Canva Song Lyrics Automation App

A Canva app that automates adding song lyrics to slide presentations. Users can browse through a collection of songs, select one, and the app will automatically create multiple styled slides with the lyrics formatted with an orange background and white centered text.

## 🎯 Overview

This app allows users to:

- Browse and search through a collection of songs
- Select a song to automatically generate styled slides
- Each slide displays 4-6 lines of lyrics with consistent styling
- Slides are created with an orange background (#FF6B35) and white centered text

## ✨ Features

- **Song Browser**: Search and filter songs by title or artist
- **Automatic Slide Generation**: Splits lyrics into slides (4-6 lines per slide)
- **Styled Slides**: Orange background with white, centered, appropriately sized text
- **Progress Tracking**: Real-time progress indicator during slide creation
- **Rate Limiting**: Automatically handles Canva's rate limits (3 pages/second)
- **Error Handling**: Graceful handling of quota exceeded and rate limit errors
- **Partial Success**: Shows how many slides were created if errors occur

## 📁 Project Structure

```
canva-alvo-songs-app/
├── src/
│   ├── components/
│   │   └── SongBrowser.tsx          # Song selection UI component
│   ├── data/
│   │   └── songs.json               # Song lyrics data (3 songs currently)
│   ├── intents/
│   │   └── design_editor/
│   │       ├── app.tsx              # Main app component
│   │       └── index.tsx             # Design Editor intent setup
│   ├── utils/
│   │   ├── lyricsProcessor.ts       # Logic to split lyrics into slides
│   │   └── slideCreator.ts          # Creates styled slides in Canva
│   └── index.tsx                    # App entry point
├── styles/
│   └── components.css                # Component styles
├── canva-app.json                   # Canva app configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js `v18` or `v20.10.0`
- npm `v9` or `v10`
- A Canva Developer account

### Installation

```bash
npm install
```

### Development

1. **Start the development server:**

   ```bash
   npm start
   ```

   The server runs at `http://localhost:8080`

2. **Set up in Canva Developer Portal:**
   - Go to [Developer Portal](https://www.canva.com/developers/apps)
   - Create a new app or select existing one
   - Set **Development URL** to `http://localhost:8080`
   - Click **Preview** to open in Canva editor

3. **Enable Hot Module Replacement (optional):**
   - Copy `.env` file from Developer Portal (Security → Credentials)
   - Add `CANVA_HMR_ENABLED=TRUE` to local `.env`
   - Restart dev server for auto-reload

## 🎨 How It Works

1. **Song Selection**: User browses/search songs in the SongBrowser component
2. **Lyrics Processing**: Selected song lyrics are split into slides (4-6 lines per slide)
3. **Slide Creation**: Each slide is created with:
   - Orange background (#FF6B35)
   - White centered text
   - Appropriate font sizing (48px for lyrics, 64px for titles)
   - Proper positioning and spacing
4. **Rate Limiting**: Uses a sliding window rate limiter to respect Canva's 3 pages/second limit with minimal delays
5. **Progress Feedback**: User sees real-time progress during creation

## 🔧 Technical Details

### Rate Limiting & Quota Handling

The app handles Canva's platform limits:

- **Rate Limiting**: Max 3 pages per second (sliding window)
  - Solution: Intelligent sliding window rate limiter that tracks recent page creations
  - Dynamically calculates delays to minimize wait time while respecting limits
  - Minimum 400ms between pages (~2.5 pages/second)
  - Automatic retry on rate limit errors with exponential backoff (1.2 seconds)

- **Quota Exceeded**: Maximum pages per design
  - Solution: Partial success reporting (shows how many pages were created)
  - Clear error messages with actionable guidance

### Error Handling

- Graceful degradation when errors occur
- Partial success reporting (e.g., "Created 5 of 10 slides")
- User-friendly error messages
- Toast notifications for success and errors

### APIs Used

- `getDesignMetadata()` - Get page dimensions (replaces deprecated `getDefaultPageDimensions`)
- `addPage()` - Create new pages with elements and background
- `createRichtextRange()` - Create formatted text elements
- `notification.addToast()` - Show user feedback

## 📝 Current Status

### ✅ Completed

- [x] Canva app structure with Design Editor intent
- [x] Song browser UI with search functionality
- [x] Lyrics-to-slides conversion (4-6 lines per slide)
- [x] Slide creation with orange/white styling
- [x] Rate limiting and error handling
- [x] Progress tracking and UI feedback
- [x] Three Alvo songs added to collection
- [x] Fixed deprecated API usage (`getDesignMetadata`)
- [x] **Song title in a separate slide** - Create a dedicated title slide before lyrics slides

### 📋 Next Steps / TODOs

- [ ] Add more songs to reach ~50 songs (currently 3)
- [ ] **Remove hardcoded orange styling** - Make background color configurable
- [ ] **Adapt to existing presentation styling** - Reuse/adapt colors, fonts, and styles from the current Canva presentation instead of hardcoded values
- [ ] Test with various song lengths
- [ ] Complete app listing in Developer Portal:
  - [ ] App icon
  - [ ] Featured image
  - [ ] Description and benefits
- [ ] Localization (i18n) support
- [ ] Build production bundle: `npm run build`
- [ ] Submit for review in Developer Portal
- [ ] Release to public Apps Marketplace

## 🎵 Current Songs

The app currently includes 3 songs from Alvo:

1. **Conheci um grande amigo** - Song about meeting Jesus as a great friend
2. **Casa** - Song about being God's dwelling place
3. **Amor Pra Mim** - Song about finding love in Christ

Songs are stored in `src/data/songs.json` in the following format:

```json
{
  "id": "1",
  "title": "Song Title",
  "artist": "Artist Name",
  "lyrics": ["Line 1", "Line 2", "", "Line 3"]
}
```

## 🧪 Testing

### Local Testing

```bash
# Type checking
npm run lint:types

# Linting
npm run lint

# Formatting
npm run format

# Tests
npm test
```

### Testing Checklist

Before submission, test:

- [ ] Core functionality (browse, select, add slides)
- [ ] Different song lengths (short, medium, long)
- [ ] Error handling (quota limits, rate limiting)
- [ ] Light and dark themes
- [ ] Mobile viewport (responsive design)
- [ ] Feature support (check if `addPage` works in all design types)

## 📦 Building for Production

```bash
npm run build
```

This creates a production bundle in the `dist/` directory. Upload this to the Developer Portal under **Code upload → App source**.

**Important:** Clear the Development URL before submission.

## 🚢 Publishing

### Pre-Submission Requirements

1. **Populate Data**: Add all ~50 songs to `songs.json`
2. **Follow Design Guidelines**: Use App UI Kit components, ensure accessibility
3. **Localization**: Upload UI strings for translation (Canva translates for free)
4. **Create App Listing**: Icon, featured image, descriptions
5. **Security**: No hardcoded credentials, proper error handling

### Submission Process

1. Build production bundle: `npm run build`
2. Upload to Developer Portal → Code upload → **App source**
3. Complete app listing (icon, images, descriptions)
4. Clear Development URL
5. Submit for review

See the [Canva Apps documentation](https://www.canva.dev/docs/apps/submitting-apps) for detailed submission guidelines.

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Start with HTTPS (for Safari)
npm start --use-https

# Build for production
npm run build

# Type checking
npm run lint:types

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Tests
npm test
npm run test:watch
```

## 📚 Resources

- [Canva Apps SDK Documentation](https://www.canva.dev/docs/apps)
- [App UI Kit](https://www.canva.dev/docs/apps/app-ui-kit)
- [Design Editor Intent](https://www.canva.dev/docs/apps/intents/design-editor)
- [Developer Portal](https://www.canva.com/developers/apps)
- [Community Forum](https://community.canva.dev/)

## 📄 License

See [LICENSE.md](LICENSE.md) for details.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📝 Notes

- The app uses the Design Editor intent pattern
- All styling follows Canva's design guidelines
- Rate limiting is handled automatically to prevent API errors
- The app is configured for public distribution (set during creation, cannot be changed)

---

**Last Updated**: Initial implementation complete. Ready for testing and song collection expansion.
