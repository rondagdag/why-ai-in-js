// Application-wide constants to eliminate magic numbers and improve maintainability

export const APP_CONSTANTS = {
  // Timing constants
  PANEL_OPEN_DELAY: 1000,
  DEBOUNCE_DELAY: 300,

  // Chrome extension constants
  CHROME_TARGET_VERSION: "chrome130",

  // Storage keys
  STORAGE_KEYS: {
    CURRENT_LEVEL: "currentLevel",
    SELECTED_LEVEL: "selectedLevel"
  },

  // Message types for consistency
  MESSAGE_TYPES: {
    STREAM_RESPONSE: "STREAM_RESPONSE",
    ERROR: "ERROR",
    AI_INITIATE: "AI_INITIATE",
    STREAM_COMPLETE: "STREAM_COMPLETE",
    TEXT_SELECTED: "TEXT_SELECTED",
    RERUN_COMPLETE: "RERUN_COMPLETE",
    SET_LEVEL: "SET_LEVEL",
    RERUN_SUMMARIZATION: "RERUN_SUMMARIZATION",
    CHUNK_PROGRESS: "CHUNK_PROGRESS",
    CHUNKING_STARTED: "CHUNKING_STARTED",
    FINAL_SUMMARY_STARTED: "FINAL_SUMMARY_STARTED"
  },

  // API availability states
  API_AVAILABILITY: {
    AVAILABLE: "available",
    UNAVAILABLE: "unavailable",
    LOADING: "loading"
  },

  // Summarizer options
  SUMMARIZER_OPTIONS: {
    TYPE: "tldr",
    FORMAT: "markdown",
    LENGTH: "medium"
  },

  // Text chunking configuration
  CHUNKING_OPTIONS: {
    CHUNK_SIZE: 3000,
    CHUNK_OVERLAP: 200,
    MIN_CHUNK_SIZE: 100,
    MAX_TOKENS_ESTIMATE: 750
  },

  // Context menu
  CONTEXT_MENU_ID: "summarize-text",

  // Error messages
  ERROR_MESSAGES: {
    API_UNAVAILABLE: "The Summarizer API isn't usable",
    PROCESSING_FAILED: "Failed to process summarization",
    INVALID_GENERATION: "Invalid generation level",
    MISSING_TEXT_OR_LEVEL: "Missing text or level"
  }
} as const

// Type exports for better type safety
export type MessageType =
  (typeof APP_CONSTANTS.MESSAGE_TYPES)[keyof typeof APP_CONSTANTS.MESSAGE_TYPES]
export type ApiAvailability =
  (typeof APP_CONSTANTS.API_AVAILABILITY)[keyof typeof APP_CONSTANTS.API_AVAILABILITY]
export type StorageKey =
  (typeof APP_CONSTANTS.STORAGE_KEYS)[keyof typeof APP_CONSTANTS.STORAGE_KEYS]
