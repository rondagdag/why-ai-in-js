# WebLLM - Simple Chat (JavaScript)

A lightweight chat interface demonstrating how to run large language models directly in the browser using WebLLM.

## Features

- 🤖 **Browser-based LLM**: Run models like Llama, Mistral, and Phi directly in your browser
- ⚡ **WebGPU Acceleration**: Fast inference using GPU acceleration
- 💬 **Chat Interface**: Simple conversational UI
- 📦 **No Server Required**: Everything runs client-side
- 🔒 **Privacy-First**: Conversations never leave your device
- 🎯 **Model Selection**: Choose from multiple pre-configured models

## What is WebLLM?

WebLLM is a high-performance in-browser LLM inference engine that brings large language model inference directly onto web browsers with hardware acceleration.

## Getting Started

### Prerequisites

- Modern web browser with WebGPU support (Chrome 113+ recommended)
- Good internet connection for initial model download (1-5GB depending on model)
- Sufficient storage space for model files

### Running the Demo

1. Open `index.html` in a WebGPU-enabled browser
2. Or view the live demo on CodePen: [https://codepen.io/neetnestor/pen/vYwgZaG](https://codepen.io/neetnestor/pen/vYwgZaG)
3. Wait for the model to load (first time only)
4. Start chatting!

## Browser Requirements

- **Chrome/Edge 113+**: Full WebGPU support
- **Safari 18+**: macOS/iOS with WebGPU
- **GPU**: More than 4GB VRAM recommended
- **Storage**: 1-5GB depending on model choice

## Supported Models

WebLLM supports various models including:

- **Llama 2/3**: Meta's open-source models
- **Mistral**: High-performance open models
- **Phi**: Microsoft's efficient small models
- **Gemma**: Google's lightweight models
- **And many more**: Check WebLLM documentation for full list

## How It Works

1. **Model Loading**: Downloads quantized GGUF models from CDN
2. **WebGPU Initialization**: Sets up GPU acceleration
3. **Inference**: Processes user input through the LLM
4. **Streaming**: Displays tokens as they're generated
5. **Context Management**: Maintains conversation history

## Technical Details

- **Framework**: WebLLM library
- **Acceleration**: WebGPU for GPU inference
- **Model Format**: GGUF (quantized for efficiency)
- **Quantization**: 4-bit and 8-bit for smaller file sizes
- **Context Window**: Varies by model (typically 2K-8K tokens)

## Performance

- **First Load**: 30-120 seconds (model download)
- **Subsequent Loads**: 5-15 seconds (from cache)
- **Inference Speed**: 5-30 tokens/second (varies by hardware)
- **Memory Usage**: 2-6GB RAM depending on model

## Features of the Interface

- Simple text input for messages
- Real-time streaming responses
- Model loading indicator
- Error handling and feedback
- Conversation history display

## Customization

The demo can be customized to:

- Switch between different models
- Adjust generation parameters (temperature, top-p, max tokens)
- Modify the chat UI styling
- Add system prompts
- Implement conversation saving/loading

## Use Cases

- Educational demonstrations
- Privacy-focused chatbots
- Offline AI assistants
- Rapid prototyping
- Learning LLM integration

## Comparison with Other Approaches

**WebLLM vs Server-based:**
- ✅ No API costs
- ✅ Complete privacy
- ✅ Works offline (after initial download)
- ❌ Slower first load
- ❌ Requires modern hardware

**WebLLM vs Transformers.js:**
- ✅ Supports larger models
- ✅ Better performance for chat
- ❌ Larger downloads
- ❌ More complex setup

## Troubleshooting

**Model fails to load:**
- Check internet connection
- Verify sufficient storage space
- Try a smaller model
- Clear browser cache

**Slow performance:**
- Reduce model size
- Close other browser tabs
- Check GPU is being used
- Try a different browser

**WebGPU not available:**
- Update browser to latest version
- Check GPU compatibility
- Enable WebGPU in browser flags

## Learn More

- [WebLLM Documentation](https://webllm.mlc.ai/)
- [MLC LLM Project](https://mlc.ai/)
- [WebGPU Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- [Original CodePen](https://codepen.io/neetnestor/pen/vYwgZaG)

## Related Demos

Part of the "Why AI in JS" demo collection:

- [Phi-4 WebGPU](../phi-webgpu/) - Transformers.js chat with Phi-4
- [ONNX Runtime Web](../onnxruntimeweb-phichat/) - Alternative LLM approach
- [Prompt API Playground](../prompt-api-playground/) - Chrome's built-in AI

## Credits

Original demo by neetnestor on CodePen - adapted for this collection

## License

MIT License

