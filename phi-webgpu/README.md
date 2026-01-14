---
title: Phi-4 WebGPU
emoji: ⚡
colorFrom: blue
colorTo: purple
sdk: static
pinned: false
license: apache-2.0
models:
  - onnx-community/Phi-4-mini-instruct-web-q4f16
short_description: Run Phi-4 AI locally in your browser with WebGPU
thumbnail: https://huggingface.co/spaces/webml-community/phi-3.5-webgpu/resolve/main/banner.png
---

# Phi-4 WebGPU Demo

**Run Microsoft's Phi-4-mini LLM entirely in your browser** - no server required!

This demo showcases the power of running AI locally using:

- **[Phi-4-mini-instruct](https://huggingface.co/onnx-community/Phi-4-mini-instruct-web-q4f16)** - Microsoft's latest 3.8B parameter model
- **[Transformers.js](https://huggingface.co/docs/transformers.js)** - Hugging Face's ML library for JavaScript
- **[ONNX Runtime Web](https://onnxruntime.ai/)** - High-performance ML inference engine
- **[WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)** - Next-gen GPU API for the web

## Why This Matters

1. **Privacy**: Your conversations never leave your device
2. **No API costs**: Run unlimited inference for free
3. **Works offline**: After initial download, no internet needed
4. **Fast**: WebGPU provides near-native GPU performance

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌─────────────┐     ┌─────────────────────────────────┐   │
│  │   React UI  │────▶│         Web Worker              │   │
│  │  (App.jsx)  │◀────│        (worker.js)              │   │
│  └─────────────┘     │                                 │   │
│                      │  ┌───────────────────────────┐  │   │
│                      │  │    Transformers.js        │  │   │
│                      │  │  ┌─────────────────────┐  │  │   │
│                      │  │  │  ONNX Runtime Web   │  │  │   │
│                      │  │  │  ┌───────────────┐  │  │  │   │
│                      │  │  │  │    WebGPU     │  │  │  │   │
│                      │  │  │  │  (GPU Accel)  │  │  │  │   │
│                      │  │  │  └───────────────┘  │  │  │   │
│                      │  │  └─────────────────────┘  │  │   │
│                      │  └───────────────────────────┘  │   │
│                      └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/worker.js` | Web Worker that loads and runs the model |
| `src/App.jsx` | React UI component |
| `src/components/Chat.jsx` | Chat message display |

## Getting Started

### 1. Install Dependencies

```sh
npm install
```

### 2. Run Development Server

```sh
npm run dev
```

### 3. Open in Browser

Navigate to `http://localhost:5173` in a WebGPU-supported browser:
- Chrome 113+ / Edge 113+ (Desktop)
- Chrome 121+ (Android)
- Safari 18+ (macOS/iOS)

## How It Works

1. **Load Model**: Downloads ~1.4GB quantized model (cached after first load)
2. **Tokenize Input**: Converts text to token IDs using the tokenizer
3. **Generate**: Model predicts next token, one at a time
4. **Stream Output**: Tokens are decoded and streamed to UI in real-time

## Model Details

- **Model**: Phi-4-mini-instruct (3.8B parameters)
- **Quantization**: 4-bit (q4f16) - reduces size from ~7GB to ~1.4GB
- **Context Length**: 128K tokens
- **Speed**: ~10-30 tokens/second (varies by GPU)

## Resources

- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [WebGPU Guide](https://huggingface.co/docs/transformers.js/guides/webgpu)
- [Phi-4 Model Card](https://huggingface.co/microsoft/Phi-4-mini-instruct)
