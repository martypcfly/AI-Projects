"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, FileText, Volume2, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface JournalEntry {
  id: string
  title: string | null
  content: string | null
  audio_url: string | null
  audio_duration: number | null
  image_url: string | null
  created_at: string
  prompt: {
    text: string
    category: string
  } | null
}

interface EntryListProps {
  onBack: () => void
  onEntrySelect: (entry: JournalEntry) => void
}

export default function EntryList({ onBack, onEntrySelect }: EntryListProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchEntries(user)
      } else {
        setError("You must be logged in to view your entries.")
        setIsLoading(false)
      }
    }
    getUser()
  }, [])

  const fetchEntries = async (currentUser?: User) => {
    const userToUse = currentUser || user
    if (!userToUse) return

    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select(
          `
          id,
          title,
          content,
          audio_url,
          audio_duration,
          image_url,
          created_at,
          prompt:prompts(text, category)
        `,
        )
        .eq("user_id", userToUse.id) // Filter by user_id for privacy
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching entries:", error)
        setError("Unable to load your journal entries.")
      } else {
        setEntries(data || [])
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Unable to load your journal entries.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDuration = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) {
      return "0:00"
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getEntryPreview = (entry: JournalEntry) => {
    if (entry.content) {
      return entry.content.length > 100 ? entry.content.substring(0, 100) + "..." : entry.content
    }
    if (entry.audio_url) {
      return "Audio recording"
    }
    if (entry.image_url) {
      return "Photo entry"
    }
    return "No content"
  }

  if (isLoading) {
    return (
      <Card className="card">
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="card">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:bg-[var(--color-sage-light)] font-semibold text-lg p-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Journal
          </Button>
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">Your Journal Entries</h2>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-200 text-red-800 p-4 rounded-lg text-center">{error}</div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No entries yet</h3>
            <p className="text-[var(--color-text-muted)] text-lg">
              Start journaling to see your entries here. Your memories and thoughts will be safely stored.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="p-4 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                onClick={() => onEntrySelect(entry)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">
                          {entry.title || "Untitled Entry"}
                        </h3>
                        {entry.prompt && (
                          <div className="inline-block px-2 py-1 bg-[var(--color-sage-light)] text-[var(--color-charcoal)] rounded-full text-xs font-medium">
                            {entry.prompt.category}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-[var(--color-text-muted)] flex-shrink-0" />
                    </div>

                    <p className="text-[var(--color-text-muted)] leading-relaxed">{getEntryPreview(entry)}</p>

                    <div className="flex items-center space-x-4 text-sm text-[var(--color-text-muted)]">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(entry.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(entry.created_at)}</span>
                      </div>
                      {entry.audio_url && (
                        <div className="flex items-center space-x-1">
                          <Volume2 className="h-4 w-4" />
                          <span>{formatDuration(entry.audio_duration || 0)}</span>
                        </div>
                      )}
                      {entry.image_url && (
                        <div className="flex items-center space-x-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <div className="bg-[var(--color-sage-light)] rounded-lg p-4 text-center">
            <p className="text-[var(--color-charcoal)] font-medium">
              You have {entries.length} journal {entries.length === 1 ? "entry" : "entries"}
            </p>
            <p className="text-[var(--color-charcoal)] text-sm mt-1">
              Keep writing to build your collection of memories and thoughts
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
