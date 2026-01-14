# Summarization API Playground

An interactive playground for testing Chrome's built-in Summarization API powered by Gemini Nano.

## Features

- 🤖 **Built-in AI**: Uses Chrome's native Summarizer API with Gemini Nano
- 🎯 **Multiple Summary Types**: Key points, TL;DR, teaser, and headline formats
- 📏 **Customizable Length**: Choose between short, medium, and long summaries
- 📝 **Format Options**: Output as Markdown or plain text
- 🔒 **Privacy-First**: All processing happens locally in the browser
- ⚡ **Real-time**: Instant summarization with no server calls

## Setup Requirements

### Browser Requirements

- **Chrome 127+** with Summarizer API enabled
- **GPU**: Strictly more than 4 GB of VRAM
- **Storage**: At least 22 GB of free space for Gemini Nano download
- **Network**: Unlimited data or unmetered connection for initial model download

### Enabling the Summarizer API

1. Update Chrome to version 127 or later
2. Go to `chrome://flags/#summarization-api-for-gemini-nano`
3. Select "Enabled"
4. Restart Chrome
5. The model will download automatically on first use

## Getting Started

### Installation

```bash
npm install
```

### Running the Demo

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter or paste text into the input textarea
2. Configure your preferences:
   - **Summary Type**: Choose from key-points, tldr, teaser, or headline
   - **Length**: Select short, medium, or long output
   - **Format**: Pick markdown or plain text
3. Click "Summarize" to generate the summary
4. View the AI-generated summary below

## Summary Types

- **Key Points**: Extract main points as a list
- **TL;DR**: Brief summary of the main idea
- **Teaser**: Engaging preview to entice reading
- **Headline**: Short, attention-grabbing title

## Technical Details

- **API**: Chrome's built-in Summarizer API
- **Model**: Gemini Nano (runs locally)
- **Framework**: Vite + TypeScript
- **Processing**: Client-side only (no data sent to servers)

## Browser Compatibility

- ✅ Chrome 127+ (Windows, macOS, Linux)
- ❌ Chrome for Android, iOS, ChromeOS (not yet supported)

## Hardware Requirements

- **Operating System**: Windows 10/11, macOS 13+ (Ventura and onwards), or Linux
- **Storage**: Minimum 22 GB free space in Chrome profile directory
- **GPU**: More than 4 GB of VRAM
- **Network**: Unmetered connection recommended for model download

## API Notes

This playground uses Chrome's experimental Summarizer API:

- Free to use and runs completely locally
- No data sent to external servers
- Requires Gemini Nano model (auto-downloaded on first use)
- Review [Google's Generative AI Prohibited Uses Policy](https://policies.google.com/terms/generative-ai/use-policy)
- Follow [People + AI Guidebook](https://pair.withgoogle.com/guidebook/) best practices

## Troubleshooting

**API not available:**
- Check Chrome version (127+)
- Enable the summarization flag in `chrome://flags`
- Ensure sufficient disk space (22 GB+)
- Verify GPU meets requirements (4+ GB VRAM)

**Model download issues:**
- Check available disk space
- Use unmetered network connection
- Model is removed if storage falls below 10 GB

## Resources

- [Chrome Summarization API Documentation](https://developer.chrome.com/docs/ai/summarizer-api)
- [Gemini Nano in Chrome](https://developer.chrome.com/docs/ai/built-in)

## License

Apache-2.0
