"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="star-icon">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-primary">Memory journal</span>
        </div>
        <Link href="/login">
          <Button className="bg-primary hover:bg-accent text-primary-foreground px-6 py-2 rounded-lg font-medium">
            Join free
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-4xl mx-auto text-center px-6 text-white">
          <h1 className="hero-title mb-6">Every day, a story remembered</h1>
          <p className="hero-subtitle mb-8 max-w-2xl mx-auto">
            {
              "This is your gentle space to capture memories, thoughts, and daily moments—no matter how big or small. Write for yourself, share with loved ones, and revisit the journey together. Here, you're always supported, and every entry is a celebration of your life.\n\n"
            }
          </p>

          <div className="flex flex-col sm:flex-row justify-center mb-12 gap-4 mt-12">
            <Link href="/login">
              <Button className="bg-primary hover:bg-accent text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg">
                Start today
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg bg-transparent"
              onClick={scrollToFeatures}
            >
              How it works
            </Button>
          </div>

          {/* Hero Images */}
          <div className="relative max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4 items-center">
              <img src="/elderly-person-journal.png" alt="Person writing in journal" className="rounded-lg shadow-lg" />
              <div className="space-y-4">
                <img src="/writing-with-coffee.png" alt="Hands writing in notebook" className="rounded-lg shadow-lg" />
                <img
                  src="/journal-with-family-photos.png"
                  alt="Open journal with family photos scattered around"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-primary text-primary-foreground py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider opacity-80 mb-4">FEATURE HIGHLIGHTS</p>
            <h2 className="text-4xl font-bold mb-4">Every day, a story remembered</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm uppercase tracking-wider opacity-80 mb-4">DAILY REFLECTION</p>
              <h3 className="text-2xl font-bold mb-4">Greet each day with kindness</h3>
              <p className="text-lg opacity-90 mb-6">
                We've built a thoughtful prompt that helps you reflect on your day. These small notes help you see and
                remember the joys that fill your days.
              </p>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Reflect
                </Button>
              </Link>
            </div>
            <div>
              <img src="/journal-writing-sunlight.png" alt="Daily reflection" className="rounded-lg shadow-xl" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mt-20">
            <div className="md:order-2">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-4">PHOTO MEMORIES</p>
              <h3 className="text-2xl font-bold mb-4">Share a special photo</h3>
              <p className="text-lg opacity-90 mb-6">
                Pick a picture that brings a smile or sparks a memory. Add context, share memories and invite others to
                share in your journey.
              </p>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Add photo
                </Button>
              </Link>
            </div>
            <div className="md:order-1">
              <img src="/scattered-family-photos.png" alt="Sharing photos" className="rounded-lg shadow-xl" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mt-20">
            <div>
              <p className="text-sm uppercase tracking-wider opacity-80 mb-4">PROMPTS & INSPIRATION</p>
              <h3 className="text-2xl font-bold mb-4">Gentle prompts, lasting memories</h3>
              <p className="text-lg opacity-90 mb-6">
                Not sure what to write? Friendly prompts guide you to recall meaningful stories, making it easy and
                enjoyable to capture what matters most.
              </p>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Explore
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="/writing-prompts-inspiration.png"
                alt="Journal open to inspiring writing prompts"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="star-icon">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-primary">Memory journal</span>
          </div>
          <p className="text-muted-foreground">Every day, a story remembered</p>
        </div>
      </footer>
    </div>
  )
}
