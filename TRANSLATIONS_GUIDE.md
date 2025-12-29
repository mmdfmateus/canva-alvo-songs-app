# 🌐 Translations Guide for Canva App Submission

## ⚠️ Critical Requirement

**Translation is MANDATORY before submission.** You must upload your app's UI strings for translation in the Developer Portal's "Translations" section.

---

## 📋 Current Status

### Issue
Your app currently has:
- ❌ Hardcoded Portuguese strings throughout the code
- ❌ `/* eslint-disable formatjs/no-literal-string-in-jsx */` which disables translation extraction
- ❌ Empty `messages_en.json` file (no strings extracted)

### Requirement
- ✅ Source language **must be English (US)**
- ✅ All UI strings must be extractable to JSON format
- ✅ Must provide context/descriptions for translators
- ✅ File must be under 1MB

---

## 🔧 Solution: Two Options

### Option 1: Quick Fix (Recommended for Submission)

**Convert all Portuguese strings to English and create a manual translations file.**

This is faster and gets you ready for submission immediately.

#### Steps:

1. **Identify All UI Strings**
   - All user-facing text in the app
   - Button labels, error messages, placeholders, etc.

2. **Create `messages_en.json` Manually**
   - Format: JSON with string IDs and English text
   - Include descriptions for translators

3. **Upload to Developer Portal**
   - Go to Translations section
   - Upload the JSON file

#### Example Format:

```json
{
  "app.need_help": {
    "defaultMessage": "Need help?",
    "description": "Help text label shown above the tutorial button in the app interface."
  },
  "app.tutorial": {
    "defaultMessage": "Tutorial",
    "description": "Button label to open the tutorial link."
  },
  "app.loading_songs": {
    "defaultMessage": "Loading songs...",
    "description": "Loading indicator text shown while songs are being fetched from the server."
  },
  "app.search_placeholder": {
    "defaultMessage": "Search songs by title or artist...",
    "description": "Placeholder text in the search input field for finding songs."
  },
  "app.no_songs_found": {
    "defaultMessage": "No songs found matching your search.",
    "description": "Message shown when search query returns no results."
  },
  "app.no_songs_available": {
    "defaultMessage": "No songs available.",
    "description": "Message shown when there are no songs loaded in the app."
  },
  "app.settings": {
    "defaultMessage": "Settings",
    "description": "Button label to expand/collapse the settings panel."
  },
  "app.colors": {
    "defaultMessage": "Colors",
    "description": "Section title in settings panel for color customization options."
  },
  "app.background": {
    "defaultMessage": "Background",
    "description": "Label for the background color selector in settings."
  },
  "app.text": {
    "defaultMessage": "Text",
    "description": "Label for the text color selector in settings."
  },
  "app.lines_per_slide": {
    "defaultMessage": "Lines per slide",
    "description": "Section title in settings panel for configuring how many lines of lyrics appear on each slide."
  },
  "app.minimum": {
    "defaultMessage": "Minimum",
    "description": "Label for the minimum lines per slide input field."
  },
  "app.maximum": {
    "defaultMessage": "Maximum",
    "description": "Label for the maximum lines per slide input field."
  },
  "app.preparing_slides": {
    "defaultMessage": "Preparing slides...",
    "description": "Loading text shown while slides are being prepared before generation."
  },
  "app.adding_pages": {
    "defaultMessage": "Adding pages: {current} of {total}",
    "description": "Progress indicator text showing current progress of slide creation. {current} is the current page number, {total} is the total number of pages.",
    "values": {
      "current": "number",
      "total": "number"
    }
  },
  "app.wait_while_creating": {
    "defaultMessage": "Please wait while pages are being created. This may take a moment for longer songs.",
    "description": "Helper text shown during slide generation to inform users that the process may take time."
  },
  "app.error_loading_songs": {
    "defaultMessage": "Error loading songs. Using local data.",
    "description": "Error message shown when external song loading fails and app falls back to local data."
  },
  "app.error_not_presentation": {
    "defaultMessage": "Adding pages is not supported in the current design type. Please open a Presentation design.",
    "description": "Error message shown when app is opened in a design type that doesn't support adding pages (e.g., not a Presentation)."
  },
  "app.error_no_lyrics": {
    "defaultMessage": "This song has no lyrics to display.",
    "description": "Error message shown when a selected song has no lyrics content."
  },
  "app.error_creating_slides": {
    "defaultMessage": "Failed to create slides.",
    "description": "Generic error message shown when slide creation fails."
  },
  "app.error_unexpected": {
    "defaultMessage": "An unexpected error occurred while creating slides.",
    "description": "Generic error message shown when an unexpected error occurs during slide creation."
  },
  "app.success_slides_created": {
    "defaultMessage": "Added {count} slide{plural} with the lyrics of \"{title}\"!",
    "description": "Success message shown after slides are created. {count} is the number of slides, {title} is the song title, {plural} is 's' if count > 1, empty otherwise.",
    "values": {
      "count": "number",
      "title": "string",
      "plural": "string"
    }
  },
  "app.partial_success": {
    "defaultMessage": "Created {created} of {total} slides. {error}",
    "description": "Partial success message shown when some slides were created but errors occurred. {created} is number created, {total} is total expected, {error} is the error message.",
    "values": {
      "created": "number",
      "total": "number",
      "error": "string"
    }
  },
  "app.help_tooltip_background": {
    "defaultMessage": "Choose the background and text colors for the lyrics slides",
    "description": "Tooltip help text explaining the color customization options in settings."
  },
  "app.help_tooltip_lines": {
    "defaultMessage": "Configure how many lines of lyrics will appear on each slide",
    "description": "Tooltip help text explaining the lines per slide configuration option."
  }
}
```

### Option 2: Full i18n Implementation (Long-term)

**Properly implement react-intl with FormattedMessage components.**

This is the proper way but requires significant code changes.

#### Steps:

1. Remove `/* eslint-disable formatjs/no-literal-string-in-jsx */`
2. Convert all hardcoded strings to `<FormattedMessage>` components
3. Add proper descriptions for each string
4. Run `npm run extract` to generate `messages_en.json`
5. Upload to Developer Portal

#### Example Conversion:

**Before:**
```tsx
<Text>Precisa de ajuda?</Text>
<Button>Tutorial</Button>
```

**After:**
```tsx
<FormattedMessage
  defaultMessage="Need help?"
  description="Help text label shown above the tutorial button"
/>
<FormattedMessage
  defaultMessage="Tutorial"
  description="Button label to open the tutorial link"
/>
```

---

## 📝 Complete List of Strings to Translate

Based on your current code, here are all the strings that need translation:

### Main Interface
- "Precisa de ajuda?" → "Need help?"
- "Tutorial" → "Tutorial"
- "Configurações" → "Settings"
- "Carregando músicas..." → "Loading songs..."
- "Preparando slides..." → "Preparing slides..."

### Search
- "Buscar músicas por título ou artista..." → "Search songs by title or artist..."
- "Nenhuma música encontrada correspondente à sua busca." → "No songs found matching your search."
- "Nenhuma música disponível." → "No songs available."

### Settings
- "Cores" → "Colors"
- "Fundo" → "Background"
- "Texto" → "Text"
- "Linhas por slide" → "Lines per slide"
- "Mínimo" → "Minimum"
- "Máximo" → "Maximum"
- "Escolha as cores de fundo e texto dos slides de letra" → "Choose the background and text colors for the lyrics slides"
- "Configure quantas linhas de letra aparecerão em cada slide" → "Configure how many lines of lyrics will appear on each slide"

### Progress
- "Adicionando páginas: {current} de {total}" → "Adding pages: {current} of {total}"
- "Aguarde enquanto as páginas estão sendo criadas. Isso pode levar um momento para músicas mais longas." → "Please wait while pages are being created. This may take a moment for longer songs."

### Errors
- "Erro ao carregar músicas. Usando dados locais." → "Error loading songs. Using local data."
- "Adicionar páginas não é suportado no tipo de design atual. Por favor, abra um design de Apresentação." → "Adding pages is not supported in the current design type. Please open a Presentation design."
- "Esta música não tem letra para exibir." → "This song has no lyrics to display."
- "Falha ao criar slides." → "Failed to create slides."
- "Ocorreu um erro inesperado ao criar os slides." → "An unexpected error occurred while creating slides."

### Success Messages
- "Adicionado{s} {count} slide{s} com a letra de \"{title}\"!" → "Added {count} slide{s} with the lyrics of \"{title}\"!"
- "Criado{s} {created} de {total} slides. {error}" → "Created {created} of {total} slides. {error}"

### Tooltips/Aria Labels
- "Ver tutorial" → "View tutorial"
- "Aumentar mínimo" → "Increase minimum"
- "Diminuir mínimo" → "Decrease minimum"
- "Aumentar máximo" → "Increase maximum"
- "Diminuir máximo" → "Decrease maximum"

---

## 🚀 Quick Implementation Guide

### Step 1: Create the Translations File

Create `dist/messages_en.json` with all English strings (use the example format above).

### Step 2: Add Context for Translators

For each string, include:
- **defaultMessage**: The English text
- **description**: Where it appears and what it does
- **values** (if using placeholders): Types of variables

### Step 3: Upload to Developer Portal

1. Go to Developer Portal → Your App → **Translations**
2. Click "Select a file" or drag and drop
3. Upload `dist/messages_en.json`
4. Verify the file is accepted

### Step 4: Verify Requirements

- ✅ Source language is English (US)
- ✅ File is JSON format
- ✅ File is under 1MB
- ✅ All UI strings are included
- ✅ Descriptions are provided for translators

---

## 📋 Translations File Template

Here's a complete template you can use. **Copy this and fill in all your strings:**

```json
{
  "app.need_help": {
    "defaultMessage": "Need help?",
    "description": "Help text label shown above the tutorial button in the app interface."
  },
  "app.tutorial": {
    "defaultMessage": "Tutorial",
    "description": "Button label to open the tutorial link."
  },
  "app.tutorial_aria": {
    "defaultMessage": "View tutorial",
    "description": "Accessibility label for the tutorial button."
  },
  "app.loading_songs": {
    "defaultMessage": "Loading songs...",
    "description": "Loading indicator text shown while songs are being fetched from the server or local storage."
  },
  "app.search_placeholder": {
    "defaultMessage": "Search songs by title or artist...",
    "description": "Placeholder text in the search input field for finding songs in the collection."
  },
  "app.no_songs_found": {
    "defaultMessage": "No songs found matching your search.",
    "description": "Message shown in the song browser when a search query returns no matching results."
  },
  "app.no_songs_available": {
    "defaultMessage": "No songs available.",
    "description": "Message shown in the song browser when there are no songs loaded in the app."
  },
  "app.settings": {
    "defaultMessage": "Settings",
    "description": "Button label to expand or collapse the settings panel for customizing slide appearance."
  },
  "app.colors": {
    "defaultMessage": "Colors",
    "description": "Section title in the settings panel for color customization options (background and text colors)."
  },
  "app.background": {
    "defaultMessage": "Background",
    "description": "Label for the background color selector in the settings panel."
  },
  "app.text": {
    "defaultMessage": "Text",
    "description": "Label for the text color selector in the settings panel."
  },
  "app.lines_per_slide": {
    "defaultMessage": "Lines per slide",
    "description": "Section title in the settings panel for configuring how many lines of lyrics appear on each slide."
  },
  "app.minimum": {
    "defaultMessage": "Minimum",
    "description": "Label for the minimum lines per slide number input field in settings."
  },
  "app.maximum": {
    "defaultMessage": "Maximum",
    "description": "Label for the maximum lines per slide number input field in settings."
  },
  "app.preparing_slides": {
    "defaultMessage": "Preparing slides...",
    "description": "Loading text shown while slides are being prepared before generation begins."
  },
  "app.adding_pages": {
    "defaultMessage": "Adding pages: {current} of {total}",
    "description": "Progress indicator text showing current progress of slide creation. {current} is the current page number being created, {total} is the total number of pages to create.",
    "values": {
      "current": "number",
      "total": "number"
    }
  },
  "app.wait_while_creating": {
    "defaultMessage": "Please wait while pages are being created. This may take a moment for longer songs.",
    "description": "Helper text shown during slide generation to inform users that the process may take time, especially for songs with many lyrics."
  },
  "app.error_loading_songs": {
    "defaultMessage": "Error loading songs. Using local data.",
    "description": "Error message shown when external song loading fails and the app falls back to local song data."
  },
  "app.error_not_presentation": {
    "defaultMessage": "Adding pages is not supported in the current design type. Please open a Presentation design.",
    "description": "Error message shown when the app is opened in a design type that doesn't support adding pages (e.g., Social Media, Document, etc.). The app only works with Presentation designs."
  },
  "app.error_no_lyrics": {
    "defaultMessage": "This song has no lyrics to display.",
    "description": "Error message shown when a selected song has no lyrics content available."
  },
  "app.error_creating_slides": {
    "defaultMessage": "Failed to create slides.",
    "description": "Generic error message shown when slide creation fails for an unknown reason."
  },
  "app.error_unexpected": {
    "defaultMessage": "An unexpected error occurred while creating slides.",
    "description": "Generic error message shown when an unexpected error occurs during the slide creation process."
  },
  "app.success_slides_created": {
    "defaultMessage": "Added {count} slide{plural} with the lyrics of \"{title}\"!",
    "description": "Success message shown after slides are successfully created. {count} is the number of slides created, {title} is the song title, {plural} is 's' if count is greater than 1, otherwise empty string.",
    "values": {
      "count": "number",
      "title": "string",
      "plural": "string"
    }
  },
  "app.partial_success": {
    "defaultMessage": "Created {created} of {total} slides. {error}",
    "description": "Partial success message shown when some slides were created but errors occurred (e.g., rate limiting, quota exceeded). {created} is the number of slides successfully created, {total} is the total number of slides that were attempted, {error} is the error message explaining what went wrong.",
    "values": {
      "created": "number",
      "total": "number",
      "error": "string"
    }
  },
  "app.help_tooltip_background": {
    "defaultMessage": "Choose the background and text colors for the lyrics slides",
    "description": "Tooltip help text explaining the color customization options in the settings panel."
  },
  "app.help_tooltip_lines": {
    "defaultMessage": "Configure how many lines of lyrics will appear on each slide",
    "description": "Tooltip help text explaining the lines per slide configuration option in the settings panel."
  },
  "app.increase_minimum": {
    "defaultMessage": "Increase minimum",
    "description": "Accessibility label for the button to increase the minimum lines per slide value."
  },
  "app.decrease_minimum": {
    "defaultMessage": "Decrease minimum",
    "description": "Accessibility label for the button to decrease the minimum lines per slide value."
  },
  "app.increase_maximum": {
    "defaultMessage": "Increase maximum",
    "description": "Accessibility label for the button to increase the maximum lines per slide value."
  },
  "app.decrease_maximum": {
    "defaultMessage": "Decrease maximum",
    "description": "Accessibility label for the button to decrease the maximum lines per slide value."
  }
}
```

---

## ✅ Checklist for Translations

Before uploading:

- [ ] All strings are in **English (US)**
- [ ] File is valid JSON format
- [ ] File size is under 1MB
- [ ] Each string has a `defaultMessage`
- [ ] Each string has a `description` explaining:
  - Where it appears in the UI
  - What the user's intention is
  - Context for accurate translation
- [ ] Placeholders (like `{count}`) are documented in `values`
- [ ] All user-facing text is included
- [ ] No hardcoded strings remain (or they're excluded with ESLint directive)

---

## 🎯 Next Steps

1. **Create `dist/messages_en.json`** using the template above
2. **Translate all Portuguese strings to English** in the file
3. **Add descriptions** for each string (where it appears, user intention)
4. **Test JSON validity** (use a JSON validator)
5. **Upload to Developer Portal** → Translations section
6. **Verify upload** was successful

---

## 📚 Resources

- [Canva Localization Documentation](https://www.canva.dev/docs/apps/localization)
- [ICU MessageFormat Syntax](https://www.canva.dev/docs/apps/localization/icu-syntax)
- [Translator Notes Best Practices](https://www.canva.dev/docs/apps/localization#add-notes-for-translators)

---

**Important**: Even if you don't implement full i18n in your code yet, you **must** upload the translations file to proceed with submission. Canva will use this file to translate your app after approval.


