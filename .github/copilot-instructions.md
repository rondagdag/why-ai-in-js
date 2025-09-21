# AI in JavaScript Demo Collection - Copilot Instructions

## Project Overview

This is a collection of **client-side AI demonstrations** showcasing various browser-based AI technologies and APIs. The project is organized as a monorepo with multiple independent demos, each demonstrating different AI capabilities that run entirely in the browser without server dependencies.

## Key Architecture Patterns

### Project Structure
- **Monorepo organization**: Each demo is self-contained in its own directory
- **Landing page hub**: Main `index.html` provides navigation to all demos
- **Mixed tech stacks**: Different demos use different frameworks (React, Vite, vanilla JS, Next.js)
- **Browser-first**: All AI processing happens client-side using WebGPU, WebAssembly, or browser APIs

### Technology Categories
1. **WebGPU-powered LLMs**: `phi-3.5-webgpu/` (Transformers.js + WebGPU)
2. **ONNX Runtime Web**: `onnxruntimeweb-phichat/`, `quick-start_onnxruntime-web-script-tag/`
3. **Built-in Browser APIs**: `prompt-api-playground/`, `summarization-api-playground/`, `translation-language-detection-api-playground/`
4. **TensorFlow.js**: `tensorflowjs-toxicity/`
5. **MediaPipe**: `mediapipe-llm/`, `mediapipe-hand-gesture/`
6. **Transformers.js**: `transformerjs-sentiment-analysis/`, `video-object-detection/`, `video-background-removal/`
7. **Browser Extensions**: `explain-by-generation/`, `techstack-time-machine/`
8. **Server-side RAG**: `agentic-rag-sample/` (Node.js + LlamaIndex + Ollama)
9. **WebLLM**: `webllmsimple-chat-javascript/`

## Development Workflows

### Local Development Setup
```bash
# Start all static demos
npx http-server .

# Install dependencies for all buildable demos
npm run install:all

# Build all demos
npm run build:all

# Individual demo development
cd [demo-name] && npm run dev
```

### Browser Requirements
- **WebGPU demos**: Require Chrome flags enabled (`#enable-webgpu-developer-features`, `#enable-unsafe-webgpu`)
- **Built-in AI APIs**: Require Chrome Canary or experimental features enabled
- **Model downloads**: Some demos require manual model placement in `models/` folder (e.g., `gemma2-2b-it-gpu-int8.bin` for MediaPipe LLM)
- **API availability**: Built-in AI APIs require feature detection with graceful fallback (`'LanguageModel' in self`, `'Summarizer' in self`)

### Special Setup Cases
- **agentic-rag-sample**: Requires Ollama installation and model pulling (`ollama pull mistral:latest`)
- **Browser extensions**: Use Vite with custom build configs for manifest v3 compliance

## Project-Specific Conventions

### Vite Configuration Patterns
- **Browser extensions**: Custom entry points for popup, background, and content scripts
- **AI model loading**: Web Workers for non-blocking model initialization
- **WebGPU targeting**: `target: "chrome130"` for compatibility

### AI Integration Patterns
- **Web Workers**: Heavy AI processing in separate threads (`phi-3.5-webgpu/src/worker.js`)
- **Progressive loading**: Show loading states with progress bars for model downloads
- **Feature detection**: Check API availability before initialization (`'Summarizer' in self`, `'LanguageModel' in self`)
- **API state handling**: Handle downloading/downloadable states for built-in AI APIs
- **Streaming responses**: Use `promptStreaming()` for real-time token generation with progressive chunk rendering
- **Session management**: Create/destroy AI sessions with parameter validation (temperature, topK bounds)
- **Graceful degradation**: Fallback messages for unsupported browsers

### Common Component Patterns
- **Chat interfaces**: Streaming responses with tokens/second display
- **Playground UIs**: Configurable parameters with real-time updates
- **Extension architecture**: Service workers, content scripts, and popup components

### File Organization
- `src/` for source code
- `public/` for static assets and extension manifests
- `dist/` for build outputs (gitignored)
- `docs/` for RAG knowledge base (agentic-rag-sample)

## Integration Points

### Model Loading Strategies
- **Transformers.js**: HuggingFace models via CDN with WebGPU acceleration (`onnx-community/Phi-3.5-mini-instruct-onnx-web`)
- **Singleton patterns**: Lazy-loading with progress callbacks (`TextGenerationPipeline.getInstance()`)
- **Quantization**: Use `dtype: "q4f16"` for WebGPU, `q4` for performance vs quality balance
- **ONNX Runtime**: Local model files with WebAssembly runtime
- **Browser APIs**: Native summarization, translation, prompt APIs with availability checking
- **Ollama**: Local LLM server for RAG applications with embedding models

### Cross-Demo Communication
- Independent demos with no shared state
- Consistent UI patterns using Tailwind CSS
- Similar error handling and loading state management

## Testing and Debugging

### Common Issues
- **WebGPU availability**: Check browser support and feature flags
- **Model loading failures**: Verify file paths and network connectivity
- **Extension permissions**: Ensure manifest permissions match API usage
- **Ollama connectivity**: Verify service is running for RAG demos

### Debug Patterns
- **Web Worker message passing**: Use structured message types (`check`, `load`, `generate`, `interrupt`, `reset`)
- **Performance monitoring**: Track tokens/second with `(numTokens / (performance.now() - startTime)) * 1000`
- **Progressive enhancement**: Feature detection with availability state checking
- **Console logging**: Model loading progress with detailed status messages
- **Source maps**: Enabled for debugging built extensions (disabled in production)
- **Shader compilation**: Dummy model runs to warm up WebGPU shaders before first real inference

## Key Dependencies to Know

- `@huggingface/transformers`: Client-side ML model execution with WebGPU support
- `llamaindex`: RAG implementation with Ollama integration (`@llamaindex/ollama` for embeddings)
- `@radix-ui/react-*`: UI components for React-based demos
- `tailwindcss`: Consistent styling across demos
- `marked`: Markdown parsing for AI response rendering
- `dompurify`: XSS protection for user-generated content
- `npm-run-all`: Parallel script execution for monorepo builds
- Browser AI APIs: LanguageModel, Summarizer, Translation APIs (experimental)
- `vite`: Build tool with custom Chrome extension configurations

When working on this codebase, prioritize browser compatibility, progressive enhancement, and clear loading states for AI model initialization.