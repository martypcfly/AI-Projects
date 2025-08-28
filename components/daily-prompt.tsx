"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Prompt {
  id: string
  text: string
  category: string
}

interface DailyPromptProps {
  onPromptSelect: (prompt: Prompt) => void
}

const fallbackPrompts: Prompt[] = [
  {
    id: "fallback-1",
    text: "Tell me about a childhood memory that still makes you smile.",
    category: "childhood",
  },
  {
    id: "fallback-2",
    text: "Describe your wedding day or a special celebration you'll never forget.",
    category: "celebrations",
  },
  {
    id: "fallback-3",
    text: "What was your first job like? What do you remember most about it?",
    category: "career",
  },
  {
    id: "fallback-4",
    text: "Tell me about a time when you felt really proud of yourself.",
    category: "achievements",
  },
  { id: "fallback-5", text: "Describe your favorite family tradition or holiday memory.", category: "family" },
  {
    id: "fallback-6",
    text: "What was the best advice someone ever gave you? Who gave it to you?",
    category: "wisdom",
  },
  {
    id: "fallback-7",
    text: "Tell me about a place from your past that holds special meaning.",
    category: "places",
  },
  {
    id: "fallback-8",
    text: "Describe a friendship that has been important in your life.",
    category: "relationships",
  },
  { id: "fallback-9", text: "What was your favorite subject in school and why?", category: "education" },
  {
    id: "fallback-10",
    text: "Tell me about a time when you overcame a challenge or difficulty.",
    category: "resilience",
  },
  {
    id: "fallback-11",
    text: "Describe your childhood home. What room was your favorite?",
    category: "childhood",
  },
  { id: "fallback-12", text: "What family recipe or meal brings back special memories?", category: "food" },
  {
    id: "fallback-13",
    text: "Tell me about a teacher, mentor, or person who influenced your life.",
    category: "influences",
  },
  { id: "fallback-14", text: "Describe a vacation or trip that created lasting memories.", category: "travel" },
  { id: "fallback-15", text: "What family recipe or meal brings back special memories?", category: "food" },
]

export default function DailyPrompt({ onPromptSelect }: DailyPromptProps) {
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const supabase = createClient()

  const getRandomFallbackPrompt = () => {
    const randomIndex = Math.floor(Math.random() * fallbackPrompts.length)
    const selectedPrompt = fallbackPrompts[randomIndex]
    return selectedPrompt
  }

  const fetchRandomPrompt = async () => {
    try {
      if (!useFallback) {
        const { data, error } = await supabase.rpc("get_random_prompt")

        if (error) {
          setUseFallback(true)
          const fallbackPrompt = getRandomFallbackPrompt()
          setCurrentPrompt(fallbackPrompt)
        } else if (data && data.length > 0) {
          setCurrentPrompt(data[0])
        } else {
          const fallbackPrompt = getRandomFallbackPrompt()
          setCurrentPrompt(fallbackPrompt)
        }
      } else {
        const fallbackPrompt = getRandomFallbackPrompt()
        setCurrentPrompt(fallbackPrompt)
      }
    } catch (error) {
      setUseFallback(true)
      const fallbackPrompt = getRandomFallbackPrompt()
      setCurrentPrompt(fallbackPrompt)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchRandomPrompt()
  }

  const handleStartJournal = () => {
    if (currentPrompt) {
      onPromptSelect(currentPrompt)
    }
  }

  useEffect(() => {
    fetchRandomPrompt()
  }, [])

  if (isLoading) {
    return (
      <Card className="card">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </Card>
    )
  }

  const displayPrompt = currentPrompt || getRandomFallbackPrompt()

  return (
    <Card className="card">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">Today's Journal Prompt</h2>
          <div className="inline-block px-3 py-1 bg-[var(--color-sage-light)] text-[var(--color-charcoal)] rounded-full text-sm font-medium bg-slate-200">
            {displayPrompt?.category || "general"}
          </div>
        </div>

        <div className="bg-[var(--color-cream-dark)] rounded-lg p-6">
          <p className="text-xl leading-relaxed text-[var(--color-text)]">{displayPrompt?.text}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleStartJournal}
            className="hover:bg-accent flex items-center gap-2 font-semibold text-lg px-6 py-3 rounded-lg transition-all duration-200 opacity-100 bg-emerald-700 text-white"
          >
            <MessageCircle className="h-5 w-5" />
            Start Writing
          </Button>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white font-semibold text-lg px-6 py-3 rounded-lg bg-green-100"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Getting New Prompt..." : "Try Another Prompt"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
