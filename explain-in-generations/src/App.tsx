import { useEffect, useState } from "react"
import Markdown from "markdown-to-jsx"
import { Switch } from "./components/ui/Switch"
import { Select } from "./components/ui/Select"
import { Button } from "./components/ui/Button"
import TrashIcon from "./components/icons/TrashIcon"
import { RefreshCw } from "lucide-react"

const generations = [
  {
    level: 1,
    name: "The Greatest Generation",
    context: "Explain like I'm from the Greatest Generation (1901-1924). Address me with proper respect and formality - we believe in doing things the right way, not the easy way. Use dignified, measured language that reflects our values of duty, honor, and service above self. Reference our experiences through the Great Depression and World War II when explaining resilience and sacrifice. We built this country through hard work and determination, not shortcuts or gimmicks. Speak with the authority of someone who has earned their stripes through adversity. Use phrases like 'in my experience,' 'as we learned during the war,' 'back when we had to make do,' and 'it's a matter of principle.' Think: commanding officer's briefing, church elder's counsel, or grandfather's wisdom passed down. We value substance over style, duty over comfort, and results over rhetoric.",
    description: "Duty-bound formal discourse, earned authority through adversity, principled substance over style, wartime resilience wisdom"
  },
  {
    level: 2,
    name: "The Silent Generation",
    context: "Explain like I'm from the Silent Generation (1928-1945). Please use proper, formal language with appropriate respect - none of this casual nonsense. Keep it measured and deliberate, like a well-composed memo or letter. Reference how we did things back in my day when work ethic and common sense mattered. Be direct and concise - actions speak louder than words, after all. Use expressions like 'back in my day,' 'that's the proper way,' 'mind your manners,' and 'if you please.' Think formal correspondence style with traditional values. Children should be seen and not heard applies to explanations too - get to the point without unnecessary flourish.",
    description: "Proper formal language, back in my day references, measured deliberate tone, traditional manners and respect"
  },
  {
    level: 3,
    name: "Baby Boomer",
    context: "Explain like I'm a Baby Boomer (1946-1964). Well, I'll be! Keep it proper and thoughtful - you're welcome for taking the time to explain things thoroughly. This should be the real McCoy, not some amateur night production. Make it an E-ticket ride with detailed explanations that are the bee's knees. Don't give me any of that newfangled 'no problem' nonsense when a proper 'you're welcome' will do just fine. Take your time to spell things out completely - none of this text-speak mumbo jumbo. Reference the good old days, when things were built to last and people had some common sense. Think: well-written letter or evening news broadcast style, clear as a bell and straight as an arrow.",
    description: "The real McCoy with proper manners, E-ticket thoroughness, bee's knees clarity, well-mannered traditional style"
  },
  {
    level: 4,
    name: "Generation X",
    context: "Explain like I'm from Generation X (1965-1979). Whatever, just cut to the chase and keep it real - no corporate BS, please. If it's the bomb, tell me straight up; if it's a buzzkill, don't sugarcoat it. Cool beans if you throw in some MTV, grunge, or early internet references that are off the chain. I'm all about that DIY, latchkey kid independence, so give me actionable stuff I can actually use. Skip the fluff and respect my time - I've got things to handle and I'm not here for games.",
    description: "Whatever attitude with real talk, the bomb when it's direct, cool beans DIY vibes, off the chain efficiency"
  },
  {
    level: 5,
    name: "Millennial",
    context: "Explain like I'm a Millennial (1980-1994). OMG bae, this is about to be SO lit! 🔥 I'm low-key obsessed with 90s/2000s nostalgia that's totally the GOAT - throw in some Friends references (obvs), Harry Potter analogies, and maybe some Pokémon metaphors? I have major FOMO when it comes to missing good content, so make it BuzzFeed-listicle style that's addictive AF. We're all just trying to adult here, fam, and honestly adulting is hard! Include some life hacks for surviving this gig economy because your girl is SHOOK by these student loans. No cap, keep it 100% real without throwing shade - we've been through enough! Make it relatable to our side-hustle grind and quarter-life crisis vibes. BRB while I grab my avocado toast and process this epic content! ✨",
    description: "OMG so lit! 🔥 90s/2000s nostalgia that's the GOAT, adulting struggles are real fam, side-hustle vibes, no cap authentic"
  },
  {
    level: 6,
    name: "Generation Z",
    context: "Explain like I'm from Generation Z (1995-2012). No cap, keep it 100 and spill the tea with that authentic rizz! Break it down in bite-sized chunks that are absolutely bussin' - none of that cringe corporate speak because we're not delulu here. Think: Instagram story format that ate, TikTok comment energy with mad drip, or Twitter thread that absolutely slaps. Bet you want those quick takeaways that hit different, so serve me explanations that are straight fire with that main character energy! Use AAVE-influenced phrases naturally, keep it real and relatable, and don't be afraid to say when something is mid or when the vibes are off.",
    description: "No cap realness, bussin' bite-sized format, ate the assignment with rizz, main character energy that slaps"
  },
  {
    level: 7,
    name: "Generation Alpha",
    context: "Explain like I'm from Generation Alpha (2013-2025). Give me that linguistic glow-up with skibidi explanations! Use rizz-level emojis 🚀, Ohio-tier gamification, and brain rot content that slaps. Break into mini-challenges with maximum rizz, use AI/tech analogies that are straight fire, and keep it bussin with interactive vibes. Think: TikTok brain rot explanations with skibidi transitions and visual cues that hit different.",
    description: "Skibidi-level interactive style 🎮, Ohio-tier gamified chunks 🎯, brain rot AI explanations 🤖, rizz-maxing emoji communication 😊"
  }
]

const levelNames = {
  1: "The Greatest Generation (1901-1924)",
  2: "The Silent Generation (1925-1945)",
  3: "Baby Boomer (1946-1964)",
  4: "Generation X (1965-1979)",
  5: "Millennial (1980-1994)",
  6: "Generation Z (1995-2012)",
  7: "Generation Alpha (2013-2025)"
}

function App() {
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(7)
  const [selectedText, setSelectedText] = useState<string>("")
  const [canRerun, setCanRerun] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Load saved generation level on component mount
  useEffect(() => {
    chrome.storage.local.get(['currentLevel'], (result) => {
      if (result.currentLevel?.level) {
        setCurrentLevel(result.currentLevel.level)
      }
    })
  }, [])

  const handleRerun = () => {
    if (selectedText) {
      // Send message to background script to rerun with current level
      chrome.runtime.sendMessage({
        type: "RERUN_SUMMARIZATION",
        text: selectedText,
        level: generations.find(g => g.level === currentLevel)
      })
    }
  }

  const handleLevelChange = (newLevel: string | number) => {
    const level = typeof newLevel === 'string' ? parseInt(newLevel) : newLevel
    setCurrentLevel(level)
    
    // Send the new level to background script
    const generation = generations.find(g => g.level === level)
    if (generation) {
      chrome.runtime.sendMessage({
        type: "SET_LEVEL",
        level: generation
      })
      
      // Automatically rerun summarization if we have selected text
      if (selectedText) {
        chrome.runtime.sendMessage({
          type: "RERUN_SUMMARIZATION",
          text: selectedText,
          level: generation
        })
      }
    }
  }

  useEffect(() => {
    const messageListener = (
      message: { type: string; chunk?: string; error?: string; total?: number; loaded?: number; level?: number; isFirst?: boolean; text?: string },
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (message.type === "STREAM_RESPONSE") {
        setLoading(true)
        if (message.isFirst) {
          setSummary("")
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
      } else if (message.type === "ERROR") {
        setSummary(message.error || "An error occurred")
        setLoading(false)
      } else if (message.type === "AI_INITIATE") {
        setLoading(true)
        setSummary("")
        setTotal(message.total || 0)
        setProgress(message.loaded || 0)
      } else if (message.type === "STREAM_COMPLETE") {
        setLoading(false)
        if (message.level) {
          setCurrentLevel(message.level)
        }
      } else if (message.type === "TEXT_SELECTED") {
        // Store the selected text for potential rerun
        if (message.text) {
          setSelectedText(message.text)
          setCanRerun(true)
        }
      }
      sendResponse()
    }

    chrome.runtime.onMessage.addListener(messageListener)
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [])

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
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label="Toggle theme"
              />
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
          
          {canRerun && selectedText && (
            <Button 
              onClick={handleRerun}
              disabled={loading}
              variant="outline"
              size="sm"
              className="self-start"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Rerun with {generations.find(g => g.level === currentLevel)?.name}
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
