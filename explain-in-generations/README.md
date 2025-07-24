# 🌟 Explain in Generations 🌟

## Inspiration
Understanding how different generations consume and process information is crucial in today's multi-generational world. We created a tool that adapts explanations to match the communication styles and cultural references of different generations, from Gen Alpha to the Greatest Generation.

## **What it does**
🌟 Explain in Generations enables users to highlight any text on a webpage and instantly receive AI-powered explanations tailored to specific generational communication styles. It seamlessly integrates into the Chrome side panel, allowing users to switch between different generational perspectives without leaving their current page.

## **Features**
- Adapts explanations for 7 different generations
- Uses generation-specific cultural references and communication styles
- Real-time AI-powered text processing
- Seamless Chrome integration with side panel support

## Installation & Setup

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd explain-in-generations
   ```
2. Install dependencies and build the project:
   ```bash
   npm install
   npm run build
   ```
3. Ensure your system meets the hardware requirements (see Requirements section below)
4. Open Chrome and navigate to `chrome://extensions`
5. Enable "Developer mode" in the top right corner
6. Click "Load unpacked" and select the `dist` folder from the project directory
7. The first time you use the extension, Gemini Nano will be automatically downloaded (this may take some time)

For more details, see the [official Chrome Summarization API documentation](https://developer.chrome.com/docs/ai/summarizer-api)

## Usage

1. Navigate to any webpage
2. Open the side panel by clicking the extension icon in the toolbar
3. Highlight any text on the webpage
4. The extension will automatically generate explanations tailored for different generations
5. Switch between different generational perspectives using the controls in the side panel

## Requirements

### Browser Requirements
- Google Chrome version 138 or later

### Hardware Requirements
- **Operating System**: Windows 10 or 11; macOS 13+ (Ventura and onwards); or Linux
  - Chrome for Android, iOS, and ChromeOS are not yet supported
- **Storage**: At least 22 GB of free space on the volume that contains your Chrome profile for Gemini Nano download
- **GPU**: Strictly more than 4 GB of VRAM
- **Network**: Unlimited data or an unmetered connection for initial model download

### Permissions
- `"sidePanel"`: Required for the extension's side panel interface
- `"activeTab"`: Required to access the current page's content
- `"generativeContentAPI"`: Required for AI-powered text generation

**Note**: If available storage space falls below 10 GB after download, the model will be automatically removed and will need to be redownloaded when requirements are met again.

## API Notes

This extension uses Chrome's built-in Summarizer API with Gemini Nano, which:
- Is free to use and runs locally on the user's device
- Does not send data to external servers, ensuring privacy
- Requires Chrome version 138 or later
- Uses Gemini Nano model which is automatically downloaded on first use
- Supports various summarization types (key-points, tldr, teaser, headline) and formats
- Before using APIs that use Gemini Nano, review the [People + AI Guidebook](https://pair.withgoogle.com/guidebook/) for best practices

**Important**: Please acknowledge [Google's Generative AI Prohibited Uses Policy](https://policies.google.com/terms/generative-ai/use-policy) before using this extension.

## **What's next for 🌟 Explain in Generations**
- Enhanced generational context awareness
- Customizable communication style preferences
- Multi-language support with generation-appropriate localizations
- Integration with educational platforms for cross-generational learning