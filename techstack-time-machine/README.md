# TechStack Time Machine

A Chrome extension that lets you view and understand technical content through the lens of different software engineering eras - from the 1970s mainframe era to modern cloud-native development.

## Features

- 🕰️ **Era-Based Context**: Translate modern tech concepts to historical contexts
- 🤖 **AI-Powered**: Uses Chrome's built-in AI APIs for contextual explanations
- 🎨 **Era Themes**: Visual styling matches each engineering era
- 📚 **Educational**: Learn how technologies evolved over time
- 🔄 **Real-time Processing**: Select text and get instant era-appropriate explanations
- 💡 **Side Panel UI**: Non-intrusive interface alongside your browsing

## Engineering Eras

1. **1970s - Mainframe Era**: Batch processing, punch cards, COBOL
2. **1980s - Personal Computing**: Desktop applications, DOS, early GUIs
3. **1990s - Internet Dawn**: Web 1.0, CGI scripts, early databases
4. **2000s - Web 2.0**: AJAX, social media, mobile apps
5. **2010s - Cloud Native**: Microservices, DevOps, containers
6. **2020s - Modern Stack**: Serverless, edge computing, AI/ML integration

## Installation

### For Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Browser Requirements

- Chrome 127+ with AI APIs enabled
- Enable flags:
  - `chrome://flags/#optimization-guide-on-device-model`
  - `chrome://flags/#prompt-api-for-gemini-nano`

## Usage

1. Navigate to any technical webpage or documentation
2. Highlight text containing technical terms or concepts
3. Right-click and select "View in Engineering Era"
4. The side panel opens with era-appropriate explanations
5. Toggle between eras to see how concepts translate across time
6. Switch between light/dark themes for comfortable reading

## How It Works

The extension uses:

- **Content Scripts**: Capture selected text from webpages
- **Background Service Worker**: Manages AI API calls and context
- **Side Panel**: Displays era-based explanations
- **Chrome AI APIs**: Processes and contextualizes technical content
- **Prompt Engineering**: Custom prompts for each era's language and concepts

## Technical Stack

- **React 18**: UI components and state management
- **TypeScript**: Type-safe development
- **Vite**: Fast builds and HMR
- **Tailwind CSS**: Utility-first styling with era themes
- **Radix UI**: Accessible component primitives
- **Chrome AI APIs**: Built-in language models
- **Markdown-to-JSX**: Formatted output rendering

## Project Structure

```
techstack-time-machine/
├── src/
│   ├── App.tsx              # Main side panel UI
│   ├── background.ts        # Service worker logic
│   ├── content-script.ts    # Page interaction
│   ├── types/               # Era definitions
│   └── components/          # React components
├── public/
│   ├── manifest.json        # Extension manifest
│   ├── popup.html          # Extension popup
│   └── icons/              # Extension icons
├── tests/                   # Playwright E2E tests
└── vite.config.ts          # Build configuration
```

## Development

### Running Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run prettier
```

## Example Use Cases

**Modern Documentation**: Viewing React docs through 1990s lens explains it as "CGI scripts with client-side templating"

**Cloud Services**: Understanding Kubernetes from a mainframe perspective relates it to job scheduling and resource allocation

**DevOps Concepts**: Seeing CI/CD through 1980s context explains it as automated build scripts with floppy disk distribution

**API Design**: REST APIs explained in 1970s terms as remote procedure calls over networks

## Customization

### Adding New Eras

Edit `src/types/levels.ts` to add new time periods:

```typescript
export const levels = [
  {
    id: 7,
    name: "2030s - Quantum Era",
    description: "Quantum computing, neural interfaces",
    theme: "quantum"
  }
]
```

### Modifying Prompts

Update era-specific prompts in the background service worker to adjust how content is contextualized.

## Browser Compatibility

- ✅ Chrome 127+ (with AI APIs enabled)
- ❌ Other browsers (Chrome AI APIs required)

## Performance

- **First Load**: 2-5 seconds (AI model initialization)
- **Context Switch**: Instant (cached responses)
- **Processing**: 1-3 seconds per explanation
- **Memory**: ~200MB for AI model

## Troubleshooting

**Extension not working:**
- Verify Chrome version (127+)
- Enable required flags in `chrome://flags`
- Check AI API availability

**Side panel not opening:**
- Ensure text is selected before right-clicking
- Check extension permissions
- Reload the extension

**Slow responses:**
- First request initializes AI model (slower)
- Subsequent requests are faster
- Close other browser tabs if needed

## Testing

Includes Playwright E2E tests for:
- Extension loading
- Content script injection
- Side panel interaction
- Context menu functionality
- Theme switching

## Privacy

- All processing happens locally in Chrome
- No data sent to external servers
- Selected text never leaves your device
- Chrome AI APIs respect privacy guidelines

## Future Enhancements

- [ ] More granular era subdivisions
- [ ] Visual timeline navigation
- [ ] Code snippet translations
- [ ] Architecture diagram era adaptations
- [ ] Export explanations as markdown
- [ ] Custom era definitions

## Resources

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome AI APIs](https://developer.chrome.com/docs/ai/)
- [Side Panel API](https://developer.chrome.com/docs/extensions/reference/sidePanel/)

## License

MIT License

## Author

Created by Ron Dagdag (@rondagdag)
