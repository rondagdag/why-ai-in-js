// Extend window interface for timeout tracking
declare global {
  interface Window {
    selectionTimeout?: number
  }
}

// Function to get currently selected text
function getCurrentSelection(): string {
  const selection = window.getSelection()
  return selection ? selection.toString().trim() : ""
}

// Listen for messages from the background script requesting current selection
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_CURRENT_SELECTION") {
    const currentSelectedText = getCurrentSelection()
    sendResponse({
      type: "CURRENT_SELECTION_RESPONSE",
      text: currentSelectedText
    })
  }
  return true // Keep the message channel open for async response
})

// Optional: Listen for selection changes and notify the extension
document.addEventListener("selectionchange", () => {
  const selectedText = getCurrentSelection()
  if (selectedText.length > 0) {
    // Debounce to avoid too many messages
    clearTimeout(window.selectionTimeout)
    window.selectionTimeout = setTimeout(() => {
      chrome.runtime
        .sendMessage({
          type: "SELECTION_CHANGED",
          text: selectedText
        })
        .catch(() => {
          // Silently ignore if extension context is invalid
        })
    }, 500)
  }
})
