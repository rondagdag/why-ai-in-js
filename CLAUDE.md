# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **monorepo collection of client-side AI demonstrations** showcasing various browser-based AI technologies. Each demo is self-contained in its own directory, with a central landing page (`index.html`) providing navigation to all demos. The project emphasizes browser-first AI processing using WebGPU, WebAssembly, and browser APIs.

## Common Development Commands

### Root Level Commands

```bash
# Start local development server for static demos
npm run dev
# or
npx http-server .

# Install dependencies for all buildable demos
npm run install:all

# Build all demos in parallel
npm run build:all

# Individual demo builds (examples)
npm run build:phi          # phi-3.5-webgpu
npm run build:explain      # explain-by-generation
npm run build:next         # next-client
```

### Working with Individual Demos

Most demos have their own development workflow:

```bash
cd [demo-name]
npm install
npm run dev      # Start development server
npm run build    # Build for production
```

### Special Cases

**Agentic RAG Sample** (Node.js application):
```bash
cd agentic-rag-sample
npm install
npm run dev      # Run with tsx
npm run build    # TypeScript compilation
npm start        # Run compiled version
```

**Browser Extensions** (explain-by-generation):
```bash
cd explain-by-generation
npm install
npm run build    # Build extension to dist/
npm test         # Run Playwright E2E tests
npm run package  # Create Chrome Web Store package
```

## Architecture Overview

### Monorepo Structure

The repository follows a **hub-and-spoke pattern**:
- **Hub**: Root `index.html` provides navigation
- **Spokes**: Each demo is independent with its own dependencies and build process
- **No shared code**: Demos intentionally don't share components to maintain independence

### Technology Categories by Demo

1. **WebGPU-Powered LLMs**
   - `phi-3.5-webgpu/`: Transformers.js + WebGPU + ONNX Runtime
   - Uses Web Workers for non-blocking model loading
   - Streaming responses with token-by-token generation

2. **ONNX Runtime Web**
   - `onnxruntimeweb-phichat/`: Chat interface with ONNX models
   - `quick-start_onnxruntime-web-script-tag/`: Minimal ESM and script tag examples

3. **Browser AI APIs** (Chrome experimental features)
   - `prompt-api-playground/`: Prompt API with Gemini Nano
   - `summarization-api-playground/`: Native summarization API
   - `translation-language-detection-api-playground/`: Translation and detection APIs

4. **TensorFlow.js**
   - `tensorflowjs-toxicity/`: Real-time toxicity detection

5. **MediaPipe**
   - `mediapipe-llm/`: MediaPipe + Gemma 2B integration
   - `mediapipe-hand-gesture/`: Hand gesture recognition
   - Requires manual model download to `models/` folder

6. **Transformers.js**
   - `transformerjs-sentiment-analysis/`: Sentiment analysis
   - `video-object-detection/`: Live object detection
   - `video-background-removal/`: Real-time background removal

7. **Browser Extensions**
   - `explain-by-generation/`: Chrome extension with side panel
   - `techstack-time-machine/`: Tech stack evolution visualizer
   - Use Vite with custom Manifest V3 build configs

8. **Server-Side RAG**
   - `agentic-rag-sample/`: Node.js + LlamaIndex.TS + Ollama
   - Requires Ollama installation and model pulling
   - Processes documents from `docs/` folder

9. **WebLLM**
   - `webllmsimple-chat-javascript/`: Browser-based LLM chat

## Critical Browser Requirements

### WebGPU Demos

Required Chrome flags (navigate to `chrome://flags/`):
- `#enable-webgpu-developer-features`
- `#enable-unsafe-webgpu`
- Restart Chrome after enabling

**Models requiring manual download**:
- Gemma 2B for MediaPipe: Download `gemma2-2b-it-gpu-int8.bin` from [Kaggle](https://www.kaggle.com/models/google/gemma-2/tfLite/gemma2-2b-it-gpu-int8) and place in `models/` folder

### Browser AI APIs

- Require Chrome Canary or Chrome 138+ with experimental features
- Must check feature availability: `'LanguageModel' in self`, `'Summarizer' in self`
- Handle downloading/downloadable states for model initialization
- Some features require 22GB+ free space for Gemini Nano download

### Ollama Setup (for agentic-rag-sample)

```bash
# Install Ollama from https://ollama.com/
ollama pull mistral:latest
cd agentic-rag-sample
npm install
npm run dev
```

## Key AI Integration Patterns

### Web Worker Pattern

Heavy AI processing happens in separate threads to prevent UI blocking:

```
Main Thread (UI) <--messages--> Web Worker (Model)
- User input             - Model loading
- Display output         - Token generation
- Progress updates       - Heavy computation
```

Example: `phi-3.5-webgpu/src/worker.js` handles model loading and generation

### Feature Detection Pattern

Always check API availability before initialization:

```javascript
if ('Summarizer' in self) {
  // Use native API
} else {
  // Show fallback message
}
```

### Streaming Response Pattern

Use `promptStreaming()` for real-time token generation:
- Progressive chunk rendering
- Tokens/second display
- Interruptible generation

### Session Management

Built-in AI APIs require careful session lifecycle:
- Create sessions with parameter validation (temperature, topK bounds)
- Handle model download states
- Properly destroy sessions when done

## Vite Configuration Patterns

### Browser Extensions

Custom entry points for Manifest V3:
```javascript
build: {
  rollupOptions: {
    input: {
      popup: 'popup.html',
      background: 'src/background.ts',
      content: 'src/content-script.ts'
    }
  }
}
```

### WebGPU Compatibility

```javascript
build: {
  target: "chrome130"  // Ensures WebGPU API compatibility
}
```

### Model Loading

- Lazy-loading with progress callbacks
- Singleton patterns: `TextGenerationPipeline.getInstance()`
- Quantization: `dtype: "q4f16"` for WebGPU
- Shader warming: Run dummy model inference before first real use

## Common Debugging Approaches

### Web Worker Message Types

Structured message passing with types:
- `check`: Verify model availability
- `load`: Initialize model with progress
- `generate`: Run inference
- `interrupt`: Stop generation
- `reset`: Clear state

### Performance Monitoring

Track generation speed:
```javascript
const tps = (numTokens / (performance.now() - startTime)) * 1000
```

### Model Loading Failures

1. Check browser WebGPU support
2. Verify Chrome flags enabled
3. Check network connectivity for model downloads
4. Verify file paths for local models
5. Check console for shader compilation errors

### Extension Permissions

Ensure manifest permissions match API usage:
- `sidePanel`: For side panel interface
- `activeTab`: For page content access
- `storage`: For preferences
- `<all_urls>`: For content script injection

## Project-Specific Notes

### File Organization Convention

```
demo-name/
├── src/              # Source code
├── public/           # Static assets, extension manifests
├── dist/             # Build output (gitignored)
├── package.json      # Dependencies and scripts
└── vite.config.js    # Build configuration
```

### Styling Approach

- Consistent Tailwind CSS across demos
- `@radix-ui/react-*` for React-based UIs
- Custom CSS for specific demo needs

### Security Considerations

- `dompurify`: XSS protection for user-generated content
- Content Security Policy for extensions
- Markdown parsing with `marked` library

### Testing

- Playwright for E2E testing (explain-by-generation)
- Manual testing required for WebGPU features
- Test model loading, generation, and error states

## Additional Resources

- Main README: Comprehensive setup instructions
- `.github/copilot-instructions.md`: Detailed architecture and patterns
- Individual demo READMEs: Demo-specific instructions and requirements
