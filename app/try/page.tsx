"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Sample prompts for trial experience
const TRIAL_PROMPTS = [
  "What made you smile today, even if it was just for a moment?",
  "Describe a favorite memory from your childhood that still brings you joy.",
  "What's something you're grateful for right now?",
  "Tell me about a person who has made a positive impact on your life.",
  "What's a simple pleasure that you enjoyed recently?",
  "Describe a place that makes you feel peaceful and happy.",
  "What's something new you learned or discovered this week?",
  "Share a story about a time when someone showed you kindness.",
]

export default function TryPage() {
  const [selectedPrompt, setSelectedPrompt] = useState(TRIAL_PROMPTS[0])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [showSavePrompt, setShowSavePrompt] = useState(false)

  const handleNewPrompt = () => {
    const randomPrompt = TRIAL_PROMPTS[Math.floor(Math.random() * TRIAL_PROMPTS.length)]
    setSelectedPrompt(randomPrompt)
  }

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      // Store trial entry in localStorage
      const trialEntry = {
        prompt: selectedPrompt,
        title: title.trim(),
        content: content.trim(),
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("trialEntry", JSON.stringify(trialEntry))
      setShowSavePrompt(true)
    }
  }

  const handleSignUp = () => {
    // Redirect to login with trial parameter
    window.location.href = "/login?trial=true"
  }

  if (showSavePrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fef7f0" }}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Great start! 🌟</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-700">
              You've created your first journal entry! To save it and continue your memory journey, let's create your
              free account.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Your entry preview:</h4>
              {title && <p className="text-sm font-medium text-gray-800">"{title}"</p>}
              <p className="text-sm text-gray-600 mt-1">
                {content.slice(0, 100)}
                {content.length > 100 ? "..." : ""}
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={handleSignUp} className="w-full bg-primary hover:bg-accent text-primary-foreground">
                Save My Entry & Create Account
              </Button>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Maybe Later
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: "#fef7f0" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl">✨</span>
            <span className="text-xl font-semibold text-primary">Memory journal</span>
          </Link>
          <div className="text-sm text-gray-600">Try it free • No account needed</div>
        </div>

        {/* Trial Experience */}
        <div className="space-y-6">
          {/* Prompt Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-primary">Today's Reflection</CardTitle>
                <Button variant="outline" size="sm" onClick={handleNewPrompt} className="text-xs bg-transparent">
                  New Prompt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{selectedPrompt}</p>
            </CardContent>
          </Card>

          {/* Journal Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">Your Response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a title..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your thoughts</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, memories, or feelings..."
                  className="w-full min-h-[200px] resize-none"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500">{content.length} characters</div>
                <Button
                  onClick={handleSave}
                  disabled={!title.trim() && !content.trim()}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  Save Entry
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Encouragement */}
          <div className="text-center text-gray-600 text-sm">
            <p>Take your time. There's no rush. Every thought matters. ✨</p>
          </div>
        </div>
      </div>
    </div>
  )
}
