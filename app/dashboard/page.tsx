"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import DailyPrompt from "@/components/daily-prompt"
import JournalEntryForm from "@/components/journal-entry-form"
import EntryList from "@/components/entry-list"
import EntryDetail from "@/components/entry-detail"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Prompt {
  id: string
  text: string
  category: string
}

interface JournalEntry {
  id: string
  title: string | null
  content: string | null
  audio_url: string | null
  audio_duration: number | null
  created_at: string
  prompt: {
    text: string
    category: string
  } | null
}

type ViewState = "home" | "writing" | "entries" | "entry-detail"

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewState>("home")
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)

      if (!user) {
        router.push("/login")
      }
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        router.push("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setCurrentView("writing")
    setShowSuccessMessage(false)
  }

  const handleBackToHome = () => {
    setCurrentView("home")
    setSelectedPrompt(null)
    setSelectedEntry(null)
    setShowSuccessMessage(false)
  }

  const handleViewEntries = () => {
    setCurrentView("entries")
  }

  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setCurrentView("entry-detail")
  }

  const handleBackToEntries = () => {
    setCurrentView("entries")
    setSelectedEntry(null)
  }

  const handleEntrySaved = () => {
    setShowSuccessMessage(true)
    setTimeout(() => {
      setCurrentView("home")
      setSelectedPrompt(null)
      setShowSuccessMessage(false)
    }, 3000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fef7f0" }}>
      {currentView === "home" && !showSuccessMessage && (
        <div className="hero-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex items-center justify-center mb-8">
              <div className="star-icon">
                <span className="text-2xl text-teal-700">✨</span>
              </div>
              <h1 className="text-2xl font-semibold text-teal-700 ml-2">Memory journal</h1>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
              Every day, a story remembered
            </h2>
            <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
              This is your gentle space to capture memories, thoughts, and daily moments—no matter how big or small.
              Write for yourself, share with loved ones, and revisit the journey together. Here, you're always
              supported, and every entry is a celebration of your life.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-lg">👤</span>
            <span className="text-sm">{user.email}</span>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-white/50"
          >
            <span className="mr-2">🚪</span>
            Sign Out
          </Button>
        </header>

        <main className="space-y-8">
          {showSuccessMessage && (
            <Card className="card">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Entry Saved!</h2>
                <p className="text-lg text-muted-foreground">
                  Your journal entry has been saved successfully. Returning to home...
                </p>
              </div>
            </Card>
          )}

          {currentView === "home" && !showSuccessMessage && (
            <>
              <DailyPrompt onPromptSelect={handlePromptSelect} />

              <Card className="card">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-semibold text-foreground">What would you like to do?</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Button
                      onClick={() => setCurrentView("writing")}
                      className="hover:bg-accent flex items-center gap-3 font-semibold text-lg px-8 py-6 h-auto rounded-xl transition-all duration-200 hover:scale-105 bg-emerald-700 text-white"
                    >
                      <span className="text-xl">➕</span>
                      <div className="text-left">
                        <div className="font-semibold">Start New Entry</div>
                        <div className="text-sm opacity-90">Write or record your thoughts</div>
                      </div>
                    </Button>

                    <Button
                      onClick={handleViewEntries}
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8 py-6 h-auto flex items-center gap-3 rounded-xl transition-all duration-200 hover:scale-105 bg-green-100"
                    >
                      <span className="text-xl">📖</span>
                      <div className="text-left">
                        <div className="font-semibold">Review Entries</div>
                        <div className="text-sm opacity-90">Read your past memories</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="feedback-card">
                <div className="text-center space-y-3">
                  <h3 className="text-base font-medium text-foreground">Got feedback?</h3>
                  <p className="text-muted-foreground text-xs">Help us improve your experience</p>
                  <Button
                    onClick={() => window.open("https://forms.gle/uHbk4oTLE6P6FdW38", "_blank")}
                    variant="outline"
                    size="sm"
                    className="border border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
                  >
                    Share Your Thoughts
                  </Button>
                  <p className="text-xs text-muted-foreground/70">Opens in a new tab</p>
                </div>
              </Card>
            </>
          )}

          {currentView === "writing" && selectedPrompt && (
            <JournalEntryForm prompt={selectedPrompt} onBack={handleBackToHome} onSaved={handleEntrySaved} />
          )}

          {currentView === "writing" && !selectedPrompt && <DailyPrompt onPromptSelect={handlePromptSelect} />}

          {currentView === "entries" && <EntryList onBack={handleBackToHome} onEntrySelect={handleEntrySelect} />}

          {currentView === "entry-detail" && selectedEntry && (
            <EntryDetail entry={selectedEntry} onBack={handleBackToEntries} />
          )}
        </main>
      </div>
    </div>
  )
}
