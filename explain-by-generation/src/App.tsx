import { useEffect, useState, useCallback } from "react"
import Markdown from "markdown-to-jsx"
import { Select } from "./components/ui/Select"
import { Button } from "./components/ui/Button"
import TrashIcon from "./components/icons/TrashIcon"
import { RefreshCw } from "lucide-react"
import { generations, getGenerationByLevel, levelNames } from "./constants/generations"
import { APP_CONSTANTS } from "./constants/app"

function App() {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(7)
  const [selectedText, setSelectedText] = useState<string>("")
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  // Memoize theme detection to avoid recreating on every render
  const getEffectiveTheme = useCallback(async (currentTheme: 'light' | 'dark' | 'system') => {
    if (currentTheme !== 'system') return currentTheme;
    
    try {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Quick Chrome storage check with fallback
      if (typeof chrome !== 'undefined' && chrome.storage) {
        return new Promise<'light' | 'dark'>((resolve) => {
          chrome.storage.local.get(['theme'], (result) => {
            resolve(result.theme === 'dark' ? 'dark' : result.theme === 'light' ? 'light' : (prefersDark ? 'dark' : 'light'));
          });
        });
      }
      
      return prefersDark ? 'dark' : 'light';
    } catch {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }, []);

  useEffect(() => {

    const applyTheme = async () => {
      const effectiveTheme = await getEffectiveTheme(theme);
      document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    };

    applyTheme();

    // Listen for theme changes when theme is set to 'system'
    if (theme === 'system') {
      // Listen for system/Chrome theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme();
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      // Also listen for Chrome storage changes if someone changes theme in another part of the extension
      const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        if (changes.theme) {
          applyTheme();
        }
      };
      
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.onChanged.addListener(storageListener);
        return () => {
          mediaQuery.removeEventListener('change', handleChange);
          chrome.storage.onChanged.removeListener(storageListener);
        };
      } else {
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }
  }, [theme])

  // Load saved generation level on component mount
  useEffect(() => {
    chrome.storage.local.get([APP_CONSTANTS.STORAGE_KEYS.CURRENT_LEVEL], (result) => {
      if (result.currentLevel?.level) {
        setCurrentLevel(result.currentLevel.level)
      }
    })
  }, [])

  const handleRerun = useCallback(() => {
    if (selectedText) {
      const generation = getGenerationByLevel(currentLevel)
      if (generation) {
        // Send message to background script to rerun with current level
        chrome.runtime.sendMessage({
          type: APP_CONSTANTS.MESSAGE_TYPES.RERUN_SUMMARIZATION,
          text: selectedText,
          level: generation
        })
      } else {
        // No generation found for level - handle gracefully
      }
    }
  }, [selectedText, currentLevel])

  const handleLevelChange = useCallback((newLevel: string | number) => {
    const level = typeof newLevel === 'string' ? parseInt(newLevel) : newLevel
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
  }, [selectedText])

  const messageListener = useCallback((
    message: { type: string; chunk?: string; error?: string; total?: number; loaded?: number; level?: number; isFirst?: boolean; text?: string; selectedText?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (message.type === APP_CONSTANTS.MESSAGE_TYPES.STREAM_RESPONSE) {
      setLoading(true)
      if (message.isFirst) {
        setSummary("")
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
    } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.ERROR) {
      setSummary(message.error || "An error occurred")
      setLoading(false)
    } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.AI_INITIATE) {
      setLoading(true)
      setSummary("")
      setTotal(message.total || 0)
      setProgress(message.loaded || 0)
    } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.STREAM_COMPLETE) {
      setLoading(false)
      if (message.level) {
        setCurrentLevel(message.level)
      }
    } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.TEXT_SELECTED) {
      // Store the selected text for potential rerun
      if (message.text) {
        setSelectedText(message.text)
      }
    } else if (message.type === APP_CONSTANTS.MESSAGE_TYPES.RERUN_COMPLETE) {
      // Handle rerun completion if needed
      setLoading(false)
    }
    sendResponse()
  }, [selectedText])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [messageListener])

  const generationOptions = generations.map(gen => ({
    value: gen.level,
    label: gen.name,
    description: gen.description
  }))

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Explain in Generations</h1>
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
                  const nextTheme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system'
                  setTheme(nextTheme)
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                aria-label="Toggle theme"
              >
                {theme === 'system' ? '🌓' : theme === 'light' ? '☀️' : '🌙'}
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
              Rerun with {getGenerationByLevel(currentLevel)?.name}
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
        <div className="rounded-lg border p-4 prose dark:prose-invert max-w-none">
          {summary || loading ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                  {levelNames[currentLevel as keyof typeof levelNames]}
                </span>
              </div>
              {summary ? (
                <Markdown>
                  {summary}
                </Markdown>
              ) : (
                <div className="flex items-center gap-2 text-lg">
                  <span className="inline-flex space-x-2">
                    <span className="animate-[dot_1.4s_infinite] [animation-delay:0.2s] text-blue-500 dark:text-blue-400 text-2xl font-bold">●</span>
                    <span className="animate-[dot_1.4s_infinite] [animation-delay:0.4s] text-blue-500 dark:text-blue-400 text-2xl font-bold">●</span>
                    <span className="animate-[dot_1.4s_infinite] [animation-delay:0.6s] text-blue-500 dark:text-blue-400 text-2xl font-bold">●</span>
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
