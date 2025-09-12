"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Save, ArrowLeft, Loader2, Mic, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import AudioRecorder from "@/components/audio-recorder"
import ImageUploader from "@/components/image-uploader"
import type { User } from "@supabase/supabase-js"

interface Prompt {
  id: string
  text: string
  category: string
}

interface JournalEntryFormProps {
  prompt: Prompt
  onBack: () => void
  onSaved: () => void
}

export default function JournalEntryForm({ prompt, onBack, onSaved }: JournalEntryFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [audioDuration, setAudioDuration] = useState(0)
  const [imageUrl, setImageUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)
  const [showImageUploader, setShowImageUploader] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handleAudioSaved = (url: string, duration: number) => {
    setAudioUrl(url)
    setAudioDuration(duration)
    setSaveMessage("Audio saved! You can now save your complete journal entry.")
    setShowAudioRecorder(false)
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
    if (url) {
      setSaveMessage("Photo uploaded! You can now save your complete journal entry.")
      setShowImageUploader(false)
    }
  }

  const handleSave = async () => {
    if (!content.trim() && !audioUrl && !imageUrl) {
      setSaveMessage("Please write something, record audio, or add a photo before saving.")
      return
    }

    if (!user) {
      setSaveMessage("You must be logged in to save entries.")
      return
    }

    setIsSaving(true)
    setSaveMessage("")

    try {
      const { error } = await supabase.from("journal_entries").insert({
        prompt_id: prompt.id,
        title: title.trim() || null,
        content: content.trim() || null,
        audio_url: audioUrl || null,
        audio_duration: audioDuration || null,
        image_url: imageUrl || null,
        user_id: user.id,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving entry:", error)
        if (error.message.includes("journal_entries") && error.message.includes("schema cache")) {
          setSaveMessage("Database setup required. Please run the setup script from Project Settings.")
        } else {
          setSaveMessage("There was an error saving your entry. Please try again.")
        }
      } else {
        setSaveMessage("Your journal entry has been saved!")
        setTimeout(() => {
          onSaved()
        }, 2000)
      }
    } catch (error) {
      console.error("Error:", error)
      setSaveMessage("There was an error saving your entry. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = () => {
    setTitle("")
    setContent("")
    setAudioUrl("")
    setAudioDuration(0)
    setImageUrl("")
    setSaveMessage("")
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header with back button and prompt display */}
      <div className="mb-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:bg-[var(--color-sage-light)] font-semibold text-lg p-2 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Prompts
        </Button>

        <div className="bg-[var(--color-cream-dark)] rounded-lg p-6 text-center">
          <p className="text-xl leading-relaxed text-[var(--color-text)]">{prompt.text}</p>
          <div className="inline-block px-3 py-1 bg-[var(--color-sage-light)] text-[var(--color-charcoal)] rounded-full text-sm font-medium mt-4">
            {prompt.category}
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Paper-like background with lines */}
        <div
          className="bg-white rounded-lg shadow-lg p-4 sm:p-8 border-l-4 border-red-300 relative"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, transparent 31px, #e5e7eb 32px, transparent 33px)
            `,
            backgroundSize: "100% 32px, 100% 32px",
            backgroundPosition: "20px 0, 0 0",
          }}
        >
          {/* Hole punches */}
          <div className="absolute left-2 sm:left-4 top-8 space-y-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300 rounded-full"></div>
            ))}
          </div>

          {/* Title section */}
          <div className="ml-4 sm:ml-8 mb-8">
            <div className="border-2 border-gray-400 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-600 mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="border-none bg-transparent text-lg font-medium focus:ring-0 focus:outline-none p-0"
                maxLength={255}
              />
            </div>
          </div>

          {/* Main thoughts section */}
          <div className="ml-4 sm:ml-8 mb-8">
            <div className="border-2 border-gray-400 rounded-lg p-4 bg-gray-50 min-h-[300px]">
              <label className="block text-sm font-medium text-gray-600 mb-2">Your Thoughts</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, memories, or feelings here..."
                className="border-none bg-transparent text-base focus:ring-0 focus:outline-none p-0 resize-none min-h-[250px]"
                style={{ lineHeight: "32px" }}
              />
            </div>
          </div>

          {/* Action buttons section */}
          <div className="ml-4 sm:ml-8 flex flex-col sm:flex-row gap-4 mb-8">
            {/* Record Audio Button */}
            <div className="border-2 border-gray-400 rounded-lg p-4 bg-gray-50 flex-1">
              <Button
                onClick={() => setShowAudioRecorder(!showAudioRecorder)}
                variant="ghost"
                className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-100"
              >
                <Mic className="h-6 w-6" />
                <span className="text-sm font-medium">Record Audio</span>
              </Button>
              {audioUrl && <div className="mt-2 text-xs text-green-600 text-center">✓ Audio recorded</div>}
            </div>

            {/* Upload Photo Button */}
            <div className="border-2 border-gray-400 rounded-lg p-4 bg-gray-50 flex-1">
              <Button
                onClick={() => setShowImageUploader(!showImageUploader)}
                variant="ghost"
                className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-100"
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm font-medium">Upload Photo</span>
              </Button>
              {imageUrl && <div className="mt-2 text-xs text-green-600 text-center">✓ Photo uploaded</div>}
            </div>
          </div>
        </div>
      </div>

      {showAudioRecorder && (
        <Card className="mt-6 p-6">
          <AudioRecorder onAudioSaved={handleAudioSaved} existingAudioUrl={audioUrl} existingDuration={audioDuration} />
        </Card>
      )}

      {showImageUploader && (
        <Card className="mt-6 p-6">
          <ImageUploader onImageUploaded={handleImageUploaded} existingImageUrl={imageUrl} />
        </Card>
      )}

      {saveMessage && (
        <div
          className={`mt-6 p-4 rounded-lg text-center font-medium ${
            saveMessage.includes("saved") ||
            saveMessage.includes("uploaded") ||
            saveMessage.includes("Audio saved") ||
            saveMessage.includes("Photo uploaded")
              ? "bg-green-100 text-green-800 border-2 border-green-200"
              : "bg-red-100 text-red-800 border-2 border-red-200"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button
          onClick={handleSave}
          disabled={isSaving || (!content.trim() && !audioUrl && !imageUrl)}
          className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Entry
            </>
          )}
        </Button>

        <Button
          onClick={handleClear}
          variant="outline"
          className="border-2 border-[var(--color-warm-gray)] text-[var(--color-warm-gray)] hover:bg-[var(--color-warm-gray)] hover:text-white font-semibold text-lg px-8 py-4 rounded-lg bg-transparent"
        >
          Clear All
        </Button>
      </div>

      <div className="bg-[var(--color-sage-light)] rounded-lg p-4 mt-6">
        <p className="text-[var(--color-charcoal)] text-center">
          Write your thoughts, record your voice, or add a photo - you can use any combination that feels right for you.
        </p>
      </div>
    </div>
  )
}
