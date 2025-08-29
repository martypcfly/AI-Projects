"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState("")
  const [trialEntry, setTrialEntry] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const isTrialUser = searchParams.get("trial") === "true"
    if (isTrialUser) {
      setIsSignUp(true)
      const storedEntry = localStorage.getItem("trialEntry")
      if (storedEntry) {
        setTrialEntry(JSON.parse(storedEntry))
      }
    }
  }, [searchParams])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const supabase = createClient()

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          },
        })

        if (error) throw error

        if (trialEntry) {
          setTimeout(async () => {
            try {
              const {
                data: { user },
              } = await supabase.auth.getUser()
              if (user) {
                await supabase.from("journal_entries").insert({
                  user_id: user.id,
                  prompt: trialEntry.prompt,
                  title: trialEntry.title || null,
                  content: trialEntry.content,
                  created_at: trialEntry.timestamp,
                })
                localStorage.removeItem("trialEntry")
              }
            } catch (saveError) {
              console.error("Error saving trial entry:", saveError)
            }
          }, 2000)
        }

        setMessage("Check your email for a verification link!")
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          router.push("/dashboard")
        }
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred during authentication")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#fef7f0" }}>
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-teal-700 p-3 rounded-full">
              <span className="text-white text-2xl">💝</span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Memory Journal</h1>
            <p className="text-gray-700 text-lg mt-2">
              {trialEntry
                ? "Save your journal entry by creating an account"
                : isSignUp
                  ? "Create your account"
                  : "Welcome back"}
            </p>
          </div>
        </div>

        {trialEntry && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">Your journal entry:</h4>
            {trialEntry.title && <p className="text-sm font-medium text-gray-800">"{trialEntry.title}"</p>}
            <p className="text-sm text-gray-600 mt-1">
              {trialEntry.content.slice(0, 100)}
              {trialEntry.content.length > 100 ? "..." : ""}
            </p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 font-semibold">
              Email Address
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">@</span>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 text-lg py-3"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-900 font-semibold">
              Password
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">🔒</span>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 text-lg py-3"
                placeholder="Enter your password"
                minLength={6}
                required
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-center ${
                message.includes("error") || message.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white text-lg py-3 font-semibold"
          >
            {isLoading
              ? "Loading..."
              : trialEntry
                ? "Save Entry & Create Account"
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
          </Button>
        </form>

        {!trialEntry && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage("")
              }}
              className="text-teal-700 hover:text-teal-800 font-semibold"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
