# Skill: Transformers.js Web AI Development

## What this skill covers

Expert guidance for building **browser-based AI applications** using **Transformers.js** (Hugging Face's client-side ML library). This skill provides production-ready patterns for loading ML models, running inference with WebGPU/WASM, implementing Web Workers for non-blocking UI, and optimizing performance for real-time AI applications.

**Primary domains:**
- Text generation (LLMs like Phi, LLaMA, GPT)
- Computer vision (object detection, segmentation, image classification)
- Natural language processing (sentiment analysis, summarization, translation)
- Audio processing (speech recognition, text-to-speech)
- Multimodal AI (vision-language models, image captioning)

## When to use

Invoke this skill when working on:
- **Model loading**: "load a Transformers.js model", "use WebGPU with Phi-4", "implement model caching"
- **Inference optimization**: "run model inference", "streaming text generation", "real-time object detection"
- **Web Worker patterns**: "offload AI to worker thread", "non-blocking model loading"
- **Performance tuning**: "improve tokens/second", "reduce model size", "quantization strategies"
- **Browser compatibility**: "check WebGPU support", "fallback to WASM", "progressive enhancement"
- **Specific tasks**: "sentiment analysis demo", "chat interface with LLM", "video object detection"

**Trigger phrases:**
- "Transformers.js", "@huggingface/transformers", "Xenova models"
- "WebGPU inference", "ONNX Runtime Web", "browser ML"
- "phi-4", "phi-3.5", "distilbert", "GELAN", "vision models"
- "pipeline API", "AutoModel", "AutoTokenizer", "AutoProcessor"
- "streaming generation", "tokens per second", "KV cache"

## Architecture Patterns

### 1. Singleton Model Loading Pattern

**Use for:** Any model that loads once and serves multiple requests.

```javascript
class TextGenerationPipeline {
  static model_id = "onnx-community/Phi-4-mini-instruct-web-q4f16";
  
  static async getInstance(progress_callback = null) {
    // Use ??= to load only once
    this.tokenizer ??= AutoTokenizer.from_pretrained(this.model_id, {
      progress_callback,
    });
    
    this.model ??= AutoModelForCausalLM.from_pretrained(this.model_id, {
      dtype: "q4f16",           // 4-bit quantization for size reduction
      device: "webgpu",          // GPU acceleration (fallback to WASM)
      use_external_data_format: true,  // For large models split into chunks
      progress_callback,
    });
    
    return Promise.all([this.tokenizer, this.model]);
  }
}
```

**Key principles:**
- Singleton prevents redundant downloads (~1.4GB models)
- Progress callbacks provide user feedback during download
- Quantization (`q4f16`) reduces memory by 4-8x
- External data format handles models > 2GB

### 2. Web Worker for Non-Blocking Inference

**Use for:** Any compute-intensive AI task to prevent UI freezing.

**File structure:**
```
src/
├── main.js         # UI code
└── worker.js       # AI processing
```

**worker.js (inference thread):**
```javascript
import { pipeline, AutoModel } from "@huggingface/transformers";

let sentimentPipeline = null;

self.addEventListener("message", async (e) => {
  const { type, data } = e.data;
  
  switch (type) {
    case "load":
      sentimentPipeline = await pipeline("sentiment-analysis");
      self.postMessage({ status: "ready" });
      break;
      
    case "analyze":
      const result = await sentimentPipeline(data.text);
      self.postMessage({ status: "complete", result });
      break;
  }
});
```

**main.js (UI thread):**
```javascript
const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module"
});

worker.postMessage({ type: "load" });

worker.onmessage = (e) => {
  if (e.data.status === "ready") {
    console.log("Model loaded!");
  } else if (e.data.status === "complete") {
    displayResult(e.data.result);
  }
};

// Trigger inference
worker.postMessage({ 
  type: "analyze", 
  data: { text: "This is amazing!" } 
});
```

### 3. Streaming Text Generation

**Use for:** Chat interfaces, real-time LLM output, token-by-token display.

```javascript
import { TextStreamer, InterruptableStoppingCriteria } from "@huggingface/transformers";

const stopping_criteria = new InterruptableStoppingCriteria();

async function generateStreaming(messages, onToken, onComplete) {
  const [tokenizer, model] = await TextGenerationPipeline.getInstance();
  
  // Format messages for chat models
  const inputs = tokenizer.apply_chat_template(messages, {
    add_generation_prompt: true,
    return_dict: true,
  });
  
  let numTokens = 0;
  const startTime = performance.now();
  
  const callback_function = (output) => {
    onToken(output); // Display token immediately
  };
  
  const token_callback_function = () => {
    numTokens++;
    const tps = (numTokens / (performance.now() - startTime)) * 1000;
    onToken(null, tps); // Update tokens/second metric
  };
  
  const streamer = new TextStreamer(tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function,
    token_callback_function,
  });
  
  const { sequences } = await model.generate({
    ...inputs,
    do_sample: true,
    top_k: 3,              // Restrict to top-k tokens (quality vs speed)
    temperature: 0.2,      // Lower = more deterministic
    max_new_tokens: 1024,
    streamer,
    stopping_criteria,
  });
  
  const decoded = tokenizer.batch_decode(sequences, {
    skip_special_tokens: true,
  });
  
  onComplete(decoded);
}

// Usage:
generateStreaming(
  [{ role: "user", content: "What is AI?" }],
  (token, tps) => {
    if (token) appendToChat(token);
    if (tps) updateMetrics(tps);
  },
  (fullResponse) => console.log("Done:", fullResponse)
);
```

### 4. Real-Time Computer Vision

**Use for:** Video object detection, background removal, pose estimation.

```javascript
import { AutoModel, AutoProcessor, RawImage } from "@huggingface/transformers";

const model = await AutoModel.from_pretrained("Xenova/gelan-c_all");
const processor = await AutoProcessor.from_pretrained("Xenova/gelan-c_all");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let isProcessing = false;

function processFrame() {
  const { width, height } = canvas;
  context.drawImage(video, 0, 0, width, height);
  
  if (!isProcessing) {
    isProcessing = true;
    (async function() {
      const pixelData = context.getImageData(0, 0, width, height).data;
      const image = new RawImage(pixelData, width, height, 4);
      
      const inputs = await processor(image);
      const { outputs } = await model(inputs);
      
      // Render bounding boxes
      outputs.tolist().forEach(([xmin, ymin, xmax, ymax, score, id]) => {
        if (score > 0.25) drawBox(xmin, ymin, xmax, ymax, id);
      });
      
      isProcessing = false;
    })();
  }
  
  requestAnimationFrame(processFrame);
}

// Start video stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(processFrame);
  });
```

### 5. Simple Pipeline API (Quick Start)

**Use for:** Rapid prototyping, simple use cases without customization.

```javascript
import { pipeline } from "@huggingface/transformers";

// Sentiment analysis
const sentiment = await pipeline("sentiment-analysis");
const result = await sentiment("I love Transformers.js!");
// Output: [{ label: "POSITIVE", score: 0.9998 }]

// Translation
const translator = await pipeline(
  "translation_en_to_de", 
  "Xenova/nllb-200-distilled-600M"
);
const output = await translator("Hello, how are you?");
// Output: [{ translation_text: "Hallo, wie geht es dir?" }]

// Image classification
const classifier = await pipeline("image-classification");
const predictions = await classifier("https://example.com/cat.jpg");
// Output: [{ label: "tabby cat", score: 0.94 }, ...]
```

## Best Practices Checklist

### Model Selection & Loading

- [ ] **Choose quantized models** for production: `q4` (4-bit), `q4f16` (4-bit weights + float16)
  - Full precision: ~7GB for Phi-4 → `q4f16`: ~1.4GB
- [ ] **Use external data format** for models > 2GB: `use_external_data_format: true`
- [ ] **Enable WebGPU** when available: `device: "webgpu"` (10-20x faster than WASM)
- [ ] **Provide progress callbacks** for download feedback (models can be 1-3GB)
- [ ] **Warm up models** with dummy inference to precompile GPU shaders
  ```javascript
  const inputs = tokenizer("a");
  await model.generate({ ...inputs, max_new_tokens: 1 });
  ```

### Performance Optimization

- [ ] **Set appropriate `top_k`**: Lower values (3-10) for speed, higher (40-50) for diversity
- [ ] **Adjust `temperature`**: 0.1-0.5 for deterministic, 0.7-1.0 for creative
- [ ] **Limit `max_new_tokens`**: Prevents runaway generation (512-1024 typical)
- [ ] **Use KV cache** for multi-turn chat: `return_dict_in_generate: true`, cache `past_key_values`
- [ ] **Throttle video processing**: Skip frames if previous inference still running
- [ ] **Batch processing**: Process multiple inputs together when possible

### Browser Compatibility

- [ ] **Check WebGPU availability**:
  ```javascript
  async function checkWebGPU() {
    try {
      const adapter = await navigator.gpu?.requestAdapter();
      return !!adapter;
    } catch {
      return false;
    }
  }
  ```
- [ ] **Graceful fallback** to WASM if WebGPU unavailable
- [ ] **Feature detection** before using experimental APIs
- [ ] **Clear error messages** for unsupported browsers

### Memory Management

- [ ] **Use Web Workers** to isolate model memory from main thread
- [ ] **Dispose models** when switching: `model = null; tokenizer = null;`
- [ ] **Monitor memory**: `performance.memory.usedJSHeapSize` (Chrome only)
- [ ] **Limit concurrent inferences**: Queue requests instead of parallel execution

### User Experience

- [ ] **Show loading progress** with visual indicators during download
- [ ] **Display tokens/second** metric for transparency
- [ ] **Allow interruption**: Use `InterruptableStoppingCriteria` for long generations
- [ ] **Stream responses** for perceived speed (don't wait for full completion)
- [ ] **Provide examples** to demonstrate capabilities immediately

## Model Recommendations by Task

### Text Generation (LLMs)
- **Phi-4-mini** (`onnx-community/Phi-4-mini-instruct-web-q4f16`): 3.8B params, strong reasoning
- **Phi-3.5-mini** (`onnx-community/Phi-3.5-mini-instruct-onnx-web`): Faster, good for chat
- **Gemma-2B** (`Xenova/gemma-2b-it`): Google's compact model, Apache 2.0 license

### Sentiment Analysis
- **DistilBERT** (`Xenova/distilbert-base-uncased-finetuned-sst-2-english`): 67MB, very fast

### Object Detection
- **GELAN** (`Xenova/gelan-c_all`): Real-time detection, COCO dataset
- **YOLOv9** (`Xenova/yolov9-c_all`): Latest YOLO, 80 classes

### Image Segmentation
- **SegFormer** (`Xenova/segformer_b2_clothes`): Clothing segmentation
- **SAM** (`Xenova/sam-vit-base`): Segment Anything Model

### Embeddings
- **all-MiniLM-L6-v2** (`Xenova/all-MiniLM-L6-v2`): Fast, 384-dim embeddings
- **BGE-small** (`Xenova/bge-small-en-v1.5`): High quality, 384-dim

## Common Pitfalls & Solutions

### Problem: First inference is slow (5-10 seconds)

**Cause:** WebGPU shader compilation on first run.

**Solution:** Warm up model during loading phase:
```javascript
// After loading model
const dummyInputs = tokenizer("warmup");
await model.generate({ ...dummyInputs, max_new_tokens: 1 });
```

### Problem: Model download hangs or fails

**Cause:** Network issues, CORS, or blocked CDN.

**Solution:**
- Use CDN: `cdn: "jsdelivr"` in `from_pretrained()`
- Check browser console for CORS errors
- Test with different model first (smaller one)

### Problem: "Out of memory" errors

**Cause:** Model too large for device GPU memory.

**Solutions:**
- Use smaller quantization: `q4` instead of `q8` or `fp16`
- Switch to smaller model variant (e.g., Phi-3.5-mini vs Phi-4)
- Reduce `max_new_tokens` to limit memory usage
- Close other GPU-intensive tabs

### Problem: Slow inference despite WebGPU

**Cause:** Non-optimal sampling parameters or model not cached.

**Solutions:**
- Lower `top_k` to 3-10 for faster sampling
- Reduce `temperature` to 0.2 for fewer computations
- Ensure model files are cached (check IndexedDB in DevTools)
- Use `do_sample: false` for greedy decoding (fastest)

### Problem: Chat model generates wrong format

**Cause:** Missing or incorrect chat template.

**Solution:** Always use `apply_chat_template()`:
```javascript
const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Hello!" }
];

const inputs = tokenizer.apply_chat_template(messages, {
  add_generation_prompt: true,  // Add <|assistant|> prompt
  return_dict: true,
});
```

## Vite Configuration for Transformers.js

**Essential setup for WebGPU and Web Workers:**

```javascript
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "chrome130",  // WebGPU support
    rollupOptions: {
      output: {
        manualChunks: {
          transformers: ["@huggingface/transformers"],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ["@huggingface/transformers"],
  },
  worker: {
    format: "es",  // ES modules in workers
  },
});
```

## Testing & Debugging

### Check Model Availability
```javascript
// Verify model exists on Hugging Face
const modelId = "onnx-community/Phi-4-mini-instruct-web-q4f16";
const url = `https://huggingface.co/${modelId}`;
// Visit URL to check if model is public and has ONNX files
```

### Monitor Performance
```javascript
const startTime = performance.now();
const result = await model.generate(inputs);
const inferenceTime = performance.now() - startTime;
console.log(`Inference: ${inferenceTime.toFixed(0)}ms`);

// Track tokens/second
const tps = (numTokens / inferenceTime) * 1000;
console.log(`Speed: ${tps.toFixed(1)} tokens/sec`);
```

### Debug Worker Messages
```javascript
// worker.js
self.addEventListener("message", (e) => {
  console.log("[Worker] Received:", e.data.type, e.data);
  // ... handle message
  self.postMessage({ type: "debug", data: "Processing..." });
});

// main.js
worker.onmessage = (e) => {
  console.log("[Main] Received:", e.data);
};
```

## Code References in This Repo

- **LLM with streaming**: `phi-webgpu/src/worker.js` (Phi-4 generation)
- **Simple pipeline**: `transformerjs-sentiment-analysis/script.js` (DistilBERT)
- **Real-time vision**: `video-object-detection/main.js` (GELAN object detection)
- **Vite config**: `phi-webgpu/vite.config.js` (WebGPU + workers)
- **Best practices doc**: `.github/copilot-instructions.md` (project patterns)

## Quick Reference Commands

```bash
# Install Transformers.js
npm install @huggingface/transformers

# Via CDN (for prototyping)
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';

# Start dev server
npm run dev

# Check WebGPU in Chrome
chrome://flags/#enable-webgpu-developer-features
```

## Examples by Use Case

### Example 1: Add sentiment analysis to existing app

```javascript
// 1. Install dependency
// npm install @huggingface/transformers

// 2. Create analyzer module
import { pipeline } from "@huggingface/transformers";

let analyzer = null;

export async function initSentiment() {
  analyzer = await pipeline("sentiment-analysis");
  return analyzer;
}

export async function analyzeSentiment(text) {
  if (!analyzer) await initSentiment();
  const result = await analyzer(text);
  return result[0]; // { label: "POSITIVE", score: 0.99 }
}

// 3. Use in your app
import { analyzeSentiment } from "./sentiment.js";

const result = await analyzeSentiment("This is great!");
console.log(result.label, (result.score * 100).toFixed(0) + "%");
```

### Example 2: Build a chat interface with Phi-4

See `phi-webgpu/src/worker.js` for full implementation.

**Key steps:**
1. Load model in Web Worker
2. Use `apply_chat_template()` for message formatting
3. Stream tokens with `TextStreamer`
4. Display tokens/second for user feedback
5. Allow interruption with stop button

### Example 3: Real-time video object detection

See `video-object-detection/main.js` for full implementation.

**Key steps:**
1. Load model + processor
2. Get webcam stream with `getUserMedia()`
3. Process frames in `requestAnimationFrame()` loop
4. Skip frames if still processing (use `isProcessing` flag)
5. Render bounding boxes on overlay canvas

## Tips & Pro Techniques

1. **Preload critical models**: Load during page load, not on first interaction
2. **Use CDN for demos**: `cdn: "jsdelivr"` faster than direct HF Hub
3. **Cache strategically**: IndexedDB auto-caches models (check DevTools → Application)
4. **Batch tokenization**: `tokenizer([text1, text2, ...])` for multiple inputs
5. **Monitor GPU usage**: Chrome Task Manager → GPU Memory column
6. **Test offline**: Cached models work without internet after first load
7. **Use TypeScript**: `@huggingface/transformers` has excellent type definitions

## Last Updated
January 2025 - Transformers.js v3.8+, Phi-4 models, WebGPU stable in Chrome 130+
