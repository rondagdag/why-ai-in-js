import { generations, getGenerationByLevel } from "./constants/generations"
import { APP_CONSTANTS } from "./constants/app"
import type { ChromeMessage } from "./types/chrome-api"

// Default configuration for the current explanation level
// This serves as a fallback if no stored level is found
let currentLevel = getGenerationByLevel(7) || generations[generations.length - 1]

// Store the last tab info for rerun functionality
let lastTabInfo: { url?: string; id?: number } = {}

// On extension startup, retrieve the previously saved level from Chrome's storage
// This ensures user preferences persist across browser sessions
chrome.storage.local.get([APP_CONSTANTS.STORAGE_KEYS.CURRENT_LEVEL], (result) => {
  if (result.currentLevel && result.currentLevel.level) {
    const generation = getGenerationByLevel(result.currentLevel.level)
    if (generation) {
      currentLevel = generation;
    }
  }
});

// Helper function to safely set storage
async function setCurrentLevel(generation: typeof currentLevel): Promise<void> {
  try {
    await chrome.storage.local.set({ [APP_CONSTANTS.STORAGE_KEYS.CURRENT_LEVEL]: generation });
    currentLevel = generation;
  } catch (error) {
    // Error saving current level - silently fail in production
  }
}

// Helper function to send runtime messages safely with retry
function sendRuntimeMessage(message: ChromeMessage): void {
  try {
    if (chrome.runtime?.id) { // Check if extension context is still valid
      chrome.runtime.sendMessage(message);
    }
  } catch (error) {
    // Error sending runtime message - silently fail in production
  }
}

// Message handler for level changes from the popup and rerun requests from side panel
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Handle async operations properly
  const handleMessage = async () => {
    if (message.type === APP_CONSTANTS.MESSAGE_TYPES.SET_LEVEL) {
      // Validate that the level exists in our generations data
      const generation = getGenerationByLevel(message.level.level)
      if (generation) {
        try {
          await setCurrentLevel(generation);
          return { success: true };
        } catch {
          return { success: false, error: APP_CONSTANTS.ERROR_MESSAGES.INVALID_GENERATION };
        }
      } else {
        return { success: false, error: APP_CONSTANTS.ERROR_MESSAGES.INVALID_GENERATION };
      }
    } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.RERUN_SUMMARIZATION) {
      // Handle rerun request from side panel
      if (message.text && message.level) {
        // Validate that the level exists in our generations data
        const generation = getGenerationByLevel(message.level.level)
        if (generation) {
          try {
            await setCurrentLevel(generation);
            // Process the text with the new level
            processSummarization(message.text, lastTabInfo);
            return { success: true };
          } catch {
            return { success: false, error: APP_CONSTANTS.ERROR_MESSAGES.INVALID_GENERATION };
          }
        } else {
          return { success: false, error: APP_CONSTANTS.ERROR_MESSAGES.INVALID_GENERATION };
        }
      } else {
        return { success: false, error: APP_CONSTANTS.ERROR_MESSAGES.MISSING_TEXT_OR_LEVEL };
      }
    }
    return null;
  };

  // Execute async handler and send response
  handleMessage().then(result => {
    if (result) sendResponse(result);
  });

  // Return true to indicate we will respond asynchronously
  return true;
})

// Set up the context menu item when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: APP_CONSTANTS.CONTEXT_MENU_ID,
    title: "Explain by Generation",
    contexts: ["selection"]  // Only show menu on text selection
  })
})

// Helper function to get the current summarization options
// These options configure how the AI explains the selected text
const getOptions = () => ({
  sharedContext: `${currentLevel.context}. ${currentLevel.description}`,
  type: APP_CONSTANTS.SUMMARIZER_OPTIONS.TYPE,
  format: APP_CONSTANTS.SUMMARIZER_OPTIONS.FORMAT,
  length: APP_CONSTANTS.SUMMARIZER_OPTIONS.LENGTH
})

// Helper function to safely open side panel with delay
async function openSidePanelSafely(windowId: number): Promise<void> {
  try {
    if (chrome.sidePanel) {
      await chrome.sidePanel.open({ windowId })
      // Add delay to ensure panel is ready
      await new Promise((resolve) => setTimeout(resolve, APP_CONSTANTS.PANEL_OPEN_DELAY))
    }
  } catch (error) {
    // Error opening side panel - silently fail in production
  }
}

// Helper function to process stream from Chrome Summarizer API
async function processStream(stream: AsyncIterable<string>): Promise<void> {
  try {
    for await (const chunk of stream) {
      sendRuntimeMessage({
        chunk,
        type: APP_CONSTANTS.MESSAGE_TYPES.STREAM_RESPONSE
      })
    }
  } catch (error) {
    // Error processing stream - silently fail in production
    throw error
  }
}

// Helper function to initialize summarizer based on availability
async function initializeSummarizer(): Promise<any> {
  // @ts-expect-error - Chrome experimental API
  const availability = await Summarizer.availability();
  
  if (availability === APP_CONSTANTS.API_AVAILABILITY.UNAVAILABLE) {
    throw new Error(APP_CONSTANTS.ERROR_MESSAGES.API_UNAVAILABLE)
  }
  
  // @ts-expect-error - Chrome experimental API
  const summarizer = await Summarizer.create(getOptions());
  
  if (availability !== APP_CONSTANTS.API_AVAILABILITY.AVAILABLE) {
    // Track download progress for model installation
    summarizer.addEventListener(
      "downloadprogress",
      (e: { loaded: number; total: number }) => {
        sendRuntimeMessage({
          type: APP_CONSTANTS.MESSAGE_TYPES.AI_INITIATE,
          total: e.total,
          loaded: e.loaded,
        })
      }
    )
  }
  
  await summarizer.ready
  return summarizer
}

// Helper function to stream summarization results
async function streamSummarization(
  summarizer: any, 
  selectedText: string, 
  tabInfo: { url?: string; id?: number }
): Promise<void> {
  const context = tabInfo.url ? `article from ${new URL(tabInfo.url).origin}` : ''
  const stream = await summarizer.summarize(selectedText, { context })
  
  // Process the stream using the reader API
  await processStream(stream)
  
  sendRuntimeMessage({
    type: APP_CONSTANTS.MESSAGE_TYPES.STREAM_COMPLETE,
    level: currentLevel.level
  })
}

// Function to process summarization for both initial selection and rerun
async function processSummarization(selectedText: string, tabInfo: { url?: string; id?: number }) {
  try {
    // Send initial message indicating start
    sendRuntimeMessage({
      chunk: "",
      type: APP_CONSTANTS.MESSAGE_TYPES.STREAM_RESPONSE,
      isFirst: true,
      level: currentLevel.level,
      selectedText: selectedText
    })

    const summarizer = await initializeSummarizer()
    await streamSummarization(summarizer, selectedText, tabInfo)
    
  } catch (error) {
    // Error processing summarization - handle gracefully
    sendRuntimeMessage({
      type: APP_CONSTANTS.MESSAGE_TYPES.ERROR,
      error: error instanceof Error ? error.message : APP_CONSTANTS.ERROR_MESSAGES.PROCESSING_FAILED
    })
  }
}

// Check if the Chrome AI Summarizer API is available
if ('Summarizer' in self) {
  // Handle right-click context menu selection
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === APP_CONSTANTS.CONTEXT_MENU_ID && info.selectionText && tab?.id) {
      // Store the tab info for potential rerun
      lastTabInfo = { url: tab.url, id: tab.id }

      // Open the side panel if available
      if (tab.windowId) {
        await openSidePanelSafely(tab.windowId)
      }
      
      // Notify side panel about the selected text (after panel is ready)
      sendRuntimeMessage({
        type: APP_CONSTANTS.MESSAGE_TYPES.TEXT_SELECTED,
        text: info.selectionText
      })

      // Process the summarization
      await processSummarization(info.selectionText, { url: tab.url, id: tab.id })
    }
  })

  // Handle clicks on the extension icon
  chrome.action.onClicked.addListener(async (tab) => {
    if (chrome.sidePanel && tab?.windowId) {
      await openSidePanelSafely(tab.windowId)
    }
  })
} else {
  // Summarizer API not available - handle gracefully
}
