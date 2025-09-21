# MediaPipe Hand Gesture Recognizer Demo

A simple, interactive web demo that recognizes hand gestures in real-time using Google's MediaPipe Gesture Recognizer.

## Features

- 🤖 Real-time hand gesture recognition
- 📷 Live webcam integration
- 🎨 Clean, responsive UI
- ✋ Support for multiple gesture types
- 📊 Confidence scoring
- 🖼️ Hand landmark visualization

## Supported Gestures

- 👍 Thumbs Up
- 👎 Thumbs Down  
- ✌️ Victory/Peace Sign
- 👋 Open Palm
- ✊ Closed Fist
- 🤟 ILoveYou Sign
- 👉 Pointing Up

## Quick Start

### Option 1: Direct Usage (No Installation)

Simply open `index.html` in a modern web browser that supports MediaPipe (Chrome recommended).

### Option 2: Local Development Server

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8080`

## Browser Requirements

- **Recommended:** Chrome 91+ or Edge 91+
- **Webcam access** required
- **HTTPS or localhost** required for camera permissions

## How to Use

1. Open the demo in your browser
2. Click "Enable Camera" to start webcam
3. Show your hand gestures to the camera
4. Watch real-time gesture recognition results
5. See hand landmarks drawn on the video feed

## Demo Features

- **Real-time Processing:** Gestures are recognized in real-time with low latency
- **Confidence Scores:** Each gesture shows a confidence percentage
- **Visual Feedback:** Hand landmarks are drawn on the video feed
- **Mobile Friendly:** Responsive design works on mobile devices
- **Easy Integration:** Simple, clean code structure for easy customization

## Technical Details

- **MediaPipe Tasks Vision:** Uses `@mediapipe/tasks-vision` library
- **CDN Delivery:** Models loaded via CDN for quick startup
- **GPU Acceleration:** Leverages WebGPU when available
- **ES6 Modules:** Modern JavaScript with module imports

## Customization

The demo is designed to be easily customizable:

- **Gestures:** Modify supported gestures in `script.js`
- **Styling:** Update colors and layout in `style.css`
- **Confidence Threshold:** Adjust minimum confidence in `script.js`
- **UI Elements:** Modify HTML structure in `index.html`

## Troubleshooting

- **Camera not working:** Check browser permissions and HTTPS/localhost requirement
- **Gestures not detected:** Ensure good lighting and clear hand visibility
- **Performance issues:** Try disabling GPU delegation or reducing video resolution
- **Model loading fails:** Check internet connection for CDN access

## License

MIT License - Feel free to use and modify for your projects.

## Links

- [MediaPipe Documentation](https://developers.google.com/mediapipe)
- [MediaPipe Tasks Vision](https://www.npmjs.com/package/@mediapipe/tasks-vision)
- [Hand Gesture Recognition Guide](https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer)