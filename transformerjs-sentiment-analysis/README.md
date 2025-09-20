# Transformers.js Sentiment Analysis Demo

A real-time sentiment analysis demo using [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js) that runs entirely in the browser.

## Features

- 🤗 **Browser-based AI**: No server required - everything runs in your browser
- ⚡ **Real-time Analysis**: Analyze sentiment as you type (with debounce)
- 🎯 **Accurate Results**: Uses pre-trained BERT models from Hugging Face
- 📊 **Visual Results**: Color-coded sentiment with confidence scores and progress bars
- 🔧 **Easy to Use**: Simple text input with instant feedback

## How It Works

This demo uses the Transformers.js library to load and run a pre-trained sentiment analysis model directly in the browser. The default model is `nlptown/bert-base-multilingual-uncased-sentiment`, which can classify text into positive/negative sentiment with confidence scores.

### Code Example

```javascript
import { pipeline } from '@huggingface/transformers';

// Allocate a pipeline for sentiment-analysis
const pipe = await pipeline('sentiment-analysis');

// Analyze sentiment
const out = await pipe('I love transformers!');
// [{'label': 'POSITIVE', 'score': 0.999817686}]
```

## Getting Started

### Prerequisites

- Modern web browser with ES6 module support
- Internet connection (for initial model download)

### Installation

1. Clone or download this demo
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Demo

1. Start a local server:
   ```bash
   npm run dev
   ```
   This will start a server on `http://localhost:3000` and open the demo in your browser.

2. Or simply open `index.html` in your browser if you have a local server running.

## Usage

1. **Enter Text**: Type or paste text into the textarea
2. **Analyze**: Click "Analyze Sentiment" or wait for real-time analysis (500ms debounce)
3. **View Results**: See sentiment classification with confidence scores and visual indicators

### Example Inputs to Try

- **Positive**: "I love this product! It's amazing!"
- **Negative**: "This is terrible and disappointing."
- **Neutral**: "The weather is cloudy today."

## Technical Details

### Model Information

- **Default Model**: `nlptown/bert-base-multilingual-uncased-sentiment`
- **Task**: Text Classification (Sentiment Analysis)
- **Runtime**: Browser WebAssembly via Transformers.js
- **Model Size**: ~110MB (downloaded once and cached)

### Performance

- **First Load**: 5-15 seconds (model download and initialization)
- **Subsequent Analysis**: Near-instant
- **Memory Usage**: ~200-300MB for model in memory

### Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Edge 88+

## Customization

### Using Different Models

You can modify `script.js` to use different sentiment analysis models:

```javascript
// Use a different model
this.pipe = await pipeline('sentiment-analysis', 'cardiffnlp/twitter-roberta-base-sentiment-latest');
```

### Popular Sentiment Models

- `cardiffnlp/twitter-roberta-base-sentiment-latest` - Twitter-optimized
- `nlptown/bert-base-multilingual-uncased-sentiment` - Multilingual support
- `distilbert-base-uncased-finetuned-sst-2-english` - Lightweight English model

## Project Structure

```
transformerjs-sentiment-analysis/
├── index.html          # Main HTML interface
├── script.js           # JavaScript with Transformers.js integration
├── style.css           # Styling and animations
├── package.json        # Dependencies and scripts
└── README.md          # This documentation
```

## Related Demos

This is part of the "AI in JavaScript" demo collection. Check out other demos:

- [Phi-3.5 WebGPU Chat](../phi-3.5-webgpu/) - Local LLM chat with WebGPU acceleration
- [Prompt API Playground](../prompt-api-playground/) - Browser's built-in AI APIs
- [TensorFlow.js Toxicity](../tensorflowjs-toxicity/) - Content moderation
- [MediaPipe LLM](../mediapipe-llm/) - Google's MediaPipe for text generation

## Troubleshooting

### Model Loading Issues

- **Slow Loading**: Model downloads ~110MB on first use. Subsequent loads use browser cache.
- **Network Errors**: Ensure stable internet connection for initial model download.
- **Memory Issues**: Close other browser tabs if experiencing performance problems.

### Browser Compatibility

- **Module Errors**: Ensure your browser supports ES6 modules
- **CORS Issues**: Use a local server rather than opening HTML files directly

## Learn More

- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [Hugging Face Model Hub](https://huggingface.co/models?pipeline_tag=text-classification)
- [Sentiment Analysis Guide](https://huggingface.co/tasks/text-classification)

## License

MIT License - feel free to use this code in your own projects!