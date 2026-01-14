# Video Background Removal

Real-time background removal from video using Transformers.js and MODNet, running entirely in the browser.

## Features

- 🎥 **Real-time Processing**: Remove backgrounds from live webcam feed
- 🤗 **Browser-based AI**: Powered by Transformers.js and MODNet model
- ⚡ **GPU Acceleration**: Uses WebGPU for fast inference
- 🎛️ **Adjustable Parameters**: Control stream scale and image size
- 🖼️ **Live Preview**: See original and processed video side-by-side
- 🔒 **Privacy-First**: All processing happens locally in the browser

## How It Works

This demo uses the MODNet (Mobile Object Detection Network) model from Hugging Face to perform real-time background segmentation and removal. The model runs entirely in your browser using WebAssembly and WebGPU for acceleration.

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
   - **Stream Scale**: Lower values = faster processing (0.1 - 1.0)
   - **Image Size**: Shorter edge length, lower = faster (64 - 512px)
4. Watch the real-time background removal in action

## Controls

- **Stream Scale**: Resize input frames for faster processing
  - 0.5 = half resolution (default, good balance)
  - Lower values improve speed but reduce quality
  
- **Image Size**: Model input resolution
  - 256px = default, good quality/speed balance
  - Lower values = faster but less accurate
  - Higher values = more accurate but slower

## Browser Requirements

- **Recommended**: Chrome 113+ or Edge 113+
- **Webcam access**: Required for video input
- **HTTPS or localhost**: Required for camera permissions
- **WebGPU support**: For optimal performance

## Technical Details

- **Model**: [Xenova/modnet](https://huggingface.co/Xenova/modnet) - Mobile Object Detection Network
- **Library**: Transformers.js for browser-based ML inference
- **Processing**: WebGPU/WebAssembly for acceleration
- **Framework**: Vite for development and building

## Performance

- **First Load**: 5-10 seconds (model download and initialization)
- **Processing**: 15-30 FPS depending on settings and hardware
- **Model Size**: ~1MB (downloaded once and cached)

## Customization

You can modify the demo in `main.js`:

- Adjust default stream scale
- Change image size presets
- Modify canvas rendering
- Add background replacement images

## Browser Compatibility

- ✅ Chrome 113+
- ✅ Edge 113+
- ✅ Safari 18+ (macOS/iOS with WebGPU)
- ⚠️ Firefox (limited WebGPU support)

## Use Cases

- Virtual backgrounds for video calls
- Content creation and streaming
- Privacy protection in videos
- Product photography
- Educational demonstrations

## Troubleshooting

**Camera not working:**
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browsers

**Slow performance:**
- Reduce stream scale (lower value)
- Decrease image size
- Close other browser tabs
- Ensure GPU acceleration is enabled

**Model loading fails:**
- Check internet connection
- Clear browser cache
- Verify sufficient disk space

## Learn More

- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [MODNet Model](https://huggingface.co/Xenova/modnet)
- [WebGPU Guide](https://huggingface.co/docs/transformers.js/guides/webgpu)

## License

MIT License - feel free to use this code in your projects!
