// Initialize Sentry for error tracking and monitoring
import { Toucan } from "toucan-js"
const sentry = new Toucan({
  dsn: "https://85882377f458516b86a142cd2433f657@o4508836932812800.ingest.us.sentry.io/4508836938579969",
  environment: import.meta.env.PROD ? "production" : "development"
})

// Default configuration for the current explanation level
// This serves as a fallback if no stored level is found
let currentLevel = {
  level: 7,
  context: "Explain like I'm from Generation Alpha (2013-2025). Give me that linguistic glow-up with skibidi explanations! Use rizz-level emojis 🚀, Ohio-tier gamification, and brain rot content that slaps. Break into mini-challenges with maximum rizz, use AI/tech analogies that are straight fire, and keep it bussin with interactive vibes. Think: TikTok brain rot explanations with skibidi transitions and visual cues that hit different.",
  description: "Skibidi-level interactive style 🎮, Ohio-tier gamified chunks 🎯, brain rot AI explanations 🤖, rizz-maxing emoji communication 😊"
}

// Store the last tab info for rerun functionality
let lastTabInfo: { url?: string; id?: number } = {}

// On extension startup, retrieve the previously saved level from Chrome's storage
// This ensures user preferences persist across browser sessions
chrome.storage.local.get(['currentLevel'], (result) => {
  if (result.currentLevel) {
    currentLevel = result.currentLevel;
  }
});

// Message handler for level changes from the popup and rerun requests from side panel
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SET_LEVEL") {
    currentLevel = message.level
    // Persist the new level to Chrome's storage
    chrome.storage.local.set({ currentLevel: message.level });
    sendResponse({ success: true })
  } else if (message.type === "RERUN_SUMMARIZATION") {
    // Handle rerun request from side panel
    if (message.text && message.level) {
      currentLevel = message.level
      chrome.storage.local.set({ currentLevel: message.level });
      // Process the text with the new level
      processSummarization(message.text, lastTabInfo)
    }
    sendResponse({ success: true })
  }
})

// Set up the context menu item when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-text",
    title: "Explain in Generations",
    contexts: ["selection"]  // Only show menu on text selection
  })
})

// Helper function to get the current summarization options
// These options configure how the AI explains the selected text
const getOptions = () => ({
  sharedContext: `${currentLevel.context}. ${currentLevel.description}`,
  type: "tldr",
  format: "markdown",
  length: "medium"
})

// Function to process summarization for both initial selection and rerun
async function processSummarization(selectedText: string, tabInfo: { url?: string; id?: number }) {
  try {
    // Check if the summarizer API is available and ready to use
    // @ts-expect-error new chrome feature
    const availability = await Summarizer.availability();
    let summarizer

    if (availability === 'unavailable') {
      // API is not available on this system
      chrome.runtime.sendMessage({
        type: "ERROR",
        error: "The Summarizer API isn't usable"
      })
      return
    }

    if (availability === 'available') {
      // API is ready to use immediately
      chrome.runtime.sendMessage({
        chunk: "",
        type: "STREAM_RESPONSE",
        isFirst: true,
        level: currentLevel.level
      })

      // Initialize the summarizer with current options
      // @ts-expect-error new chrome feature
      summarizer = await Summarizer.create(getOptions());
      await summarizer.ready

      // Process the selected text and stream the results
      const stream = await summarizer.summarize(selectedText, {
        context: tabInfo.url ? `article from ${new URL(tabInfo.url).origin}` : ''
      })
      for await (const chunk of stream) {
        chrome.runtime.sendMessage({
          chunk,
          type: "STREAM_RESPONSE"
        })
      }
      chrome.runtime.sendMessage({
        type: "STREAM_COMPLETE",
        level: currentLevel.level
      })
    } else {
      // API needs to download models first
      // @ts-expect-error new chrome feature
      summarizer = await Summarizer.create(getOptions());
      // Track and report download progress
      summarizer.addEventListener(
        "downloadprogress",
        (e: { loaded: number; total: number }) => {
          console.log(e.loaded, e.total)
          chrome.runtime.sendMessage({
            type: "AI_INITIATE",
            total: e.total,
            loaded: e.loaded,
          })
        }
      )
      await summarizer.ready
    }
  } catch (error) {
    sentry.captureException(error)
    chrome.runtime.sendMessage({
      type: "ERROR",
      error: "Failed to process summarization"
    })
  }
}

// Check if the Chrome AI Summarizer API is available
if ('Summarizer' in self) {
  // Handle right-click context menu selection
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "summarize-text" && info.selectionText && tab?.id) {
      // Store the tab info for potential rerun
      lastTabInfo = { url: tab.url, id: tab.id }
      
      // Notify side panel about the selected text
      chrome.runtime.sendMessage({
        type: "TEXT_SELECTED",
        text: info.selectionText
      })

      // Open the side panel if available
      if (chrome.sidePanel && tab) {
        try {
          chrome.sidePanel.open({ windowId: tab.windowId })
          // Small delay to ensure panel is ready
          await new Promise((resolve) => setTimeout(resolve, 500))
        } catch (error) {
          sentry.captureException(error)
        }
      }

      // Process the summarization
      await processSummarization(info.selectionText, { url: tab.url, id: tab.id })
    }
  })

  // Handle clicks on the extension icon
  chrome.action.onClicked.addListener(async (tab) => {
    if (chrome.sidePanel && tab) {
      try {
        await chrome.sidePanel.open({ windowId: tab.windowId })
      } catch (error) {
        sentry.captureException(error)
      }
    }
  })
} else {
  // Log an error if the Summarizer API is not available in this browser
  sentry.captureMessage("Try to access Summarizer", "fatal", {
    data: {
      userAgent: navigator.userAgent
    }
  })
}
