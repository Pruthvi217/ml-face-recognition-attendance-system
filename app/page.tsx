"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Bot, BookOpen, Clock, Target } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { LearningPathForm } from "@/components/learning-path-form"

export default function HomePage() {
  const [showChat, setShowChat] = useState(false)
  const [initialData, setInitialData] = useState<any>(null)

  const handleStartLearning = (formData: any) => {
    setInitialData(formData)
    setShowChat(true)
  }

  if (showChat) {
    return <ChatInterface initialData={initialData} onBack={() => setShowChat(false)} />
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-balance">LearnPath AI</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Your AI-Powered Learning <span className="text-primary">Journey Starts Here</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Generate personalized learning paths tailored to your goals, skill level, and available time. Get
              structured roadmaps with curated resources and actionable steps.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 message-gradient border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Goal-Oriented</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Tailored learning paths based on your specific career goals and interests
              </p>
            </Card>

            <Card className="p-6 message-gradient border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Time-Aware</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Realistic timelines that fit your schedule and learning pace
              </p>
            </Card>

            <Card className="p-6 message-gradient border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Resource-Rich</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Curated courses, books, documentation, and practical projects
              </p>
            </Card>
          </div>

          {/* Learning Path Form */}
          <LearningPathForm onSubmit={handleStartLearning} />
        </div>
      </main>
    </div>
  )
}
