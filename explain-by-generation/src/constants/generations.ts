export interface Generation {
  level: number
  name: string
  context: string
  description: string
}

export const generations: Generation[] = [
  {
    level: 1,
    name: "The Greatest Generation",
    context:
      "Explain like I'm from the Greatest Generation (1901-1924). Address me with proper respect and formality - we believe in doing things the right way, not the easy way. Use dignified, measured language that reflects our values of duty, honor, and service above self. Reference our experiences through the Great Depression and World War II when explaining resilience and sacrifice. We built this country through hard work and determination, not shortcuts or gimmicks. Speak with the authority of someone who has earned their stripes through adversity. Use phrases like 'in my experience,' 'as we learned during the war,' 'back when we had to make do,' and 'it's a matter of principle.' Think: commanding officer's briefing, church elder's counsel, or grandfather's wisdom passed down. We value substance over style, duty over comfort, and results over rhetoric.",
    description:
      "Duty-bound formal discourse, earned authority through adversity, principled substance over style, wartime resilience wisdom"
  },
  {
    level: 2,
    name: "The Silent Generation",
    context:
      "Explain like I'm from the Silent Generation (1928-1945). Please use proper, formal language with appropriate respect - none of this casual nonsense. Keep it measured and deliberate, like a well-composed memo or letter. Reference how we did things back in my day when work ethic and common sense mattered. Be direct and concise - actions speak louder than words, after all. Use expressions like 'back in my day,' 'that's the proper way,' 'mind your manners,' and 'if you please.' Think formal correspondence style with traditional values. Children should be seen and not heard applies to explanations too - get to the point without unnecessary flourish.",
    description:
      "Proper formal language, back in my day references, measured deliberate tone, traditional manners and respect"
  },
  {
    level: 3,
    name: "Baby Boomer",
    context:
      "Explain like I'm a Baby Boomer (1946-1964). Well, I'll be! Keep it proper and thoughtful - you're welcome for taking the time to explain things thoroughly. This should be the real McCoy, not some amateur night production. Make it an E-ticket ride with detailed explanations that are the bee's knees. Don't give me any of that newfangled 'no problem' nonsense when a proper 'you're welcome' will do just fine. Take your time to spell things out completely - none of this text-speak mumbo jumbo. Reference the good old days, when things were built to last and people had some common sense. Think: well-written letter or evening news broadcast style, clear as a bell and straight as an arrow.",
    description:
      "The real McCoy with proper manners, E-ticket thoroughness, bee's knees clarity, well-mannered traditional style"
  },
  {
    level: 4,
    name: "Generation X",
    context:
      "Explain like I'm from Generation X (1965-1979). Whatever, just cut to the chase and keep it real - no corporate BS, please. If it's the bomb, tell me straight up; if it's a buzzkill, don't sugarcoat it. Cool beans if you throw in some MTV, grunge, or early internet references that are off the chain. I'm all about that DIY, latchkey kid independence, so give me actionable stuff I can actually use. Skip the fluff and respect my time - I've got things to handle and I'm not here for games.",
    description:
      "Whatever attitude with real talk, the bomb when it's direct, cool beans DIY vibes, off the chain efficiency"
  },
  {
    level: 5,
    name: "Millennial",
    context:
      "Explain like I'm a Millennial (1980-1994). OMG bae, this is about to be SO lit! 🔥 I'm low-key obsessed with 90s/2000s nostalgia that's totally the GOAT - throw in some Friends references (obvs), Harry Potter analogies, and maybe some Pokémon metaphors? I have major FOMO when it comes to missing good content, so make it BuzzFeed-listicle style that's addictive AF. We're all just trying to adult here, fam, and honestly adulting is hard! Include some life hacks for surviving this gig economy because your girl is SHOOK by these student loans. No cap, keep it 100% real without throwing shade - we've been through enough! Make it relatable to our side-hustle grind and quarter-life crisis vibes. BRB while I grab my avocado toast and process this epic content! ✨",
    description:
      "OMG so lit! 🔥 90s/2000s nostalgia that's the GOAT, adulting struggles are real fam, side-hustle vibes, no cap authentic"
  },
  {
    level: 6,
    name: "Generation Z",
    context:
      "Explain like I'm from Generation Z (1995-2012). No cap, keep it 100 and spill the tea with that authentic rizz! Break it down in bite-sized chunks that are absolutely bussin' - none of that cringe corporate speak because we're not delulu here. Think: Instagram story format that ate, TikTok comment energy with mad drip, or Twitter thread that absolutely slaps. Bet you want those quick takeaways that hit different, so serve me explanations that are straight fire with that main character energy! Use AAVE-influenced phrases naturally, keep it real and relatable, and don't be afraid to say when something is mid or when the vibes are off.",
    description:
      "No cap realness, bussin' bite-sized format, ate the assignment with rizz, main character energy that slaps"
  },
  {
    level: 7,
    name: "Generation Alpha",
    context:
      "Explain like I'm from Generation Alpha (2013-2025). Give me that linguistic glow-up with skibidi explanations! Use rizz-level emojis 🚀, Ohio-tier gamification, and brain rot content that slaps. Break into mini-challenges with maximum rizz, use AI/tech analogies that are straight fire, and keep it bussin with interactive vibes. Think: TikTok brain rot explanations with skibidi transitions and visual cues that hit different.",
    description:
      "Skibidi-level interactive style 🎮, Ohio-tier gamified chunks 🎯, brain rot AI explanations 🤖, rizz-maxing emoji communication 😊"
  }
]

// Helper function to get generation by level
export const getGenerationByLevel = (level: number): Generation | undefined => {
  return generations.find((g) => g.level === level)
}

// Helper function to get generations in reverse order (for popup UI)
export const getGenerationsReversed = (): Generation[] => {
  return [...generations].reverse()
}

// Create level names mapping for backward compatibility
export const levelNames = generations.reduce(
  (acc, gen) => {
    acc[gen.level] = `${gen.name} (${getLevelYearRange(gen.level)})`
    return acc
  },
  {} as Record<number, string>
)

// Helper function to get year range for a generation level
function getLevelYearRange(level: number): string {
  const ranges = {
    1: "1901-1924",
    2: "1925-1945",
    3: "1946-1964",
    4: "1965-1979",
    5: "1980-1994",
    6: "1995-2012",
    7: "2013-2025"
  }
  return ranges[level as keyof typeof ranges] || ""
}
