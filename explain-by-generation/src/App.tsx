import { useEffect, useState, useCallback } from "react"
import Markdown from "markdown-to-jsx"
import { Select } from "./components/ui/Select"
import { Button } from "./components/ui/Button"
import TrashIcon from "./components/icons/TrashIcon"
import { RefreshCw } from "lucide-react"
import {
  generations,
  getGenerationByLevel,
  levelNames
} from "./constants/generations"
import { APP_CONSTANTS } from "./constants/app"

function App() {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(7)
  const [selectedText, setSelectedText] = useState<string>("")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  // Chunking-related state
  const [isChunking, setIsChunking] = useState(false)
  const [chunkProgress, setChunkProgress] = useState(0)
  const [totalChunks, setTotalChunks] = useState(0)
  const [processingPhase, setProcessingPhase] = useState<
    "chunking" | "final" | null
  >(null)

  // Memoize theme detection to avoid recreating on every render
  const getEffectiveTheme = useCallback(
    async (currentTheme: "light" | "dark" | "system") => {
      if (currentTheme !== "system") return currentTheme

      try {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches

        // Quick Chrome storage check with fallback
        if (typeof chrome !== "undefined" && chrome.storage) {
          return new Promise<"light" | "dark">((resolve) => {
            chrome.storage.local.get(["theme"], (result) => {
              resolve(
                result.theme === "dark"
                  ? "dark"
                  : result.theme === "light"
                    ? "light"
                    : prefersDark
                      ? "dark"
                      : "light"
              )
            })
          })
        }

        return prefersDark ? "dark" : "light"
      } catch {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      }
    },
    []
  )

  useEffect(() => {
    const applyTheme = async () => {
      const effectiveTheme = await getEffectiveTheme(theme)
      document.documentElement.classList.toggle(
        "dark",
        effectiveTheme === "dark"
      )
    }

    applyTheme()

    // Listen for theme changes when theme is set to 'system'
    if (theme === "system") {
      // Listen for system/Chrome theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        applyTheme()
      }

      mediaQuery.addEventListener("change", handleChange)

      // Also listen for Chrome storage changes if someone changes theme in another part of the extension
      const storageListener = (changes: {
        [key: string]: chrome.storage.StorageChange
      }) => {
        if (changes.theme) {
          applyTheme()
        }
      }

      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.onChanged.addListener(storageListener)
        return () => {
          mediaQuery.removeEventListener("change", handleChange)
          chrome.storage.onChanged.removeListener(storageListener)
        }
      } else {
        return () => mediaQuery.removeEventListener("change", handleChange)
      }
    }
  }, [theme])

  // Load saved generation level on component mount
  useEffect(() => {
    chrome.storage.local.get(
      [APP_CONSTANTS.STORAGE_KEYS.CURRENT_LEVEL],
      (result) => {
        const data = result as { currentLevel?: { level: number } }
        if (data.currentLevel?.level) {
          setCurrentLevel(data.currentLevel.level)
        }
      }
    )
  }, [])

  // Check for current text selection when side panel opens
  useEffect(() => {
    const checkCurrentSelection = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true
        })
        if (tab.id) {
          // Request current selection from content script
          const response = await chrome.tabs.sendMessage(tab.id, {
            type: "GET_CURRENT_SELECTION"
          })

          if (response?.text && response.text.trim().length > 0) {
            setSelectedText(response.text)
          }
        }
      } catch (error) {
        // Silently fail if content script is not available
        // This is expected when the extension is reloaded or on pages where content script doesn't run
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (!errorMessage.includes("Receiving end does not exist")) {
          console.log("Could not check current selection:", error)
        }
      }
    }

    // Check for current selection when component mounts
    checkCurrentSelection()
  }, [])

  const handleRerun = useCallback(async () => {
    // First, try to get the current selection from the active tab
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (tab.id) {
        // Request current selection from content script
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: "GET_CURRENT_SELECTION"
        })

        const currentSelectedText = response?.text || selectedText

        if (currentSelectedText && currentSelectedText.trim().length > 0) {
          const generation = getGenerationByLevel(currentLevel)
          if (generation) {
            // Send message to background script to rerun with current level and fresh text
            chrome.runtime.sendMessage({
              type: APP_CONSTANTS.MESSAGE_TYPES.RERUN_SUMMARIZATION,
              text: currentSelectedText,
              level: generation
            })

            // Update the stored selected text with the fresh selection
            setSelectedText(currentSelectedText)
          }
        } else {
          // No current selection, fall back to stored text
          if (selectedText && selectedText.trim().length > 0) {
            const generation = getGenerationByLevel(currentLevel)
            if (generation) {
              chrome.runtime.sendMessage({
                type: APP_CONSTANTS.MESSAGE_TYPES.RERUN_SUMMARIZATION,
                text: selectedText,
                level: generation
              })
            }
          }
        }
      }
    } catch (error) {
      // If content script communication fails, fall back to stored text
      console.warn("Could not get current selection, using stored text:", error)
      if (selectedText && selectedText.trim().length > 0) {
        const generation = getGenerationByLevel(currentLevel)
        if (generation) {
          chrome.runtime.sendMessage({
            type: APP_CONSTANTS.MESSAGE_TYPES.RERUN_SUMMARIZATION,
            text: selectedText,
            level: generation
          })
        }
      }
    }
  }, [selectedText, currentLevel])

  const handleLevelChange = useCallback(
    (newLevel: string | number) => {
      const level = typeof newLevel === "string" ? parseInt(newLevel) : newLevel
      setCurrentLevel(level)

      // Send the new level to background script
      const generation = getGenerationByLevel(level)
      if (generation) {
        // First, set the level
        chrome.runtime.sendMessage({
          type: APP_CONSTANTS.MESSAGE_TYPES.SET_LEVEL,
          level: generation
        })

        // Automatically rerun summarization if we have selected text
        if (selectedText && selectedText.trim().length > 0) {
          chrome.runtime.sendMessage({
            type: APP_CONSTANTS.MESSAGE_TYPES.RERUN_SUMMARIZATION,
            text: selectedText,
            level: generation
          })
        }
      }
    },
    [selectedText]
  )

  const messageListener = useCallback(
    (
      message: {
        type: string
        chunk?: string
        error?: string
        total?: number
        loaded?: number
        level?: number
        isFirst?: boolean
        text?: string
        selectedText?: string
        totalChunks?: number
        current?: number
        chunkSummary?: string
      },
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void
    ) => {
      if (message.type === APP_CONSTANTS.MESSAGE_TYPES.STREAM_RESPONSE) {
        setLoading(true)
        if (message.isFirst) {
          setSummary("")
          // Reset chunking state
          setIsChunking(false)
          setChunkProgress(0)
          setTotalChunks(0)
          setProcessingPhase(null)
          // Also capture selected text from the stream message as backup
          if (message.selectedText && !selectedText) {
            setSelectedText(message.selectedText)
          }
          return
        }
        if (message.chunk !== undefined) {
          if (message.level) {
            setCurrentLevel(message.level)
            setSummary((prev) => prev + message.chunk)
          } else {
            setSummary((prev) => prev + message.chunk)
          }
        }
      } else if (
        message.type === APP_CONSTANTS.MESSAGE_TYPES.CHUNKING_STARTED
      ) {
        setLoading(true)
        setIsChunking(true)
        setTotalChunks(message.totalChunks || 0)
        setChunkProgress(0)
        setProcessingPhase("chunking")
        setSummary("")
      } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.CHUNK_PROGRESS) {
        setChunkProgress(message.current || 0)
        // Optionally show chunk summaries in the UI
        if (message.chunkSummary) {
          setSummary((prev) => {
            const separator = prev ? "\n\n---\n\n" : ""
            return `${prev}${separator}**Chunk ${message.current}/${message.total}:**\n${message.chunkSummary}`
          })
        }
      } else if (
        message.type === APP_CONSTANTS.MESSAGE_TYPES.FINAL_SUMMARY_STARTED
      ) {
        setProcessingPhase("final")
        setSummary("Combining chunk summaries...")
      } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.ERROR) {
        setSummary(message.error || "An error occurred")
        setLoading(false)
        setIsChunking(false)
        setProcessingPhase(null)
      } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.AI_INITIATE) {
        setLoading(true)
        setSummary("")
        setTotal(message.total || 0)
        setProgress(message.loaded || 0)
      } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.STREAM_COMPLETE) {
        setLoading(false)
        setIsChunking(false)
        setProcessingPhase(null)
        if (message.level) {
          setCurrentLevel(message.level)
        }
      } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.TEXT_SELECTED) {
        // Store the selected text for potential rerun
        if (message.text) {
          setSelectedText(message.text)

          // Automatically trigger summarization for the new selection
          const generation = getGenerationByLevel(currentLevel)
          if (generation) {
            chrome.runtime.sendMessage({
              type: APP_CONSTANTS.MESSAGE_TYPES.RERUN_SUMMARIZATION,
              text: message.text,
              level: generation
            })
          }
        }
      } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.RERUN_COMPLETE) {
        // Handle rerun completion if needed
        setLoading(false)
        setIsChunking(false)
        setProcessingPhase(null)
      }
      sendResponse()
    },
    [selectedText, currentLevel]
  )

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [messageListener])

  const generationOptions = generations.map((gen) => ({
    value: gen.level,
    label: gen.name,
    description: gen.description
  }))

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Explain by Generation</h1>
            <button
              onClick={() => setSummary("")}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Clear summary"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextTheme =
                    theme === "system"
                      ? "light"
                      : theme === "light"
                        ? "dark"
                        : "system"
                  setTheme(nextTheme)
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                aria-label="Toggle theme"
              >
                {theme === "system" ? "🌓" : theme === "light" ? "☀️" : "🌙"}
                <span className="capitalize">{theme}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium" htmlFor="generation-select">
              Generation:
            </label>
            <Select
              options={generationOptions}
              value={currentLevel}
              onValueChange={handleLevelChange}
              className="flex-1"
            />
          </div>

          {selectedText && (
            <Button
              onClick={handleRerun}
              disabled={loading}
              variant="outline"
              size="sm"
              className="self-start"
            >
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Summarize by {getGenerationByLevel(currentLevel)?.name}
            </Button>
          )}
        </div>
        {loading && total > 0 && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${Math.round((progress / total) * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              Downloading AI model... {Math.round((progress / total) * 100)}%
            </p>
          </div>
        )}

        {/* Chunking Progress Indicator */}
        {isChunking && (
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {processingPhase === "chunking" &&
                  "Processing text in chunks..."}
                {processingPhase === "final" && "Combining summaries..."}
              </span>
            </div>

            {totalChunks > 0 && processingPhase === "chunking" && (
              <div className="space-y-2">
                <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round((chunkProgress / totalChunks) * 100)}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Chunk {chunkProgress} of {totalChunks} complete
                </p>
              </div>
            )}
          </div>
        )}
        <div className="rounded-lg border p-4 prose dark:prose-invert max-w-none">
          {summary || loading ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                  {levelNames[currentLevel as keyof typeof levelNames]}
                </span>
              </div>
              {summary ? (
                <Markdown>{summary}</Markdown>
              ) : (
                <div className="flex items-center gap-2 text-lg">
                  <span className="inline-flex space-x-2">
                    <span className="animate-[dot_1.4s_infinite] [animation-delay:0.2s] text-blue-500 dark:text-blue-400 text-2xl font-bold">
                      ●
                    </span>
                    <span className="animate-[dot_1.4s_infinite] [animation-delay:0.4s] text-blue-500 dark:text-blue-400 text-2xl font-bold">
                      ●
                    </span>
                    <span className="animate-[dot_1.4s_infinite] [animation-delay:0.6s] text-blue-500 dark:text-blue-400 text-2xl font-bold">
                      ●
                    </span>
                  </span>
                </div>
              )}
            </>
          ) : (
            "Select text and use right-click menu to get an explanation"
          )}
        </div>
      </div>
    </main>
  )
}

export default App
