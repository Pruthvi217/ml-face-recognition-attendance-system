"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Target, BookOpen, Zap, Settings } from "lucide-react"

interface PathAdjustmentPanelProps {
  learningPath: any
  onPathUpdate: (updatedPath: any) => void
  userProfile: any
}

export function PathAdjustmentPanel({ learningPath, onPathUpdate, userProfile }: PathAdjustmentPanelProps) {
  const [timeCommitment, setTimeCommitment] = useState([2]) // hours per day
  const [learningStyle, setLearningStyle] = useState(userProfile.learningStyle)
  const [difficulty, setDifficulty] = useState("intermediate")
  const [focus, setFocus] = useState("balanced")

  const handleQuickAdjustment = (type: string) => {
    const updatedPath = { ...learningPath }

    switch (type) {
      case "faster":
        updatedPath.phases = updatedPath.phases.map((phase: any) => ({
          ...phase,
          duration: Math.max(2, Number.parseInt(phase.duration) - 1) + " weeks",
        }))
        break

      case "slower":
        updatedPath.phases = updatedPath.phases.map((phase: any) => ({
          ...phase,
          duration: Number.parseInt(phase.duration) + 2 + " weeks",
        }))
        break

      case "more-practice":
        updatedPath.phases = updatedPath.phases.map((phase: any) => ({
          ...phase,
          resources: [
            ...phase.resources,
            {
              title: "Additional Practice Exercises",
              type: "practice",
              url: "#",
              description: "Extra hands-on exercises for this phase",
            },
          ],
        }))
        break

      case "theory-focus":
        updatedPath.phases = updatedPath.phases.map((phase: any) => ({
          ...phase,
          resources: phase.resources.filter(
            (r: any) => r.type === "course" || r.type === "book" || r.type === "documentation",
          ),
        }))
        break
    }

    onPathUpdate(updatedPath)
  }

  const handleCustomAdjustment = () => {
    const updatedPath = { ...learningPath }

    // Adjust based on time commitment
    const timeMultiplier = timeCommitment[0] / 2 // Base is 2 hours
    updatedPath.phases = updatedPath.phases.map((phase: any) => ({
      ...phase,
      duration: Math.max(1, Math.round(Number.parseInt(phase.duration) / timeMultiplier)) + " weeks",
    }))

    // Adjust based on learning style
    if (learningStyle === "hands-on") {
      updatedPath.phases = updatedPath.phases.map((phase: any) => ({
        ...phase,
        resources: [
          ...phase.resources.filter((r: any) => r.type === "project" || r.type === "practice"),
          ...phase.resources.filter((r: any) => r.type !== "project" && r.type !== "practice").slice(0, 2),
        ],
      }))
    } else if (learningStyle === "video") {
      updatedPath.phases = updatedPath.phases.map((phase: any) => ({
        ...phase,
        resources: [
          ...phase.resources.filter((r: any) => r.type === "video" || r.type === "course"),
          ...phase.resources.filter((r: any) => r.type !== "video" && r.type !== "course").slice(0, 2),
        ],
      }))
    }

    // Adjust based on difficulty
    if (difficulty === "beginner") {
      updatedPath.phases = updatedPath.phases.map((phase: any, index: number) => ({
        ...phase,
        duration: Number.parseInt(phase.duration) + 1 + " weeks",
        topics: index === 0 ? ["Fundamentals", ...phase.topics] : phase.topics,
      }))
    } else if (difficulty === "advanced") {
      updatedPath.phases = updatedPath.phases.map((phase: any) => ({
        ...phase,
        topics: [...phase.topics, "Advanced Concepts", "Best Practices"],
      }))
    }

    onPathUpdate(updatedPath)
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Adjust Your Learning Path</h3>
      </div>

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick">Quick Adjustments</TabsTrigger>
          <TabsTrigger value="custom">Custom Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleQuickAdjustment("faster")}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Faster Pace
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAdjustment("slower")}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Slower Pace
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAdjustment("more-practice")}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              More Practice
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAdjustment("theory-focus")}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Theory Focus
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Click any button above to instantly adjust your learning path. Changes will be reflected immediately.
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Daily Time Commitment: {timeCommitment[0]} hours</label>
              <Slider
                value={timeCommitment}
                onValueChange={setTimeCommitment}
                max={8}
                min={0.5}
                step={0.5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Learning Style</label>
              <Select value={learningStyle} onValueChange={setLearningStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hands-on">Hands-on Practice</SelectItem>
                  <SelectItem value="video">Video Learning</SelectItem>
                  <SelectItem value="reading">Reading & Documentation</SelectItem>
                  <SelectItem value="mixed">Mixed Approach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (More Fundamentals)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (Balanced)</SelectItem>
                  <SelectItem value="advanced">Advanced (Skip Basics)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Learning Focus</label>
              <Select value={focus} onValueChange={setFocus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced Approach</SelectItem>
                  <SelectItem value="project-heavy">Project-Heavy</SelectItem>
                  <SelectItem value="theory-first">Theory First</SelectItem>
                  <SelectItem value="practical-first">Practical First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCustomAdjustment} className="w-full">
              Apply Custom Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
        <Badge variant="secondary" className="text-xs">
          Current: {learningPath?.phases?.length || 0} phases
        </Badge>
        <Badge variant="secondary" className="text-xs">
          Est. {learningPath?.totalDuration || "16-24 weeks"}
        </Badge>
      </div>
    </Card>
  )
}
