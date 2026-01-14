# Translation & Language Detection API Playground

An interactive demo showcasing Chrome's built-in **Translation API** and **Language Detection API** - on-device AI that runs entirely in your browser.

## What This Demo Shows

This playground demonstrates two powerful browser APIs:

### 1. Language Detection API
Automatically identifies the language of any text with confidence scores. The API analyzes character patterns, word structures, and linguistic features to determine the language.

```javascript
// Create a language detector
const detector = await LanguageDetector.create();

// Detect the language
const results = await detector.detect("Bonjour, comment allez-vous?");
// Returns: [{ detectedLanguage: "fr", confidence: 0.98 }, ...]
```

### 2. Translation API
Translates text between supported language pairs using neural machine translation models that run locally in your browser.

```javascript
// Create a translator for Spanish → English
const translator = await Translator.create({
  sourceLanguage: "es",
  targetLanguage: "en"
});

// Translate the text
const result = await translator.translate("¿Cómo estás?");
// Returns: "How are you?"
```

## Key Features

- **Privacy-First**: All processing happens on-device - your text never leaves your browser
- **Offline Capable**: Works without internet after initial model download
- **Real-Time Detection**: Language identification happens instantly as you type
- **Confidence Scores**: See how certain the model is about its detection
- **Quick Examples**: One-click examples to test different languages

## Setup Requirements

### Enable the APIs in Chrome

#### Language Detection API
1. Update Chrome to the latest version
2. Go to `chrome://flags/#language-detection-api`
3. Select "Enabled"
4. Click "Relaunch" or restart Chrome

#### Translation API
1. Go to `chrome://flags/#translation-api`
2. Select "Enabled"
3. (Optional) Select "Enabled without language pack limit" for more language pairs
4. Click "Relaunch" or restart Chrome

## Running the Demo

Start a local server from the repository root:

```bash
npm run dev
# or
npx http-server .
```

Then navigate to the demo in Chrome.

## Demo Guide

### Demo Flow for Presentations

1. **Start with Language Detection**
   - Click "Spanish Greeting" button to load Spanish text
   - Watch the real-time detection show "Spanish" with high confidence
   - Point out the confidence percentage

2. **Show Translation**
   - With Spanish text loaded, select "English" as target
   - Click "Translate →" to see the translation
   - Highlight that this runs entirely in-browser

3. **Test Japanese**
   - Click "Japanese Text" button
   - Show detection working with non-Latin scripts
   - Translate to English

4. **Demonstrate Detection Limits**
   - Click "French Quote" or "German Proverb"
   - Show that detection works for many languages
   - Demonstrate that translation shows a helpful message for unsupported pairs

5. **Mixed Language Test**
   - Click "Mixed Languages" button
   - Show how detection handles multilingual text
   - Discuss confidence scores for ambiguous input

### Example Texts Included

| Button | Language | Purpose |
|--------|----------|---------|
| Spanish Greeting | Spanish | Translation-ready example |
| Japanese Text | Japanese | Non-Latin script + translation |
| English Paragraph | English | Baseline for translation to Spanish/Japanese |
| French Quote | French | Detection works, translation not yet supported |
| German Proverb | German | Detection works, translation not yet supported |
| Mixed Languages | Multiple | Tests detection with ambiguous input |

## Currently Supported Translation Pairs

During the preview period, the Translation API supports:
- **English ↔ Spanish**: Full bidirectional translation
- **English ↔ Japanese**: Full bidirectional translation

Language Detection supports many more languages, including French, German, Portuguese, Italian, Chinese, Korean, and more.

## How It Works Under the Hood

### API Availability Check
```javascript
// Check if APIs are available
if ('LanguageDetector' in self && 'Translator' in self) {
  // APIs are supported
}

// Check model availability
const availability = await LanguageDetector.availability();
// Returns: 'available', 'downloadable', 'downloading', or 'unavailable'
```

### Model Download Handling
```javascript
// Handle model download with progress
const detector = await LanguageDetector.create({
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded: ${e.loaded * 100}%`);
    });
  }
});
await detector.ready;
```

### Detection Results
```javascript
const results = await detector.detect(text);
// Results array sorted by confidence:
// [
//   { detectedLanguage: "es", confidence: 0.95 },
//   { detectedLanguage: "pt", confidence: 0.03 },
//   ...
// ]
```

## Troubleshooting

### "API Not Available" Error
- Ensure you're using Chrome (not Firefox, Safari, or Edge)
- Verify the flags are enabled at `chrome://flags`
- Restart Chrome after enabling flags

### Model Download Stuck
- Check your internet connection
- Ensure you have sufficient disk space (models can be several GB)
- Try disabling and re-enabling the flags

### Translation Not Working
- Verify both source and target languages are in supported pairs
- Check the browser console for detailed error messages
- Ensure the Translation API flag is enabled

## Resources

- [Chrome AI APIs Documentation](https://developer.chrome.com/docs/ai/built-in)
- [Early Preview Program](https://developer.chrome.com/docs/ai/built-in#get_an_early_preview)
- [Language Detection API Explainer](https://github.com/nicwilliams-wf/nicwilliams-wf.github.io/blob/main/language-detection-api.md)
- [Translation API Explainer](https://nicwilliams-wf.github.io/nicwilliams-wf.github.io/translation-api.md)
