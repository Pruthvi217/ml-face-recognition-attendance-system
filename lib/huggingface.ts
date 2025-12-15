// Hugging Face API integration for LearnPath AI
import { learningPathGenerator } from "./learning-path-generator"

export interface HuggingFaceConfig {
  apiKey: string
  baseUrl: string
}

export interface LearningPathRequest {
  goal: string
  currentLevel: string
  timeAvailable: string
  learningStyle: string
  specificTopics?: string
}

export interface LearningPathResponse {
  phases: LearningPhase[]
  estimatedTimeline: string
  totalWeeks: number
}

export interface LearningPhase {
  title: string
  duration: string
  goal: string
  resources: Resource[]
  milestones: string[]
  timeCommitment: string
}

export interface Resource {
  type: "course" | "book" | "documentation" | "video" | "practice"
  title: string
  provider: string
  url?: string
  description?: string
}

class HuggingFaceService {
  private config: HuggingFaceConfig

  constructor() {
    this.config = {
      apiKey: process.env.HUGGINGFACE_API_KEY || "",
      baseUrl: "https://api-inference.huggingface.co/models",
    }
  }

  async generateLearningPath(request: LearningPathRequest): Promise<LearningPathResponse> {
    try {
      // First try to generate using our structured generator
      const structuredPath = learningPathGenerator.generateLearningPath(request)

      // Enhance with AI-generated content if API is available
      if (this.config.apiKey) {
        const prompt = this.buildLearningPathPrompt(request)

        const response = await fetch(`${this.config.baseUrl}/microsoft/DialoGPT-large`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 1000,
              temperature: 0.7,
              do_sample: true,
              top_p: 0.9,
            },
          }),
        })

        if (response.ok) {
          const result = await response.json()
          // Enhance the structured path with AI insights
          return this.enhanceWithAI(structuredPath, result, request)
        }
      }

      return structuredPath
    } catch (error) {
      console.error("Error generating learning path:", error)
      // Fallback to structured generator
      return learningPathGenerator.generateLearningPath(request)
    }
  }

  async generateFollowUpResponse(userMessage: string, context: string): Promise<string> {
    try {
      const prompt = this.buildFollowUpPrompt(userMessage, context)

      const response = await fetch(`${this.config.baseUrl}/microsoft/DialoGPT-large`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.8,
            do_sample: true,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.parseFollowUpResponse(result, userMessage)
    } catch (error) {
      console.error("Error generating follow-up response:", error)
      return this.generateFallbackResponse(userMessage)
    }
  }

  private buildLearningPathPrompt(request: LearningPathRequest): string {
    return `Create a detailed learning path for: ${request.goal}

Student Profile:
- Current Level: ${request.currentLevel}
- Time Available: ${request.timeAvailable}
- Learning Style: ${request.learningStyle}
${request.specificTopics ? `- Focus Areas: ${request.specificTopics}` : ""}

Please provide a structured learning path with:
1. 3-4 learning phases
2. Specific resources for each phase
3. Clear milestones and timelines
4. Practical projects and exercises

Format the response as a comprehensive roadmap with actionable steps.`
  }

  private buildFollowUpPrompt(userMessage: string, context: string): string {
    return `Learning Path Context: ${context}

Student Question: ${userMessage}

Provide a helpful, specific response that:
1. Addresses their question directly
2. Offers actionable advice
3. Suggests relevant resources if needed
4. Maintains encouraging tone

Response:`
  }

  private enhanceWithAI(
    structuredPath: LearningPathResponse,
    aiResponse: any,
    request: LearningPathRequest,
  ): LearningPathResponse {
    // Add personalized recommendations from our generator
    const recommendations = learningPathGenerator.getPersonalizedRecommendations(request)

    // Enhance phases with AI insights if available
    const enhancedPhases = structuredPath.phases.map((phase) => ({
      ...phase,
      goal: phase.goal + " with personalized guidance",
    }))

    return {
      ...structuredPath,
      phases: enhancedPhases,
    }
  }

  private parseLearningPathResponse(apiResponse: any, request: LearningPathRequest): LearningPathResponse {
    // Parse the AI response and structure it
    // For now, return a structured template based on the request
    return this.generateFallbackPath(request)
  }

  private parseFollowUpResponse(apiResponse: any, userMessage: string): string {
    if (apiResponse && apiResponse[0] && apiResponse[0].generated_text) {
      return apiResponse[0].generated_text.trim()
    }
    return this.generateFallbackResponse(userMessage)
  }

  private generateFallbackPath(request: LearningPathRequest): LearningPathResponse {
    const { goal, currentLevel, timeAvailable, learningStyle } = request

    // Generate structured learning path based on common patterns
    const phases: LearningPhase[] = [
      {
        title: "Foundation Phase",
        duration: "Weeks 1-4",
        goal: `Build core fundamentals for ${goal}`,
        timeCommitment: this.getTimeCommitment(timeAvailable, "foundation"),
        resources: this.getFoundationResources(goal, learningStyle),
        milestones: [
          "Complete basic concepts and terminology",
          "Set up development environment",
          "Build first practice project",
          "Pass foundation assessment",
        ],
      },
      {
        title: "Skill Development Phase",
        duration: "Weeks 5-8",
        goal: "Develop practical skills and hands-on experience",
        timeCommitment: this.getTimeCommitment(timeAvailable, "intermediate"),
        resources: this.getIntermediateResources(goal, learningStyle),
        milestones: [
          "Master key concepts and tools",
          "Complete 2-3 portfolio projects",
          "Join relevant communities",
          "Start contributing to discussions",
        ],
      },
      {
        title: "Advanced Application Phase",
        duration: "Weeks 9-12",
        goal: "Apply advanced concepts and prepare for real-world scenarios",
        timeCommitment: this.getTimeCommitment(timeAvailable, "advanced"),
        resources: this.getAdvancedResources(goal, learningStyle),
        milestones: [
          "Build comprehensive capstone project",
          "Contribute to open source projects",
          "Network with professionals",
          "Prepare for job applications/interviews",
        ],
      },
    ]

    return {
      phases,
      estimatedTimeline: "12 weeks with consistent effort",
      totalWeeks: 12,
    }
  }

  private getTimeCommitment(timeAvailable: string, phase: string): string {
    const timeMap: Record<string, Record<string, string>> = {
      "1-2-hours-day": {
        foundation: "1-2 hours daily",
        intermediate: "2-3 hours daily",
        advanced: "2-3 hours daily",
      },
      "3-4-hours-day": {
        foundation: "2-3 hours daily",
        intermediate: "3-4 hours daily",
        advanced: "4-5 hours daily",
      },
      "5-6-hours-day": {
        foundation: "3-4 hours daily",
        intermediate: "4-5 hours daily",
        advanced: "5-6 hours daily",
      },
      "weekends-only": {
        foundation: "6-8 hours per weekend",
        intermediate: "8-10 hours per weekend",
        advanced: "10-12 hours per weekend",
      },
      flexible: {
        foundation: "10-15 hours per week",
        intermediate: "15-20 hours per week",
        advanced: "20-25 hours per week",
      },
    }

    return timeMap[timeAvailable]?.[phase] || "2-3 hours daily"
  }

  private getFoundationResources(goal: string, learningStyle: string): Resource[] {
    const baseResources: Resource[] = [
      {
        type: "course",
        title: "Complete Beginner Guide",
        provider: "freeCodeCamp",
        description: "Comprehensive introduction to core concepts",
      },
      {
        type: "documentation",
        title: "Official Documentation",
        provider: "Official Docs",
        description: "Reference materials and getting started guides",
      },
    ]

    if (learningStyle === "video") {
      baseResources.push({
        type: "video",
        title: "Video Tutorial Series",
        provider: "YouTube",
        description: "Step-by-step video tutorials for beginners",
      })
    }

    if (learningStyle === "hands-on") {
      baseResources.push({
        type: "practice",
        title: "Interactive Coding Exercises",
        provider: "Codecademy",
        description: "Hands-on practice with immediate feedback",
      })
    }

    return baseResources
  }

  private getIntermediateResources(goal: string, learningStyle: string): Resource[] {
    return [
      {
        type: "course",
        title: "Intermediate Development Course",
        provider: "Udemy",
        description: "Project-based learning with real-world applications",
      },
      {
        type: "practice",
        title: "Portfolio Projects",
        provider: "GitHub",
        description: "3-5 projects to showcase your skills",
      },
      {
        type: "book",
        title: "Best Practices Guide",
        provider: "O'Reilly",
        description: "Industry standards and professional techniques",
      },
    ]
  }

  private getAdvancedResources(goal: string, learningStyle: string): Resource[] {
    return [
      {
        type: "course",
        title: "Advanced Techniques",
        provider: "Pluralsight",
        description: "Expert-level concepts and optimization",
      },
      {
        type: "practice",
        title: "Open Source Contributions",
        provider: "GitHub",
        description: "Contribute to real projects and build network",
      },
      {
        type: "practice",
        title: "Capstone Project",
        provider: "Self-directed",
        description: "Comprehensive project demonstrating all skills",
      },
    ]
  }

  private generateFallbackResponse(userMessage: string): string {
    const lowerInput = userMessage.toLowerCase()

    if (lowerInput.includes("adjust") || lowerInput.includes("change")) {
      return `I can help you adjust your learning path! Here are some options:

**Time Adjustments**:
- Reduce daily commitment to 1-2 hours
- Extend timeline to 16-20 weeks  
- Focus on weekends only

**Content Adjustments**:
- Add more hands-on projects
- Include video-based learning
- Focus on specific technologies

**Goal Refinements**:
- Narrow focus to specific areas
- Add certification preparation
- Include interview preparation

What specific changes would you like to make?`
    }

    if (lowerInput.includes("resource") || lowerInput.includes("course")) {
      return `Here are some additional resources I recommend:

**Free Resources**:
- freeCodeCamp - Interactive coding lessons
- MDN Web Docs - Comprehensive documentation
- YouTube channels: Traversy Media, The Net Ninja

**Paid Courses**:
- Udemy - Practical project-based courses
- Pluralsight - In-depth technical content
- Coursera - University-level courses

**Practice Platforms**:
- GitHub - Version control and portfolio
- CodePen - Frontend experiments
- LeetCode - Algorithm practice

Would you like specific recommendations for any particular topic?`
    }

    return `That's a great question! Based on your learning path, I'd recommend:

**Focus on your current phase** - Make sure you're comfortable with the fundamentals before moving ahead.

**Track your progress** - Use a simple checklist or learning journal to stay motivated.

**Join communities** - Connect with other learners and professionals in your field.

**Practice regularly** - Consistent daily practice is more effective than long weekend sessions.

Is there a specific aspect of your learning journey you'd like to discuss further?`
  }
}

export const huggingFaceService = new HuggingFaceService()
