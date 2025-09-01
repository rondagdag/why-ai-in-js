import { Generation, getGenerationsReversed } from "./constants/generations";
import { APP_CONSTANTS } from "./constants/app";

// Get levels in reverse order for popup display (newest first)
const levels: Generation[] = getGenerationsReversed();

let currentLevel = 1;

// Initialize the UI
async function initializeUI() {
  // Load saved level from storage
  const result = await chrome.storage.sync.get(APP_CONSTANTS.STORAGE_KEYS.SELECTED_LEVEL);
  if (result.selectedLevel) {
    currentLevel = result.selectedLevel.level;
  }

  const container = document.getElementById('options')!;

  levels.forEach(level => {
    const button = document.createElement('button');
    button.className = `level-option ${level.level === currentLevel ? 'selected' : ''}`;
    button.innerHTML = `
      <div class="level-name">${level.name}</div>
      <div class="level-description">${level.description}</div>
    `;

    button.addEventListener('click', () => {
      selectLevel(level);
    });
    container.appendChild(button);
  });

  // If we loaded a saved level, make sure to initialize it
  if (result.selectedLevel) {
    await selectLevel(result.selectedLevel);
  }
}

// Handle level selection
async function selectLevel(level: Generation) {
  currentLevel = level.level;

  // Update UI
  document.querySelectorAll('.level-option').forEach(btn => {
    btn.classList.toggle('selected',
      (btn.querySelector('.level-name')?.textContent === level.name)
    );
  });

  // Save to storage
  await chrome.storage.sync.set({ [APP_CONSTANTS.STORAGE_KEYS.SELECTED_LEVEL]: level });

  // Send message to background script
  await chrome.runtime.sendMessage({
    type: APP_CONSTANTS.MESSAGE_TYPES.SET_LEVEL,
    level: level
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeUI().catch(() => {
    // Error initializing UI - silently fail in production
  });
});