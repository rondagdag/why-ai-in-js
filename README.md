# Why AI in JS

A collection of demos showcasing various client-side AI capabilities and APIs.

## 🎯 Quick Links

- **📊 [View the Presentation](https://rondagdag.github.io/why-ai-in-js/)** - Learn about AI in JavaScript
- **� [Download PDF](./Why%20AI%20in%20JS.pdf)** - Get the presentation slides
- **�🚀 [Try the Live Demos](https://rondagdag.github.io/why-ai-in-js/)** - Test out all the demos online

## Running Locally

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rondagdag/why-ai-in-js.git
   cd why-ai-in-js
   ```

2. **Start the server:**
   ```bash
   npx http-server
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8080`

### Browser Configuration

#### For WebGPU Demos (Phi-3.5, Video demos, ONNX Runtime)

Enable Chrome Flags:
- Open Chrome and navigate to `chrome://flags/`
- Enable these flags:
  - `#enable-webgpu-developer-features`
  - `#enable-unsafe-webgpu`
- Restart Chrome

#### For Built-in AI API Demos (Prompt, Summarization, Translation)

Enable Chrome Canary/Dev features:
- **Chrome version 127+** or **Chrome Canary**
- Enable these flags at `chrome://flags/`:
  - `#optimization-guide-on-device-model` → "Enabled BypassPerfRequirement"
  - `#prompt-api-for-gemini-nano` → "Enabled"
  - `#summarization-api-for-gemini-nano` → "Enabled"
  - `#translation-api` → "Enabled"
  - `#language-detection-api` → "Enabled"
- Restart Chrome
- Models download automatically on first use (~1.7GB for Gemini Nano)

### Optional: Build All Demos

Some demos require building before use:

```bash
# Install dependencies for all buildable demos
npm run install:all

# Build all demos
npm run build:all
```

### MediaPipe LLM Setup (Optional)

Only required for the MediaPipe LLM demo:

1. Download the Gemma 2B model:
   - Visit [Kaggle Models - Gemma 2B](https://www.kaggle.com/models/google/gemma-2/tfLite/gemma2-2b-it-gpu-int8)
   - Download `gemma2-2b-it-gpu-int8.bin` (or `gemma2-2b-it-gpu-int4.bin`)
2. Create a `models` folder in the project root
3. Place the downloaded file in the `models` folder

## Special Setup for Agentic RAG Sample

The Agentic RAG Sample is a Node.js application that requires additional setup:

### Prerequisites

1. **Install Ollama** from [https://ollama.com/](https://ollama.com/)

2. **Run the setup script** to download required models:
   ```bash
   cd agentic-rag-sample
   ./setup-ollama.sh
   ```
   
   Or manually pull the models:
   ```bash
   ollama pull mistral:latest
   ollama pull nomic-embed-text
   ```

3. **Verify Ollama is running:**
   ```bash
   ollama list
   ```

### Running the Application

```bash
cd agentic-rag-sample
npm install
npm run dev
```

### Adding Your Documents

Place documents in the `agentic-rag-sample/docs/` folder:
- Supported formats: PDF, CSV, TXT, MD
- Sample documents included for testing
- Ask questions about your documents via the RAG agent

For detailed instructions, see the [agentic-rag-sample/README.md](agentic-rag-sample/README.md)

## Browser Requirements

### Minimum Requirements

- **Modern Browser**: Chrome 113+, Edge 113+, Safari 18+, or Firefox 78+
- **Internet Connection**: Required for initial model downloads
- **Storage**: 2-5GB free space for AI models (varies by demo)

### Optimal Performance

- **GPU**: 4GB+ VRAM for WebGPU demos
- **RAM**: 8GB+ (16GB recommended for larger models)
- **CPU**: Multi-core processor for faster inference
- **OS**: Windows 10/11, macOS 13+, or Linux

### Demo-Specific Requirements

| Demo Type | Browser | Special Requirements |
|-----------|---------|---------------------|
| WebGPU Demos | Chrome 113+ | WebGPU flags enabled + GPU with 4GB+ VRAM |
| Built-in AI APIs | Chrome 127+/Canary | Feature flags enabled + 22GB disk space |
| MediaPipe | Chrome/Safari | WebGPU support preferred |
| TensorFlow.js | Any modern browser | WebGL support |
| Extensions | Chrome 127+ | Developer mode enabled |

## Development Workflows

### Individual Demo Development

Most demos can be developed independently:

```bash
# Navigate to a demo folder
cd phi-webgpu

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building Extensions

For Chrome extension demos:

```bash
cd explain-by-generation  # or techstack-time-machine

# Install and build
npm install
npm run build

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the dist/ folder
```

### Testing

Extensions include E2E tests:

```bash
cd explain-by-generation
npm test  # Runs Playwright tests
```

## Technologies Used

### AI/ML Libraries

- **Transformers.js** - Hugging Face models in the browser with WebGPU
- **ONNX Runtime Web** - Cross-platform ML inference engine
- **TensorFlow.js** - Google's ML library for JavaScript
- **MediaPipe** - Google's ML solutions for web
- **WebLLM** - High-performance in-browser LLM inference
- **LlamaIndex.TS** - RAG framework for TypeScript/JavaScript

### Browser APIs

- **WebGPU** - Next-gen GPU API for ML acceleration
- **Chrome Prompt API** - Built-in language model (Gemini Nano)
- **Chrome Summarizer API** - Native text summarization
- **Chrome Translation API** - Client-side translation
- **Language Detection API** - Automatic language identification

### Frameworks & Tools

- **React** - UI library for interactive demos
- **Vite** - Fast build tool and dev server
- **Next.js** - React framework with SSR
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Playwright** - E2E testing for extensions

## Project Structure

```
why-ai-in-js/
├── index.html                    # Main landing page
├── Why AI in JS.pdf              # Presentation slides
├── README.md                     # This file
│
├── Transformers.js Demos
│   ├── phi-webgpu/              # Phi-3.5 with WebGPU
│   ├── transformerjs-sentiment-analysis/
│   ├── video-object-detection/
│   └── video-background-removal/
│
├── ONNX Runtime Demos
│   ├── quick-start_onnxruntime-web-script-tag/
│   └── onnxruntimeweb-phichat/
│
├── MediaPipe Demos
│   ├── mediapipe-llm/
│   ├── mediapipe-hand-gesture/
│   └── right-click-for-superpowers/
│
├── Built-in AI API Demos
│   ├── prompt-api-playground/
│   ├── summarization-api-playground/
│   └── translation-language-detection-api-playground/
│
├── Chrome Extensions
│   ├── explain-by-generation/
│   └── techstack-time-machine/
│
├── Other Demos
│   ├── tensorflowjs-toxicity/
│   ├── webllmsimple-chat-javascript/
│   ├── agentic-rag-sample/      # Node.js RAG application
│   └── next-client/              # Next.js demo
│
└── models/                       # Shared model storage
```

## Available Demos

### 🤗 Transformers.js Demos

| Demo | Technology | Description |
|------|-----------|-------------|
| **Phi-3.5 WebGPU** | Transformers.js + WebGPU | Run Microsoft's Phi-3.5-mini LLM entirely in browser with GPU acceleration. Features streaming responses, real-time token generation, and ~10-30 tokens/second performance |
| **Sentiment Analysis** | Transformers.js | Real-time sentiment analysis using BERT models. Analyzes text as you type with confidence scores and visual progress bars |
| **Video Object Detection** | Transformers.js + YOLOv9 | Live object detection in webcam feed. Detects 80+ objects (people, animals, vehicles) with adjustable thresholds and bounding boxes |
| **Video Background Removal** | Transformers.js + MODNet | Real-time background removal from video using browser-based segmentation. Adjustable stream scale and image size for performance tuning |

### 🧠 ONNX Runtime Web Demos

| Demo | Technology | Description |
|------|-----------|-------------|
| **Quick Start ONNX** | ONNX Runtime Web | Minimal demo showing how to run ONNX models via script tag and ESM. Uses simple matrix multiplication model to demonstrate inference pipeline |
| **Phi Chat** | ONNX Runtime Web + WebGPU | Local chatbot using Phi-3-mini-4k-instruct with ONNX Runtime Web. Demonstrates higher-level framework usage with WebGPU acceleration |

### 🎯 MediaPipe Demos

| Demo | Technology | Description |
|------|-----------|-------------|
| **MediaPipe LLM** | MediaPipe + Gemma 2B | Text generation using Google's MediaPipe with Gemma 2B model. Requires manual model download (gemma2-2b-it-gpu-int8.bin) in models/ folder |
| **Hand Gesture Recognizer** | MediaPipe Vision | Real-time hand gesture recognition supporting thumbs up/down, peace sign, open palm, closed fist, and more with confidence scoring |
| **Right Click for Superpowers** | MediaPipe + Gemma 2B | Context menu integration for AI-powered summarization, translation, and definitions. Shows practical LLM utility beyond chat |

### 🌐 Built-in Browser AI APIs

| Demo | API | Description |
|------|-----|-------------|
| **Prompt API Playground** | Chrome Prompt API + Gemini Nano | Interactive playground for Chrome's built-in language model. Features token counting, temperature/topK controls, streaming responses, and example prompts |
| **Summarization API Playground** | Chrome Summarizer API | Test environment for text summarization with configurable types (key-points, tldr, teaser, headline), lengths, and formats (markdown/plain) |
| **Translation & Language Detection** | Chrome Translation & Language Detection APIs | Dual-purpose playground demonstrating real-time language detection with confidence scores and translation between supported language pairs |

### 🔌 Chrome Extensions

| Extension | Technology | Description |
|----------|-----------|-------------|
| **Explain by Generation** | Chrome Summarizer API | Highlight any text to get AI-powered explanations tailored to different generational communication styles (Gen Alpha to Greatest Generation) |
| **TechStack Time Machine** | Chrome Prompt API | View technical content through different software engineering eras (1970s mainframes to 2020s cloud-native) with era-appropriate terminology |

### 🚀 Other Demos

| Demo | Technology | Description |
|------|-----------|-------------|
| **TensorFlow.js Toxicity** | TensorFlow.js | Real-time toxicity detection across 7 categories (insult, threat, obscene, etc.) with confidence scores and visual feedback |
| **WebLLM Simple Chat** | WebLLM | Lightweight chat interface running Llama/Mistral/Phi models with WebGPU acceleration. First-class support for large models with GGUF quantization |
| **Agentic RAG Sample** | LlamaIndex.TS + Ollama | Node.js application demonstrating RAG with local Ollama/Mistral. Supports PDF, CSV, and text files with semantic search and embeddings |
| **Next.js Client** | Next.js | Standard Next.js project bootstrapped with create-next-app for server-side rendering and client-side demos |

Each demo is self-contained in its own directory and can be accessed through the main landing page.


