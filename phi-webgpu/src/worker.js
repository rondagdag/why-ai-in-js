/**
 * ============================================================================
 * PHI-4 WEBGPU DEMO - Web Worker for AI Inference
 * ============================================================================
 *
 * This worker runs the Phi-4 language model entirely in the browser using:
 *
 * 1. ONNX Runtime Web - Runs optimized neural network models in the browser
 * 2. WebGPU - Hardware-accelerated GPU computation (like CUDA but for web)
 * 3. Transformers.js - Hugging Face's library for running ML models in JS
 *
 * WHY A WEB WORKER?
 * - AI inference is computationally heavy
 * - Running in a worker prevents blocking the main UI thread
 * - Users can still interact with the page while the model runs
 *
 * ============================================================================
 */

import {
  AutoTokenizer,
  AutoModelForCausalLM,
  TextStreamer,
  InterruptableStoppingCriteria,
} from "@huggingface/transformers";

/**
 * TextGenerationPipeline - Singleton pattern for model loading
 *
 * WHY SINGLETON?
 * - The model is ~1.4GB - we only want to load it ONCE
 * - Subsequent calls reuse the same model instance
 * - The ??= operator means "only assign if null/undefined"
 */
class TextGenerationPipeline {
  // Phi-4-mini: Microsoft's latest small language model (3.8B parameters)
  // Quantized to 4-bit (q4f16) to reduce size from ~7GB to ~1.4GB
  static model_id = "onnx-community/Phi-4-mini-instruct-web-q4f16";

  static async getInstance(progress_callback = null) {
    // Load the tokenizer - converts text to/from numbers (tokens)
    // Example: "Hello world" -> [15496, 995]
    this.tokenizer ??= AutoTokenizer.from_pretrained(this.model_id, {
      progress_callback,
    });

    // Load the actual neural network model
    this.model ??= AutoModelForCausalLM.from_pretrained(this.model_id, {
      // q4f16 = 4-bit quantized weights with float16 computation
      // This dramatically reduces memory while keeping good quality
      dtype: "q4f16",

      // WebGPU = GPU acceleration in the browser (like CUDA for web)
      // Falls back to WASM (CPU) if WebGPU not available
      device: "webgpu",

      // Model weights are stored in separate files for efficient loading
      use_external_data_format: true,

      progress_callback,
    });

    return Promise.all([this.tokenizer, this.model]);
  }
}

// Allows user to stop generation mid-stream (e.g., clicking "Stop" button)
const stopping_criteria = new InterruptableStoppingCriteria();

// Cache for KV (key-value) attention - speeds up multi-turn conversations
// by reusing computations from previous messages
let past_key_values_cache = null;

/**
 * GENERATE - The main text generation function
 *
 * This is where the magic happens! The LLM generates text one token at a time.
 *
 * FLOW:
 * 1. Format messages using chat template (adds special tokens)
 * 2. Create a streamer for real-time token output
 * 3. Run the model's generate() method
 * 4. Stream tokens back to UI as they're generated
 */
async function generate(messages) {
  const [tokenizer, model] = await TextGenerationPipeline.getInstance();

  // Chat template formats the conversation for the model
  // Example: [{"role": "user", "content": "Hi"}]
  // Becomes: "<|user|>Hi<|end|><|assistant|>"
  const inputs = tokenizer.apply_chat_template(messages, {
    add_generation_prompt: true, // Add the assistant prompt marker
    return_dict: true,           // Return as object with input_ids, attention_mask
  });

  // Track performance metrics (tokens per second)
  let startTime;
  let numTokens = 0;
  let tps;
  const token_callback_function = () => {
    startTime ??= performance.now();
    if (numTokens++ > 0) {
      tps = (numTokens / (performance.now() - startTime)) * 1000;
    }
  };

  // Send each generated token to the main thread for display
  const callback_function = (output) => {
    self.postMessage({
      status: "update",
      output,
      tps,
      numTokens,
    });
  };

  // TextStreamer decodes tokens to text and streams them in real-time
  const streamer = new TextStreamer(tokenizer, {
    skip_prompt: true,         // Don't echo back the user's input
    skip_special_tokens: true, // Hide tokens like <|end|>
    callback_function,
    token_callback_function,
  });

  // Notify UI that generation is starting
  self.postMessage({ status: "start" });

  // THE ACTUAL INFERENCE HAPPENS HERE
  // model.generate() runs the transformer forward pass repeatedly,
  // generating one token at a time until it hits max_new_tokens or <|end|>
  const { past_key_values, sequences } = await model.generate({
    ...inputs,

    // SAMPLING PARAMETERS - control randomness/creativity
    do_sample: true,   // Enable sampling (vs greedy decoding)
    top_k: 3,          // Only consider top 3 most likely tokens
    temperature: 0.2,  // Low = more focused, High = more random

    max_new_tokens: 1024, // Maximum tokens to generate
    streamer,             // For real-time output
    stopping_criteria,    // Allows interruption
    return_dict_in_generate: true,
  });

  // Cache attention for faster follow-up responses
  past_key_values_cache = past_key_values;

  const decoded = tokenizer.batch_decode(sequences, {
    skip_special_tokens: true,
  });

  // Signal completion to the main thread
  self.postMessage({
    status: "complete",
    output: decoded,
  });
}

/**
 * CHECK - Verify WebGPU is available
 *
 * WebGPU is the modern GPU API for the web (successor to WebGL).
 * It provides near-native GPU performance for AI inference.
 *
 * BROWSER SUPPORT (as of 2025):
 * - Chrome 113+ / Edge 113+ (Desktop)
 * - Chrome 121+ (Android)
 * - Safari 18+ (macOS/iOS)
 * - Firefox: Behind flag
 */
async function check() {
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("WebGPU is not supported (no adapter found)");
    }
  } catch (e) {
    self.postMessage({
      status: "error",
      data: e.toString(),
    });
  }
}

/**
 * LOAD - Download and initialize the model
 *
 * This function:
 * 1. Downloads model files from Hugging Face (~1.4GB, cached after first load)
 * 2. Compiles WebGPU shaders (GPU programs)
 * 3. Warms up the model with a dummy inference
 *
 * The warm-up is important because:
 * - First inference triggers JIT compilation
 * - Subsequent inferences are much faster
 */
async function load() {
  self.postMessage({
    status: "loading",
    data: "Loading Phi-4 model...",
  });

  // Download model with progress tracking
  const [tokenizer, model] = await TextGenerationPipeline.getInstance((x) => {
    // Progress callback - shows download progress in the UI
    // x contains: { file, progress, total, loaded }
    self.postMessage(x);
  });

  self.postMessage({
    status: "loading",
    data: "Compiling WebGPU shaders and warming up model...",
  });

  // WARM-UP: First inference compiles GPU shaders
  // This takes a few seconds but makes real queries faster
  const inputs = tokenizer("a");
  await model.generate({ ...inputs, max_new_tokens: 1 });

  self.postMessage({ status: "ready" });
}

/**
 * MESSAGE HANDLER - Communication with main thread
 *
 * Web Workers communicate via postMessage/onmessage.
 * This is the worker's "API" that the UI can call:
 *
 * - check: Verify WebGPU support
 * - load: Download and initialize model
 * - generate: Run inference on messages
 * - interrupt: Stop generation early
 * - reset: Clear conversation cache
 */
self.addEventListener("message", async (e) => {
  const { type, data } = e.data;

  switch (type) {
    case "check":
      check();
      break;

    case "load":
      load();
      break;

    case "generate":
      stopping_criteria.reset();
      generate(data);
      break;

    case "interrupt":
      stopping_criteria.interrupt();
      break;

    case "reset":
      past_key_values_cache = null;
      stopping_criteria.reset();
      break;
  }
});
