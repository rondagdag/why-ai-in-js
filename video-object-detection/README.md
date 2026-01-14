# Video Object Detection

Real-time object detection in video using Transformers.js and YOLOv9, running entirely in the browser.

## Features

- 🎥 **Real-time Detection**: Detect objects in live webcam feed
- 🤗 **Browser-based AI**: Powered by Transformers.js and YOLOv9 model
- ⚡ **GPU Acceleration**: Uses WebGPU for fast inference
- 🎯 **Multiple Objects**: Detects 80+ common objects (people, animals, vehicles, etc.)
- 🎛️ **Adjustable Parameters**: Control detection threshold and image size
- 📊 **Visual Overlay**: Bounding boxes with labels and confidence scores
- 🔒 **Privacy-First**: All processing happens locally in the browser

## How It Works

This demo uses the YOLOv9 (You Only Look Once) model from Hugging Face to perform real-time object detection. The model runs entirely in your browser using WebAssembly and WebGPU for acceleration.

## Getting Started

### Installation

```bash
npm install
```

### Running the Demo

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

## Usage

1. Click "Enable Camera" to start your webcam
2. Grant camera permissions when prompted
3. Adjust the controls:
   - **Image Size**: Model input resolution (64-256px)
   - **Threshold**: Minimum confidence for detections (0.01-1.0)
4. Watch objects being detected in real-time with bounding boxes

## Controls

- **Image Size**: Model input resolution
  - 128px = default, good balance of speed and accuracy
  - Lower values = faster but less accurate
  - Higher values = more accurate but slower
  
- **Threshold**: Detection confidence threshold
  - 0.25 = default, filters out low-confidence detections
  - Lower values = more detections (may include false positives)
  - Higher values = fewer detections (only high confidence)

## Detected Object Classes

The model can detect 80 common object classes including:

- **People**: person
- **Vehicles**: car, truck, bus, motorcycle, bicycle, airplane, train
- **Animals**: dog, cat, bird, horse, sheep, cow, elephant, bear
- **Objects**: bottle, cup, fork, knife, spoon, bowl, banana, apple
- **Furniture**: chair, couch, bed, table
- And many more!

## Browser Requirements

- **Recommended**: Chrome 113+ or Edge 113+
- **Webcam access**: Required for video input
- **HTTPS or localhost**: Required for camera permissions
- **WebGPU support**: For optimal performance

## Technical Details

- **Model**: [onnx-community/yolov9-e-onnx-web](https://huggingface.co/onnx-community/yolov9-e-onnx-web) - YOLOv9 efficient variant
- **Library**: Transformers.js for browser-based ML inference
- **Processing**: WebGPU/WebAssembly for acceleration
- **Framework**: Vite for development and building

## Performance

- **First Load**: 5-15 seconds (model download and initialization)
- **Processing**: 10-30 FPS depending on settings and hardware
- **Model Size**: ~24MB (downloaded once and cached)

## Customization

You can modify the demo in `main.js`:

- Adjust default image size
- Change detection threshold
- Customize bounding box colors
- Filter specific object classes
- Modify overlay styling

## Browser Compatibility

- ✅ Chrome 113+
- ✅ Edge 113+
- ✅ Safari 18+ (macOS/iOS with WebGPU)
- ⚠️ Firefox (limited WebGPU support)

## Use Cases

- Security and surveillance
- Traffic monitoring
- Retail analytics
- Smart home automation
- Content moderation
- Accessibility features
- Educational demonstrations

## Troubleshooting

**Camera not working:**
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browsers

**Slow performance:**
- Reduce image size (use 64 or 96px)
- Increase threshold to reduce detections
- Close other browser tabs
- Ensure GPU acceleration is enabled

**Model loading fails:**
- Check internet connection
- Clear browser cache
- Verify sufficient disk space

**No objects detected:**
- Lower the threshold value
- Ensure good lighting
- Move objects closer to camera
- Increase image size for better accuracy

## Learn More

- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [YOLOv9 Model](https://github.com/WongKinYiu/yolov9)
- [Object Detection Guide](https://huggingface.co/tasks/object-detection)
- [WebGPU Guide](https://huggingface.co/docs/transformers.js/guides/webgpu)

## License

MIT License - feel free to use this code in your projects!
