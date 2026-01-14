# Right Click for Superpowers

Add AI-powered context menu capabilities to any webpage using Google's Gemma 2B LLM running entirely in the browser via MediaPipe.

## Features

- 🖱️ **Context Menu Integration**: Right-click to access AI features
- 🤖 **Local LLM**: Runs Gemma 2B model entirely in the browser
- ⚡ **Common Tasks**: Summarization, translation, and text explanations
- 🎯 **Practical Utility**: Real-world use cases beyond simple chat
- 🔒 **Privacy-First**: All processing happens locally
- 📦 **Extension-Ready**: Can be adapted into a Chrome extension

## How It Works

This demo shows how to add utility to any webpage by integrating an LLM (Google's Gemma 2B) to perform common tasks:

- **Summarization**: Condense long text into key points
- **Translation**: Convert text between languages
- **Definitions**: Explain words or phrases in simpler terms
- **Context Actions**: Access via right-click menu

![Demo](https://github.com/jasonmayes/web-ai-demos/blob/main/right-click-for-superpowers/demo_llm.gif?raw=true)

## Getting Started

### Prerequisites

- Modern web browser with WebGPU support (Chrome recommended)
- Good internet connection for initial model download (1.3GB)
- Local web server (e.g., `http-server`, `live-server`)

### Running the Demo

1. Start a local web server in this directory:
   ```bash
   npx http-server -p 8080
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

3. Wait for the model to download (first time only, ~1.3GB)

4. Right-click on any text to access AI-powered features

## Browser Requirements

- **Chrome/Edge 113+**: WebGPU support required
- **Storage**: At least 2GB free space for model
- **GPU**: More than 4GB VRAM recommended

## Technical Details

- **Model**: Gemma 2B (Google's lightweight LLM)
- **Framework**: MediaPipe LLM Inference API
- **Quantization**: INT4 for reduced size (~1.3GB)
- **Runtime**: WebGPU for GPU acceleration
- **Processing**: Entirely client-side

## Use Cases

- **Reading Assistance**: Simplify complex articles
- **Learning Tools**: Get definitions and explanations
- **Content Creation**: Quick summaries and translations
- **Accessibility**: Make content easier to understand
- **Research**: Extract key information quickly

## Chrome Extension Potential

This demo can be converted into a Chrome extension to:
- Work across all websites
- Cache the model for instant loading
- Provide persistent AI capabilities
- Add toolbar shortcuts
- Integrate with browser features

## Important Notes

### Model Caching

This demo intentionally does **not** cache the model to keep the code simple for demonstration purposes.

For production use, you should:

1. Download the Gemma model from Kaggle:
   - Visit: https://www.kaggle.com/models/google/gemma/tfLite/gemma-2b-it-gpu-int4
   - Download: `gemma-2b-it-gpu-int8.bin`

2. Host the model yourself (for caching support)

3. Update `script.js` to point to your hosted model file

### Prompt Engineering

This demo uses basic prompts that may not be perfect for all use cases. For production:

- Fine-tune the model for specific tasks
- Improve prompt engineering
- Distill from larger models
- Add task-specific validation

## Customization

You can modify `script.js` to:

- Add custom context menu items
- Change prompt templates
- Adjust model parameters
- Add new AI-powered features
- Customize UI styling

## Performance

- **First Load**: 30-60 seconds (model download)
- **Subsequent Loads**: Instant (if model is cached)
- **Inference**: 1-3 seconds per request
- **Memory**: ~2GB RAM for model

## Files

- `index.html` - Main HTML interface
- `script.js` - JavaScript with MediaPipe LLM integration
- `style.css` - Styling for UI and context menu
- `demo_llm.gif` - Demo animation

## Troubleshooting

**Model fails to load:**
- Ensure stable internet connection
- Check available disk space (need 2GB+)
- Clear browser cache and retry

**Slow performance:**
- Verify WebGPU is enabled
- Close other browser tabs
- Check GPU meets requirements

**Context menu not appearing:**
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify text is selectable

## Learn More

- [MediaPipe LLM Inference](https://developers.google.com/mediapipe/solutions/genai/llm_inference/web_js)
- [Gemma Model](https://www.kaggle.com/models/google/gemma)
- [WebGPU Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)

## Credits

Original demo by Jason Mayes - adapted for "Why AI in JS" demo collection

## License

MIT License - feel free to use and adapt this code!
