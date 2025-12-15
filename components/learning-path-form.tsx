"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap } from "lucide-react"

interface LearningPathFormProps {
  onSubmit: (data: any) => void
}

export function LearningPathForm({ onSubmit }: LearningPathFormProps) {
  const [formData, setFormData] = useState({
    goal: "",
    currentLevel: "",
    timeAvailable: "",
    learningStyle: "",
    specificTopics: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="p-8 message-gradient border-border/50">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2 text-balance">Create Your Learning Path</h3>
        <p className="text-muted-foreground text-pretty">
          Tell us about your goals and we'll generate a personalized learning roadmap
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="goal">Career Goal or Learning Objective</Label>
            <Input
              id="goal"
              placeholder="e.g., Become a Full-Stack Developer"
              value={formData.goal}
              onChange={(e) => updateField("goal", e.target.value)}
              required
              className="bg-input/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentLevel">Current Skill Level</Label>
            <Select value={formData.currentLevel} onValueChange={(value) => updateField("currentLevel", value)}>
              <SelectTrigger className="bg-input/50">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Complete Beginner</SelectItem>
                <SelectItem value="some-knowledge">Some Knowledge</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeAvailable">Time Available</Label>
            <Select value={formData.timeAvailable} onValueChange={(value) => updateField("timeAvailable", value)}>
              <SelectTrigger className="bg-input/50">
                <SelectValue placeholder="How much time can you dedicate?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2-hours-day">1-2 hours per day</SelectItem>
                <SelectItem value="3-4-hours-day">3-4 hours per day</SelectItem>
                <SelectItem value="5-6-hours-day">5-6 hours per day</SelectItem>
                <SelectItem value="weekends-only">Weekends only</SelectItem>
                <SelectItem value="flexible">Flexible schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningStyle">Preferred Learning Style</Label>
            <Select value={formData.learningStyle} onValueChange={(value) => updateField("learningStyle", value)}>
              <SelectTrigger className="bg-input/50">
                <SelectValue placeholder="How do you learn best?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hands-on">Hands-on Projects</SelectItem>
                <SelectItem value="structured">Structured Courses</SelectItem>
                <SelectItem value="reading">Reading & Documentation</SelectItem>
                <SelectItem value="video">Video Tutorials</SelectItem>
                <SelectItem value="mixed">Mixed Approach</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specificTopics">Specific Topics or Technologies (Optional)</Label>
          <Textarea
            id="specificTopics"
            placeholder="e.g., React, Node.js, Python, Machine Learning, etc."
            value={formData.specificTopics}
            onChange={(e) => updateField("specificTopics", e.target.value)}
            className="bg-input/50 min-h-[80px]"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto"
          disabled={!formData.goal || !formData.currentLevel || !formData.timeAvailable || !formData.learningStyle}
        >
          <Zap className="w-4 h-4 mr-2" />
          Generate My Learning Path
        </Button>
      </form>
    </Card>
  )
}
