// Natural language processing for user input understanding
export interface ProcessedInput {
  intent: string
  entities: Record<string, string[]>
  confidence: number
  suggestedActions: string[]
  context: string
}

export interface UserQuery {
  message: string
  context?: string
  learningPath?: any
  userProfile?: any
}

export class InputProcessor {
  private intents = {
    adjust_timeline: ["adjust", "change", "modify", "extend", "shorten", "timeline", "time", "schedule"],
    request_resources: ["resource", "course", "book", "tutorial", "material", "learn", "study"],
    ask_progress: ["progress", "status", "where", "how far", "completion", "done"],
    seek_help: ["help", "stuck", "confused", "difficult", "hard", "problem", "issue"],
    request_explanation: ["explain", "what", "how", "why", "understand", "clarify"],
    change_focus: ["focus", "switch", "different", "instead", "rather", "prefer"],
    ask_next_steps: ["next", "what now", "then", "after", "continue", "proceed"],
    request_motivation: ["motivation", "encourage", "inspire", "keep going", "support"],
  }

  private entities = {
    time_periods: ["hour", "day", "week", "month", "weekend", "morning", "evening"],
    technologies: [
      "javascript",
      "python",
      "react",
      "node",
      "html",
      "css",
      "sql",
      "machine learning",
      "ai",
      "data science",
      "mobile",
      "web",
      "backend",
      "frontend",
    ],
    learning_styles: ["video", "reading", "hands-on", "practice", "project", "tutorial", "course"],
    difficulty_levels: ["beginner", "intermediate", "advanced", "expert", "basic", "easy", "hard", "difficult"],
    resource_types: ["course", "book", "tutorial", "video", "documentation", "practice", "project"],
  }

  processInput(query: UserQuery): ProcessedInput {
    const message = query.message.toLowerCase()
    const words = this.tokenize(message)

    // Detect intent
    const intent = this.detectIntent(words)

    // Extract entities
    const entities = this.extractEntities(words)

    // Calculate confidence
    const confidence = this.calculateConfidence(intent, entities, words)

    // Generate suggested actions
    const suggestedActions = this.generateSuggestedActions(intent, entities, query)

    // Determine context
    const context = this.determineContext(intent, entities, query)

    return {
      intent,
      entities,
      confidence,
      suggestedActions,
      context,
    }
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 0)
  }

  private detectIntent(words: string[]): string {
    const intentScores: Record<string, number> = {}

    // Calculate scores for each intent
    for (const [intent, keywords] of Object.entries(this.intents)) {
      intentScores[intent] = 0
      for (const keyword of keywords) {
        const keywordWords = keyword.split(" ")
        if (keywordWords.length === 1) {
          if (words.includes(keyword)) {
            intentScores[intent] += 1
          }
        } else {
          // Multi-word keyword matching
          const keywordText = keywordWords.join(" ")
          if (words.join(" ").includes(keywordText)) {
            intentScores[intent] += 2
          }
        }
      }
    }

    // Find the intent with the highest score
    const bestIntent = Object.entries(intentScores).reduce((a, b) => (a[1] > b[1] ? a : b))

    return bestIntent[1] > 0 ? bestIntent[0] : "general_question"
  }

  private extractEntities(words: string[]): Record<string, string[]> {
    const entities: Record<string, string[]> = {}

    for (const [entityType, entityValues] of Object.entries(this.entities)) {
      entities[entityType] = []
      for (const value of entityValues) {
        const valueWords = value.split(" ")
        if (valueWords.length === 1) {
          if (words.includes(value)) {
            entities[entityType].push(value)
          }
        } else {
          // Multi-word entity matching
          if (words.join(" ").includes(value)) {
            entities[entityType].push(value)
          }
        }
      }
    }

    // Remove empty entity arrays
    Object.keys(entities).forEach((key) => {
      if (entities[key].length === 0) {
        delete entities[key]
      }
    })

    return entities
  }

  private calculateConfidence(intent: string, entities: Record<string, string[]>, words: string[]): number {
    let confidence = 0.5 // Base confidence

    // Increase confidence based on intent match
    if (intent !== "general_question") {
      confidence += 0.3
    }

    // Increase confidence based on entity matches
    const entityCount = Object.values(entities).flat().length
    confidence += Math.min(entityCount * 0.1, 0.2)

    // Decrease confidence for very short or very long messages
    if (words.length < 3) {
      confidence -= 0.2
    } else if (words.length > 50) {
      confidence -= 0.1
    }

    return Math.max(0, Math.min(1, confidence))
  }

  private generateSuggestedActions(intent: string, entities: Record<string, string[]>, query: UserQuery): string[] {
    const actions: string[] = []

    switch (intent) {
      case "adjust_timeline":
        actions.push("Modify learning schedule")
        actions.push("Adjust time commitment")
        if (entities.time_periods?.length > 0) {
          actions.push(`Focus on ${entities.time_periods[0]} learning`)
        }
        break

      case "request_resources":
        actions.push("Recommend learning resources")
        if (entities.resource_types?.length > 0) {
          actions.push(`Find ${entities.resource_types[0]} resources`)
        }
        if (entities.technologies?.length > 0) {
          actions.push(`Resources for ${entities.technologies[0]}`)
        }
        break

      case "ask_progress":
        actions.push("Show learning progress")
        actions.push("Review completed milestones")
        actions.push("Suggest next steps")
        break

      case "seek_help":
        actions.push("Provide learning guidance")
        actions.push("Suggest alternative approaches")
        actions.push("Connect with community resources")
        break

      case "request_explanation":
        actions.push("Explain concepts clearly")
        if (entities.technologies?.length > 0) {
          actions.push(`Explain ${entities.technologies[0]}`)
        }
        actions.push("Provide examples and analogies")
        break

      case "change_focus":
        actions.push("Adjust learning focus")
        if (entities.technologies?.length > 0) {
          actions.push(`Switch to ${entities.technologies[0]}`)
        }
        actions.push("Modify learning path")
        break

      case "ask_next_steps":
        actions.push("Suggest next learning steps")
        actions.push("Recommend practice exercises")
        actions.push("Identify skill gaps")
        break

      case "request_motivation":
        actions.push("Provide encouragement")
        actions.push("Share success stories")
        actions.push("Set achievable goals")
        break

      default:
        actions.push("Provide helpful guidance")
        actions.push("Answer your question")
        break
    }

    return actions.slice(0, 3) // Limit to 3 actions
  }

  private determineContext(intent: string, entities: Record<string, string[]>, query: UserQuery): string {
    const contextParts: string[] = []

    // Add intent context
    contextParts.push(`User intent: ${intent.replace("_", " ")}`)

    // Add entity context
    if (Object.keys(entities).length > 0) {
      const entitySummary = Object.entries(entities)
        .map(([type, values]) => `${type}: ${values.join(", ")}`)
        .join("; ")
      contextParts.push(`Mentioned: ${entitySummary}`)
    }

    // Add learning path context if available
    if (query.learningPath) {
      contextParts.push(`Current learning path: ${query.learningPath.goal || "General"}`)
    }

    // Add user profile context if available
    if (query.userProfile) {
      contextParts.push(`User level: ${query.userProfile.currentLevel || "Unknown"}`)
    }

    return contextParts.join(" | ")
  }

  // Method to generate contextual responses based on processed input
  generateContextualResponse(processedInput: ProcessedInput, query: UserQuery): string {
    const { intent, entities, confidence } = processedInput

    // Low confidence fallback
    if (confidence < 0.4) {
      return this.generateLowConfidenceResponse(query.message)
    }

    switch (intent) {
      case "adjust_timeline":
        return this.generateTimelineAdjustmentResponse(entities, query)

      case "request_resources":
        return this.generateResourceResponse(entities, query)

      case "ask_progress":
        return this.generateProgressResponse(query)

      case "seek_help":
        return this.generateHelpResponse(entities, query)

      case "request_explanation":
        return this.generateExplanationResponse(entities, query)

      case "change_focus":
        return this.generateFocusChangeResponse(entities, query)

      case "ask_next_steps":
        return this.generateNextStepsResponse(query)

      case "request_motivation":
        return this.generateMotivationResponse(query)

      default:
        return this.generateGeneralResponse(query)
    }
  }

  private generateTimelineAdjustmentResponse(entities: Record<string, string[]>, query: UserQuery): string {
    const timePeriods = entities.time_periods || []
    const hasTimeEntity = timePeriods.length > 0

    return `I can help you adjust your learning timeline! ${
      hasTimeEntity ? `I see you mentioned ${timePeriods[0]} - ` : ""
    }Here are some options:

**Time Adjustments**:
- Reduce daily commitment to 1-2 hours
- Extend timeline to accommodate your schedule
- Focus on weekend-only learning
- Create a flexible schedule

**Content Adjustments**:
- Prioritize essential topics first
- Add more hands-on practice time
- Include buffer time for difficult concepts

What specific changes would work best for your schedule?`
  }

  private generateResourceResponse(entities: Record<string, string[]>, query: UserQuery): string {
    const technologies = entities.technologies || []
    const resourceTypes = entities.resource_types || []

    let response = "Here are some excellent learning resources:\n\n"

    if (technologies.length > 0) {
      response += `**${technologies[0].toUpperCase()} Resources**:\n`
      response += this.getSpecificTechResources(technologies[0])
    } else {
      response += "**General Learning Resources**:\n"
    }

    if (resourceTypes.length > 0) {
      response += `\n**${resourceTypes[0].toUpperCase()} Recommendations**:\n`
      response += this.getSpecificResourceType(resourceTypes[0])
    }

    response += "\n\nWould you like specific recommendations for any particular topic or learning style?"

    return response
  }

  private generateProgressResponse(query: UserQuery): string {
    return `Let me help you track your learning progress!

**Current Status**:
- You're making great progress on your learning journey
- Consistency is key to building lasting skills

**Progress Tracking Tips**:
- Keep a daily learning journal
- Set weekly milestone goals
- Celebrate small wins along the way
- Review and reflect on what you've learned

**Next Steps**:
- Focus on completing your current phase
- Practice what you've learned through projects
- Join communities to share your progress

What specific aspect of your progress would you like to discuss?`
  }

  private generateHelpResponse(entities: Record<string, string[]>, query: UserQuery): string {
    const technologies = entities.technologies || []

    return `I'm here to help you overcome any learning challenges! ${
      technologies.length > 0 ? `I see you're working with ${technologies[0]} - ` : ""
    }

**When You're Stuck**:
- Break the problem into smaller parts
- Look for simpler examples first
- Try explaining the concept to someone else
- Take a short break and come back fresh

**Getting Unstuck Strategies**:
- Search for alternative explanations
- Join online communities for support
- Practice with hands-on exercises
- Ask specific questions about what confuses you

**Remember**: Everyone gets stuck sometimes - it's a normal part of learning!

What specific challenge are you facing right now?`
  }

  private generateExplanationResponse(entities: Record<string, string[]>, query: UserQuery): string {
    const technologies = entities.technologies || []

    if (technologies.length > 0) {
      return `I'd be happy to explain ${technologies[0]}!

Let me break this down in simple terms with practical examples. ${technologies[0]} is commonly used for:

- Real-world applications and use cases
- Key concepts you need to understand
- How it fits into your learning journey
- Practical examples you can try

Would you like me to focus on any specific aspect of ${technologies[0]}? I can provide:
- Basic concepts and terminology
- Practical examples and code snippets
- Common use cases and applications
- How it connects to other technologies`
    }

    return `I'd be happy to explain any concept you're curious about!

**My Explanation Approach**:
- Start with simple, clear definitions
- Use real-world analogies and examples
- Break complex topics into digestible parts
- Provide practical applications

**What I Can Explain**:
- Technical concepts and terminology
- How different technologies work together
- Best practices and common patterns
- Career paths and skill development

What specific topic would you like me to explain?`
  }

  private generateFocusChangeResponse(entities: Record<string, string[]>, query: UserQuery): string {
    const technologies = entities.technologies || []

    return `I can help you adjust your learning focus! ${
      technologies.length > 0 ? `I see you're interested in ${technologies[0]} - ` : ""
    }

**Focus Adjustment Options**:
- Shift to different technologies or skills
- Change learning methodology (more hands-on vs. theory)
- Adjust difficulty level or pace
- Modify project types and applications

**Making the Switch**:
- We can modify your current learning path
- Add new topics while maintaining progress
- Balance breadth vs. depth of knowledge
- Ensure smooth transitions between topics

What specific changes would you like to make to your learning focus?`
  }

  private generateNextStepsResponse(query: UserQuery): string {
    return `Great question! Here are your recommended next steps:

**Immediate Actions**:
- Complete any pending exercises from your current phase
- Review and solidify concepts you've learned
- Start planning your next project or milestone

**Skill Development**:
- Identify areas that need more practice
- Look for real-world applications of your knowledge
- Connect with others learning similar skills

**Long-term Planning**:
- Set clear goals for the next 2-4 weeks
- Plan projects that showcase your growing skills
- Consider how your learning aligns with career goals

**Stay Motivated**:
- Track your progress and celebrate achievements
- Join communities and share your journey
- Keep challenging yourself with new problems

What specific area would you like to focus on next?`
  }

  private generateMotivationResponse(query: UserQuery): string {
    return `You're doing amazing work on your learning journey! 🌟

**Remember Why You Started**:
- Every expert was once a beginner
- Progress isn't always linear - that's normal!
- Small, consistent steps lead to big achievements
- You're building skills that will serve you for years

**You've Got This Because**:
- You're actively seeking to improve yourself
- You're asking the right questions
- You're committed to continuous learning
- You're building valuable, in-demand skills

**Keep Moving Forward**:
- Focus on progress, not perfection
- Celebrate small wins along the way
- Connect with other learners for support
- Remember that challenges make you stronger

**Your Future Self Will Thank You** for the effort you're putting in today!

What's one thing you've learned recently that you're proud of?`
  }

  private generateGeneralResponse(query: UserQuery): string {
    return `I'm here to help with your learning journey!

**I Can Assist With**:
- Adjusting your learning path and timeline
- Recommending resources and materials
- Explaining concepts and technologies
- Providing motivation and guidance
- Tracking progress and next steps

**Popular Questions**:
- "How can I adjust my learning schedule?"
- "What resources do you recommend for [technology]?"
- "I'm stuck on [concept] - can you help?"
- "What should I learn next?"
- "How do I stay motivated?"

Feel free to ask me anything about your learning path, and I'll provide personalized guidance based on your goals and progress!

What would you like to know more about?`
  }

  private generateLowConfidenceResponse(message: string): string {
    return `I want to make sure I understand your question correctly.

Could you help me by being a bit more specific? For example:
- Are you asking about adjusting your learning timeline?
- Do you need help with specific concepts or technologies?
- Are you looking for resource recommendations?
- Do you want to discuss your progress or next steps?

I'm here to provide personalized guidance for your learning journey, so the more details you can share, the better I can help!

What specific aspect of your learning would you like to focus on?`
  }

  private getSpecificTechResources(tech: string): string {
    const resources: Record<string, string> = {
      javascript: `- freeCodeCamp JavaScript Course
- MDN Web Docs (comprehensive reference)
- JavaScript30 by Wes Bos (hands-on projects)
- "You Don't Know JS" book series`,

      python: `- Python.org official tutorial
- "Automate the Boring Stuff with Python"
- Codecademy Python Course
- Real Python tutorials and articles`,

      react: `- React official documentation
- "React - The Complete Guide" (Udemy)
- React DevTools for debugging
- Create React App for quick setup`,

      "machine learning": `- Coursera Machine Learning Course (Andrew Ng)
- Kaggle Learn micro-courses
- "Hands-On Machine Learning" book
- Google's Machine Learning Crash Course`,
    }

    return (
      resources[tech] ||
      "- Official documentation and tutorials\n- Online courses and bootcamps\n- Practice projects and challenges\n- Community forums and discussions"
    )
  }

  private getSpecificResourceType(type: string): string {
    const types: Record<string, string> = {
      course: `- Structured learning with clear progression
- Interactive exercises and quizzes
- Community support and discussions
- Certificates upon completion`,

      book: `- In-depth coverage of topics
- Reference material for future use
- Self-paced learning
- Often includes practical exercises`,

      video: `- Visual and auditory learning
- Step-by-step demonstrations
- Pause and replay as needed
- Often includes downloadable resources`,

      practice: `- Hands-on skill development
- Real-world problem solving
- Portfolio building opportunities
- Immediate feedback and results`,
    }

    return (
      types[type] ||
      "- Variety of formats to match your learning style\n- Progressive difficulty levels\n- Practical applications\n- Community and support resources"
    )
  }
}

export const inputProcessor = new InputProcessor()
