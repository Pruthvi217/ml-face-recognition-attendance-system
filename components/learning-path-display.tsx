"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Circle, Clock, BookOpen, ExternalLink, Play, Settings } from "lucide-react"
import { PathAdjustmentPanel } from "./path-adjustment-panel"
import type { LearningPhase, Resource } from "@/lib/huggingface"

interface LearningPathDisplayProps {
  phases: LearningPhase[]
  currentPhase?: number
  onPhaseSelect?: (phaseIndex: number) => void
  learningPath?: any
  onPathUpdate?: (updatedPath: any) => void
  userProfile?: any
}

export function LearningPathDisplay({
  phases,
  currentPhase = 0,
  onPhaseSelect,
  learningPath,
  onPathUpdate,
  userProfile,
}: LearningPathDisplayProps) {
  const [showAdjustments, setShowAdjustments] = useState(false)
  const totalPhases = phases.length
  const progress = ((currentPhase + 1) / totalPhases) * 100

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6 message-gradient border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Learning Progress</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Phase {currentPhase + 1} of {totalPhases}
            </Badge>
            {learningPath && onPathUpdate && userProfile && (
              <Button variant="outline" size="sm" onClick={() => setShowAdjustments(!showAdjustments)}>
                <Settings className="w-4 h-4 mr-2" />
                Adjust Path
              </Button>
            )}
          </div>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete - Keep up the great work!</p>
      </Card>

      {showAdjustments && learningPath && onPathUpdate && userProfile && (
        <PathAdjustmentPanel
          learningPath={learningPath}
          onPathUpdate={(updatedPath) => {
            onPathUpdate(updatedPath)
            setShowAdjustments(false)
          }}
          userProfile={userProfile}
        />
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="roadmap" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
          <TabsTrigger value="overview">Phase Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-4">
          {phases.map((phase, index) => (
            <PhaseCard
              key={index}
              phase={phase}
              phaseIndex={index}
              isActive={index === currentPhase}
              isCompleted={index < currentPhase}
              onClick={() => onPhaseSelect?.(index)}
            />
          ))}
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {phases.map((phase, index) => (
              <Card key={index} className="p-4 message-gradient border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  {index < currentPhase ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : index === currentPhase ? (
                    <Play className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <h4 className="font-semibold">{phase.title}</h4>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {phase.duration}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{phase.goal}</p>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    {phase.resources.length} resources • {phase.milestones.length} milestones
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{phase.timeCommitment}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PhaseCardProps {
  phase: LearningPhase
  phaseIndex: number
  isActive: boolean
  isCompleted: boolean
  onClick?: () => void
}

function PhaseCard({ phase, phaseIndex, isActive, isCompleted, onClick }: PhaseCardProps) {
  return (
    <Card
      className={`p-6 transition-all cursor-pointer ${
        isActive
          ? "ring-2 ring-primary message-gradient"
          : isCompleted
            ? "bg-secondary/50 border-border/50"
            : "message-gradient border-border/50 hover:border-border"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Phase Status Icon */}
        <div className="flex-shrink-0 mt-1">
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : isActive ? (
            <Play className="w-6 h-6 text-primary" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-4">
          {/* Phase Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{phase.title}</h3>
              <Badge variant="outline" className="text-xs">
                {phase.duration}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{phase.goal}</p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{phase.timeCommitment}</span>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Resources
            </h4>
            <div className="grid gap-2">
              {phase.resources.map((resource, resourceIndex) => (
                <ResourceItem key={resourceIndex} resource={resource} />
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h4 className="font-medium mb-3">Milestones</h4>
            <div className="space-y-2">
              {phase.milestones.map((milestone, milestoneIndex) => (
                <div key={milestoneIndex} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    disabled={!isActive && !isCompleted}
                    defaultChecked={isCompleted}
                  />
                  <span className={`text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {milestone}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          {isActive && (
            <Button className="w-full" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

interface ResourceItemProps {
  resource: Resource
}

function ResourceItem({ resource }: ResourceItemProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "course":
        return "🎓"
      case "book":
        return "📚"
      case "video":
        return "🎥"
      case "practice":
        return "💻"
      case "documentation":
        return "📖"
      default:
        return "📄"
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case "course":
        return "bg-blue-500/20 text-blue-400"
      case "book":
        return "bg-green-500/20 text-green-400"
      case "video":
        return "bg-red-500/20 text-red-400"
      case "practice":
        return "bg-purple-500/20 text-purple-400"
      case "documentation":
        return "bg-yellow-500/20 text-yellow-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${getResourceColor(resource.type)}`}
        >
          {getResourceIcon(resource.type)}
        </div>
        <div>
          <h5 className="font-medium text-sm">{resource.title}</h5>
          <p className="text-xs text-muted-foreground">{resource.provider}</p>
          {resource.description && <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>}
        </div>
      </div>
      {resource.url && (
        <Button variant="ghost" size="sm" asChild>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      )}
    </div>
  )
}
