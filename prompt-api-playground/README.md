# Prompt API Playground

An interactive demo of Chrome's built-in **Prompt API** powered by **Gemini Nano** - a small language model that runs entirely in the browser!

## What is the Prompt API?

The Prompt API is a browser-native AI capability that allows web applications to interact with a locally-running language model (Gemini Nano) without any server calls, API keys, or cloud dependencies.

### Key Benefits

- **100% Client-Side**: All AI inference happens locally on the user's device
- **Privacy-First**: Prompts never leave the browser - no data sent to servers
- **Zero Latency**: No network round-trips mean instant responses
- **Free**: No API keys, rate limits, or usage costs
- **Offline Capable**: Works without an internet connection (once model is downloaded)

## Running the Demo

### Prerequisites

1. **Chrome 138+** or **Chrome Canary** with experimental features enabled
2. Navigate to `chrome://flags/` and enable:
   - `#optimization-guide-on-device-model` → Set to "Enabled BypassPerfRequirement"
   - `#prompt-api-for-gemini-nano` → Set to "Enabled"
3. Restart Chrome after enabling flags
4. The model (~1.7GB) will download automatically on first use

### Start the Server

```bash
# From this directory
npx http-server . -p 8080

# Or from the repo root
npm run dev
```

Then open: http://localhost:8080/prompt-api-playground/

## Demo Walkthrough

### 1. Understanding the API (How It Works Section)

The collapsible "How It Works" section explains:
- What the Prompt API is and why it matters
- Key benefits of client-side AI
- Code example showing the main API methods

### 2. Try the Examples

Click any example button to load a pre-written prompt. Categories include:

| Category | What It Shows |
|----------|---------------|
| **Creative Writing** | Haikus, stories, limericks - shows creative generation |
| **Code Help** | JS explanations & code generation - practical dev use cases |
| **Q&A / Knowledge** | General knowledge queries - information retrieval |
| **Formatting & Structure** | Tables, lists, formatting - structured output |

### 3. Interactive Prompt Area

- Type your own prompts or use the examples
- **Token Counter**: Shows real-time token cost as you type
- **Temperature & Top-K**: Adjust model parameters
  - Temperature (0-2): Higher = more creative, Lower = more focused
  - Top-K (1-8): Number of top tokens to consider

### 4. Session Stats

Watch the stats table to understand token usage:
- **Input Usage**: Tokens used so far in the conversation
- **Input Remaining**: Available context window
- **Input Quota**: Total context window size (~4K tokens)

### 5. Streaming Responses

Responses stream token-by-token in real-time, demonstrating:
- Non-blocking UI during generation
- Progressive rendering for better UX
- Markdown rendering with syntax highlighting

## Key Code Patterns

### Feature Detection

```javascript
// Check if the API is available
if (!self.LanguageModel) {
  // Show fallback message
  return;
}

// Check model availability
const availability = await self.LanguageModel.availability();
// Returns: 'available' | 'downloadable' | 'downloading' | 'unavailable'
```

### Creating a Session

```javascript
const session = await self.LanguageModel.create({
  temperature: 0.7,      // Creativity (0-2)
  topK: 3,               // Token diversity
  initialPrompts: [
    { role: 'system', content: 'You are a helpful assistant.' }
  ],
  monitor(m) {
    m.addEventListener('downloadprogress', (e) => {
      console.log(`Downloaded ${e.loaded * 100}%`);
    });
  }
});
```

### Streaming Responses

```javascript
const stream = await session.promptStreaming(userPrompt);

for await (const chunk of stream) {
  // Handle incremental chunks
  // Note: Each chunk may contain the full response so far
  outputElement.textContent = chunk;
}
```

### Token Counting

```javascript
// Measure input cost before sending
const tokenCount = await session.measureInputUsage(prompt);
console.log(`This prompt costs ${tokenCount} tokens`);
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Browser doesn't support Prompt API" | Enable Chrome flags and restart |
| "Model unavailable" | Ensure 22GB+ free disk space for download |
| Model downloading slowly | First download is ~1.7GB, wait for completion |
| Responses are cut off | Approaching token quota, reset session |
| Session errors | Click "Reset session" to create a new one |

## Demo Tips for Presentations

1. **Start with "How It Works"** - Explain the client-side AI concept
2. **Use Creative Writing examples first** - Quick, visual results
3. **Show the token counter** - Type a long prompt to show real-time counting
4. **Adjust temperature live** - Show how it affects creativity
5. **Open DevTools Network tab** - Prove no API calls are made!
6. **Compare latency** - Much faster than cloud APIs for simple queries

## Resources

- [Chrome Prompt API Documentation](https://developer.chrome.com/docs/ai/prompt-api)
- [Chrome AI Early Preview Program](https://developer.chrome.com/docs/ai/join-epp)
- [Original Playground by @tomayac](https://tomayac.github.io/prompt-api-playground/)
