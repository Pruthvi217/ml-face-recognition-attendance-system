// Advanced response generation with context awareness
import { inputProcessor, type ProcessedInput, type UserQuery } from "./input-processor"

export interface ResponseContext {
  userProfile?: {
    goal: string
    currentLevel: string
    timeAvailable: string
    learningStyle: string
    specificTopics?: string
  }
  learningPath?: {
    phases: any[]
    currentPhase: number
    completedMilestones: string[]
  }
  conversationHistory?: Array<{
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }>
}

export class ResponseGenerator {
  generateResponse(message: string, context: ResponseContext): string {
    // Process the user input
    const query: UserQuery = {
      message,
      context: this.buildContextString(context),
      learningPath: context.learningPath,
      userProfile: context.userProfile,
    }

    const processedInput = inputProcessor.processInput(query)

    // Generate contextual response
    let response = inputProcessor.generateContextualResponse(processedInput, query)

    // Enhance response with personalization
    response = this.personalizeResponse(response, context, processedInput)

    // Add follow-up suggestions
    response = this.addFollowUpSuggestions(response, processedInput, context)

    return response
  }

  private buildContextString(context: ResponseContext): string {
    const contextParts: string[] = []

    if (context.userProfile) {
      contextParts.push(`Goal: ${context.userProfile.goal}`)
      contextParts.push(`Level: ${context.userProfile.currentLevel}`)
      contextParts.push(`Time: ${context.userProfile.timeAvailable}`)
      contextParts.push(`Style: ${context.userProfile.learningStyle}`)
    }

    if (context.learningPath) {
      contextParts.push(`Phase: ${context.learningPath.currentPhase + 1}/${context.learningPath.phases.length}`)
      contextParts.push(`Completed: ${context.learningPath.completedMilestones.length} milestones`)
    }

    return contextParts.join(" | ")
  }

  private personalizeResponse(response: string, context: ResponseContext, processedInput: ProcessedInput): string {
    let personalizedResponse = response

    // Add user's name or goal reference
    if (context.userProfile?.goal) {
      personalizedResponse = personalizedResponse.replace(
        /your learning journey/g,
        `your ${context.userProfile.goal} journey`,
      )
    }

    // Adjust language based on user level
    if (context.userProfile?.currentLevel === "beginner") {
      personalizedResponse = this.simplifyLanguage(personalizedResponse)
    } else if (context.userProfile?.currentLevel === "advanced") {
      personalizedResponse = this.addTechnicalDepth(personalizedResponse)
    }

    // Adjust recommendations based on learning style
    if (context.userProfile?.learningStyle === "hands-on") {
      personalizedResponse = this.emphasizeProjects(personalizedResponse)
    } else if (context.userProfile?.learningStyle === "video") {
      personalizedResponse = this.emphasizeVideoResources(personalizedResponse)
    }

    // Add time-specific advice
    if (context.userProfile?.timeAvailable === "weekends-only") {
      personalizedResponse = this.addWeekendSpecificAdvice(personalizedResponse)
    } else if (context.userProfile?.timeAvailable === "1-2-hours-day") {
      personalizedResponse = this.addShortSessionAdvice(personalizedResponse)
    }

    return personalizedResponse
  }

  private addFollowUpSuggestions(response: string, processedInput: ProcessedInput, context: ResponseContext): string {
    const suggestions: string[] = []

    // Add relevant follow-up questions based on intent
    switch (processedInput.intent) {
      case "adjust_timeline":
        suggestions.push("Would you like me to create a revised schedule?")
        suggestions.push("Should we adjust the difficulty level as well?")
        break

      case "request_resources":
        suggestions.push("Would you like me to prioritize these resources?")
        suggestions.push("Should I find resources for your specific learning style?")
        break

      case "ask_progress":
        suggestions.push("Would you like to set new milestones?")
        suggestions.push("Should we celebrate your recent achievements?")
        break

      case "seek_help":
        suggestions.push("Would you like me to break this down further?")
        suggestions.push("Should we try a different learning approach?")
        break
    }

    // Add context-specific suggestions
    if (context.learningPath && context.learningPath.currentPhase < context.learningPath.phases.length - 1) {
      suggestions.push("Ready to move to the next phase?")
    }

    if (context.userProfile?.currentLevel === "beginner") {
      suggestions.push("Would you like some beginner-friendly tips?")
    }

    // Add suggestions to response
    if (suggestions.length > 0) {
      const selectedSuggestions = suggestions.slice(0, 2) // Limit to 2 suggestions
      response += `\n\n**Quick Questions**:\n${selectedSuggestions.map((s) => `- ${s}`).join("\n")}`
    }

    return response
  }

  private simplifyLanguage(response: string): string {
    return response
      .replace(/implementation/g, "setup")
      .replace(/methodology/g, "approach")
      .replace(/comprehensive/g, "complete")
      .replace(/sophisticated/g, "advanced")
  }

  private addTechnicalDepth(response: string): string {
    // Add more technical terminology and advanced concepts
    return response.replace(/basic/g, "fundamental").replace(/simple/g, "streamlined")
  }

  private emphasizeProjects(response: string): string {
    return response.replace(/exercises/g, "hands-on projects").replace(/practice/g, "build real projects")
  }

  private emphasizeVideoResources(response: string): string {
    return response.replace(/reading/g, "video tutorials").replace(/documentation/g, "video guides")
  }

  private addWeekendSpecificAdvice(response: string): string {
    return (
      response +
      "\n\n**Weekend Learning Tip**: Focus on longer, project-based sessions that you can complete over the weekend!"
    )
  }

  private addShortSessionAdvice(response: string): string {
    return response + "\n\n**Short Session Tip**: Break topics into 30-45 minute focused chunks for maximum retention!"
  }

  // Method to generate dynamic learning path adjustments
  generatePathAdjustment(
    currentPath: any,
    userFeedback: string,
    context: ResponseContext,
  ): { adjustedPath: any; explanation: string } {
    const query: UserQuery = {
      message: userFeedback,
      context: this.buildContextString(context),
      learningPath: currentPath,
      userProfile: context.userProfile,
    }

    const processedInput = inputProcessor.processInput(query)

    // Generate adjusted path based on feedback
    const adjustedPath = this.adjustLearningPath(currentPath, processedInput, context)
    const explanation = this.generateAdjustmentExplanation(processedInput, context)

    return { adjustedPath, explanation }
  }

  private adjustLearningPath(currentPath: any, processedInput: ProcessedInput, context: ResponseContext): any {
    const adjustedPath = { ...currentPath }

    // Adjust based on detected intent and entities
    switch (processedInput.intent) {
      case "adjust_timeline":
        if (processedInput.entities.time_periods?.includes("weekend")) {
          adjustedPath.schedule = "weekend-focused"
          adjustedPath.phases = adjustedPath.phases.map((phase: any) => ({
            ...phase,
            duration: Math.ceil(phase.duration * 1.5) + " weeks", // Extend duration
          }))
        }
        break

      case "change_focus":
        if (processedInput.entities.technologies?.length > 0) {
          const newTech = processedInput.entities.technologies[0]
          adjustedPath.phases = adjustedPath.phases.map((phase: any) => ({
            ...phase,
            topics: phase.topics.map((topic: string) =>
              topic.toLowerCase().includes(newTech) ? `${newTech} ${topic}` : topic,
            ),
          }))
        }
        break

      case "request_resources":
        if (processedInput.entities.learning_styles?.length > 0) {
          const preferredStyle = processedInput.entities.learning_styles[0]
          adjustedPath.phases = adjustedPath.phases.map((phase: any) => ({
            ...phase,
            resources: phase.resources.filter((resource: any) => resource.type.toLowerCase().includes(preferredStyle)),
          }))
        }
        break
    }

    return adjustedPath
  }

  private generateAdjustmentExplanation(processedInput: ProcessedInput, context: ResponseContext): string {
    let explanation = "I've adjusted your learning path based on your feedback:\n\n"

    switch (processedInput.intent) {
      case "adjust_timeline":
        explanation += "**Timeline Changes**:\n"
        explanation += "- Extended phase durations to accommodate your schedule\n"
        explanation += "- Adjusted daily time commitments\n"
        explanation += "- Added buffer time for challenging topics\n"
        break

      case "change_focus":
        explanation += "**Focus Adjustments**:\n"
        explanation += "- Shifted emphasis to your preferred technologies\n"
        explanation += "- Reordered topics based on your interests\n"
        explanation += "- Updated project suggestions\n"
        break

      case "request_resources":
        explanation += "**Resource Updates**:\n"
        explanation += "- Filtered resources to match your learning style\n"
        explanation += "- Added more hands-on practice opportunities\n"
        explanation += "- Included community and support resources\n"
        break

      default:
        explanation += "**General Improvements**:\n"
        explanation += "- Refined content based on your feedback\n"
        explanation += "- Optimized for your learning preferences\n"
        explanation += "- Enhanced with additional support resources\n"
    }

    explanation += "\nThese changes should better align with your goals and preferences!"

    return explanation
  }
}

export const responseGenerator = new ResponseGenerator()
