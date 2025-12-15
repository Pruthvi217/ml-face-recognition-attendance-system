"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Bot, User, ArrowLeft, BookOpen } from "lucide-react"
import { LearningPathDisplay } from "./learning-path-display"
import { formatLearningPath, generateLearningPathContent, handleSendMessage } from "./utils" // Import the missing functions

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  initialData: any
  onBack: () => void
}

export function ChatInterface({ initialData, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [learningPath, setLearningPath] = useState<any>(null)
  const [currentPhase, setCurrentPhase] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate initial learning path
    generateInitialPath()
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateInitialPath = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initialData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate learning path")
      }

      const data = await response.json()
      setLearningPath(data.learningPath)
      const content = formatLearningPath(data.learningPath, initialData)

      const initialMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content,
        timestamp: new Date(),
      }

      setMessages([initialMessage])
    } catch (error) {
      console.error("Error generating initial path:", error)
      // Fallback to static content
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: generateLearningPathContent(initialData),
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    handleSendMessage(
      e,
      input,
      setInput,
      messages,
      setMessages,
      setIsLoading,
      initialData,
      learningPath,
      setLearningPath,
    )
  }

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold">LearnPath AI</h1>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Learning: {initialData.goal}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto h-full">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
              <TabsTrigger value="roadmap">
                <BookOpen className="w-4 h-4 mr-2" />
                Learning Roadmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}

                      <Card
                        className={`max-w-3xl p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "message-gradient border-border/50"
                        }`}
                      >
                        <div className="prose prose-sm max-w-none text-current">
                          {message.role === "assistant" ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: message.content
                                  .replace(/\n/g, "<br>")
                                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                  .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-3">$1</h1>')
                                  .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mb-2 mt-4">$1</h2>')
                                  .replace(/^### (.*$)/gm, '<h3 class="text-base font-medium mb-2 mt-3">$1</h3>')
                                  .replace(
                                    /^- \[ \] (.*$)/gm,
                                    '<div class="flex items-center gap-2 my-1"><input type="checkbox" class="rounded"> <span>$1</span></div>',
                                  )
                                  .replace(
                                    /^- (.*$)/gm,
                                    '<div class="flex items-start gap-2 my-1"><span class="text-primary">•</span> <span>$1</span></div>',
                                  ),
                              }}
                            />
                          ) : (
                            <p>{message.content}</p>
                          )}
                        </div>
                      </Card>

                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <Card className="max-w-3xl p-4 message-gradient border-border/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                          <span className="text-sm text-muted-foreground ml-2">Generating response...</span>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your learning path..."
                    className="flex-1 bg-input/50"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={!input.trim() || isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="roadmap" className="flex-1">
              {learningPath && (
                <LearningPathDisplay
                  phases={learningPath.phases}
                  currentPhase={currentPhase}
                  onPhaseSelect={setCurrentPhase}
                  learningPath={learningPath}
                  onPathUpdate={setLearningPath}
                  userProfile={initialData}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
