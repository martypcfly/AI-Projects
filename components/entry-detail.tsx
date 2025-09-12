"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, Play, Pause, Volume2, FileText } from "lucide-react"

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

interface EntryDetailProps {
  entry: JournalEntry
  onBack: () => void
}

export default function EntryDetail({ entry, onBack }: EntryDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <Card className="card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:bg-[var(--color-sage-light)] font-semibold text-lg p-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Entries
          </Button>
          {entry.prompt && (
            <div className="inline-block px-3 py-1 bg-[var(--color-sage-light)] text-[var(--color-charcoal)] rounded-full text-sm font-medium bg-slate-200">
              {entry.prompt.category}
            </div>
          )}
        </div>

        {/* Entry Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">{entry.title || "Journal Entry"}</h1>
          <div className="flex items-center justify-center space-x-4 text-[var(--color-text-muted)]">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(entry.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(entry.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Original Prompt */}
        {entry.prompt && (
          <div className="bg-[var(--color-cream-dark)] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Original Prompt:</h3>
            <p className="text-xl leading-relaxed text-[var(--color-text)]">{entry.prompt.text}</p>
          </div>
        )}

        {/* Entry Content */}
        <div className="space-y-6">
          {/* Written Content */}
          {entry.content && (
            <Card className="p-6 border-2 border-[var(--color-border)]">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-[var(--color-primary)]" />
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Written Response</h3>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-[var(--color-text)] leading-relaxed whitespace-pre-wrap text-lg">{entry.content}</p>
              </div>
            </Card>
          )}

          {/* Audio Content */}
          {entry.audio_url && (
            <Card className="p-6 border-2 border-[var(--color-border)]">
              <div className="flex items-center space-x-2 mb-4">
                <Volume2 className="h-5 w-5 text-[var(--color-primary)]" />
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Audio Response</h3>
              </div>

              <audio ref={audioRef} src={entry.audio_url} onEnded={() => setIsPlaying(false)} />

              <div className="flex items-center justify-between bg-[var(--color-sage-light)] rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={isPlaying ? pauseAudio : playAudio}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <div className="space-y-1">
                    <p className="text-[var(--color-charcoal)] font-medium">Audio Recording</p>
                    <p className="text-green-600 text-sm font-medium">
                      Duration: {formatDuration(entry.audio_duration || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Image Content */}
          {entry.image_url && (
            <Card className="p-6 border-2 border-[var(--color-border)]">
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  className="h-5 w-5 text-[var(--color-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Photo</h3>
              </div>
              <div className="bg-[var(--color-sage-light)] rounded-lg p-4">
                <img
                  src={entry.image_url || "/placeholder.svg"}
                  alt="Journal entry photo"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
              </div>
            </Card>
          )}

          {/* No Content Message */}
          {!entry.content && !entry.audio_url && !entry.image_url && (
            <Card className="p-6 border-2 border-[var(--color-border)] text-center">
              <p className="text-[var(--color-text-muted)] text-lg">
                This entry appears to be empty or the content could not be loaded.
              </p>
            </Card>
          )}
        </div>

        {/* Memory Reflection */}
        <div className="bg-[var(--color-sage-light)] rounded-lg p-4">
          <h3 className="font-semibold text-[var(--color-charcoal)] mb-2">Reflection:</h3>
          <p className="text-[var(--color-charcoal)] text-base">
            This entry was created on {formatDate(entry.created_at)} at {formatTime(entry.created_at)}. Take a moment to
            reflect on how you felt when you wrote this and how you feel reading it now.
          </p>
        </div>
      </div>
    </Card>
  )
}
