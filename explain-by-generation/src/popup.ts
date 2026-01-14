import { Generation, getGenerationsReversed } from "./constants/generations"
import { APP_CONSTANTS } from "./constants/app"

// Get levels in reverse order for popup display (newest first)
const levels: Generation[] = getGenerationsReversed()

let currentLevel = 1

interface StorageData {
  currentLevel?: Generation
  selectedLevel?: Generation
  theme?: string
}

// Initialize the UI
async function initializeUI() {
  // Load saved level from storage
  const result = await chrome.storage.sync.get(
    APP_CONSTANTS.STORAGE_KEYS.SELECTED_LEVEL
  )
  if ((result as StorageData).selectedLevel) {
    currentLevel = (result as StorageData).selectedLevel!.level
  }

  const container = document.getElementById("options")!

  levels.forEach((level) => {
    const button = document.createElement("button")
    button.className = `level-option ${level.level === currentLevel ? "selected" : ""}`
    button.innerHTML = `
      <div class="level-name">${level.name}</div>
      <div class="level-description">${level.description}</div>
    `

    button.addEventListener("click", () => {
      selectLevel(level, true) // Pass true to indicate this is a user interaction
    })
    container.appendChild(button)
  })

  // If we loaded a saved level, initialize it without opening side panel
  if ((result as StorageData).selectedLevel) {
    await selectLevel((result as StorageData).selectedLevel!, false) // Pass false for initialization
  }
}

// Handle level selection
async function selectLevel(
  level: Generation,
  isUserInteraction: boolean = false
) {
  currentLevel = level.level

  // Update UI
  document.querySelectorAll(".level-option").forEach((btn) => {
    btn.classList.toggle(
      "selected",
      btn.querySelector(".level-name")?.textContent === level.name
    )
  })

  // Save to storage
  await chrome.storage.sync.set({
    [APP_CONSTANTS.STORAGE_KEYS.SELECTED_LEVEL]: level
  })

  // Send message to background script
  await chrome.runtime.sendMessage({
    type: APP_CONSTANTS.MESSAGE_TYPES.SET_LEVEL,
    level: level
  })

  // Only open the side panel if this is a direct user interaction
  if (isUserInteraction) {
    try {
      const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (currentTab?.windowId && chrome.sidePanel) {
        await chrome.sidePanel.open({ windowId: currentTab.windowId })
        // Close the popup after opening the side panel
        window.close()
      }
    } catch (error) {
      // Error opening side panel - silently fail in production
      console.warn("Could not open side panel:", error)
    }
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeUI().catch(() => {
    // Error initializing UI - silently fail in production
  })
})
