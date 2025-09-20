# TensorFlow.js Toxicity Detection Demo

This project demonstrates how to use TensorFlow.js and the Toxicity model to classify text for toxic content in a modern web interface.

## Features

- 🛡️ **Real-time Toxicity Detection**: Analyze any text for toxic content
- 🎯 **Multiple Categories**: Detects 7 types of toxicity (identity attack, insult, obscene, severe toxicity, sexual explicit, threat, general toxicity)
- 📊 **Confidence Scores**: Shows confidence percentages for each category
- 🎨 **Modern UI**: Clean, responsive interface with visual feedback
- ⚡ **Browser-based**: Runs entirely in the browser with no server required

## Getting Started

1. Open the `index.html` file in a web browser
2. Wait for the model to load (status will show "Ready!")
3. Type or paste text into the input field
4. Click "Analyze Text" or press Ctrl/Cmd + Enter
5. View the detailed toxicity analysis results

## How It Works

The demo uses:
- **TensorFlow.js**: For running machine learning models in the browser
- **@tensorflow-models/toxicity**: Pre-trained model for detecting toxic content
- **WebGL/WebAssembly**: For accelerated model inference

The toxicity model analyzes text across seven categories:
- **Identity Attack**: Negative comments targeting identity
- **Insult**: Insulting, inflammatory, or negative language
- **Obscene**: Obscene or vulgar language
- **Severe Toxicity**: Very hateful, aggressive, or disrespectful language
- **Sexual Explicit**: Sexually explicit content
- **Threat**: Threats of violence or harm
- **Toxicity**: General toxic behavior

## Files

- `index.html`: Main HTML interface with modern styling
- `script.js`: JavaScript module handling model loading and text analysis
- `style.css`: CSS styling for the user interface
- `README.md`: This documentation file

## Model Details

- **Model**: @tensorflow-models/toxicity
- **Threshold**: 0.5 (configurable)
- **Input**: Text strings
- **Output**: Toxicity predictions with confidence scores for each category

## Browser Requirements

- Modern web browser with JavaScript enabled
- WebGL support (for TensorFlow.js acceleration)
- Internet connection for initial model download

## Example Usage

Try analyzing these example texts:
- `"Have a great day!"` (should be classified as safe)
- `"You're stupid!"` (should trigger insult detection)
- `"This is wonderful!"` (should be classified as safe)

## Technical Implementation

The demo follows these patterns:
- **Progressive Enhancement**: Interface becomes available as model loads
- **Error Handling**: Graceful degradation when model fails to load
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Feedback**: Loading states and confidence visualization

## Dependencies

- [TensorFlow.js](https://cdn.jsdelivr.net/npm/@tensorflow/tfjs) - Machine learning library
- [TensorFlow Toxicity Model](https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity) - Pre-trained toxicity classifier

## License

This project is licensed under the MIT License.