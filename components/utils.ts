import type React from "react"
// Utility functions for chat interface and learning path management
import { responseGenerator, type ResponseContext } from "@/lib/response-generator"

export interface LearningPath {
  goal: string
  phases: Array<{
    title: string
    duration: string
    topics: string[]
    resources: Array<{
      title: string
      type: string
      url: string
      description: string
    }>
    milestones: string[]
  }>
  totalDuration: string
  difficulty: string
}

export function formatLearningPath(learningPath: LearningPath, userData: any): string {
  if (!learningPath || !learningPath.phases) {
    return generateLearningPathContent(userData)
  }

  let content = `# 🎯 Your Personalized Learning Path: ${learningPath.goal}\n\n`
  content += `**Total Duration**: ${learningPath.totalDuration} | **Difficulty**: ${learningPath.difficulty}\n\n`
  content += `Great choice! I've created a comprehensive learning path tailored to your goals. Here's your roadmap:\n\n`

  learningPath.phases.forEach((phase, index) => {
    content += `## Phase ${index + 1}: ${phase.title}\n`
    content += `**Duration**: ${phase.duration}\n\n`

    content += `**Key Topics**:\n`
    phase.topics.forEach((topic) => {
      content += `- ${topic}\n`
    })

    content += `\n**Milestones**:\n`
    phase.milestones.forEach((milestone) => {
      content += `- [ ] ${milestone}\n`
    })

    content += `\n**Recommended Resources**:\n`
    phase.resources.slice(0, 3).forEach((resource) => {
      content += `- **${resource.title}** (${resource.type}): ${resource.description}\n`
    })

    content += `\n---\n\n`
  })

  content += `## 💡 Next Steps\n\n`
  content += `1. **Start with Phase 1** - Begin with the fundamentals\n`
  content += `2. **Set a Schedule** - Dedicate consistent time each day\n`
  content += `3. **Track Progress** - Check off milestones as you complete them\n`
  content += `4. **Ask Questions** - I'm here to help whenever you need guidance!\n\n`
  content += `**Ready to begin?** Ask me anything about your learning path, or say "start Phase 1" to get specific guidance!`

  return content
}

export function generateLearningPathContent(userData: any): string {
  const { goal, currentLevel, timeAvailable, learningStyle, specificTopics } = userData

  let content = `# 🎯 Your Personalized Learning Path: ${goal}\n\n`
  content += `I've analyzed your preferences and created a tailored learning journey for you!\n\n`

  content += `## 📊 Your Profile\n`
  content += `- **Goal**: ${goal}\n`
  content += `- **Current Level**: ${currentLevel}\n`
  content += `- **Time Available**: ${timeAvailable}\n`
  content += `- **Learning Style**: ${learningStyle}\n`
  if (specificTopics) {
    content += `- **Focus Areas**: ${specificTopics}\n`
  }
  content += `\n`

  // Generate content based on goal
  if (goal.toLowerCase().includes("full-stack") || goal.toLowerCase().includes("web development")) {
    content += generateFullStackPath(currentLevel, timeAvailable, learningStyle)
  } else if (goal.toLowerCase().includes("data science") || goal.toLowerCase().includes("machine learning")) {
    content += generateDataSciencePath(currentLevel, timeAvailable, learningStyle)
  } else if (goal.toLowerCase().includes("mobile")) {
    content += generateMobilePath(currentLevel, timeAvailable, learningStyle)
  } else {
    content += generateGeneralPath(goal, currentLevel, timeAvailable, learningStyle)
  }

  content += `\n## 💬 How I Can Help\n\n`
  content += `Feel free to ask me:\n`
  content += `- "Can you adjust my timeline?"\n`
  content += `- "I need more resources for [topic]"\n`
  content += `- "I'm stuck on [concept]"\n`
  content += `- "What should I focus on next?"\n`
  content += `- "Can we change the learning approach?"\n\n`
  content += `I'm here to adapt your path as you progress! 🚀`

  return content
}

function generateFullStackPath(level: string, time: string, style: string): string {
  return (
    `## 🗺️ Full-Stack Development Roadmap\n\n` +
    `### Phase 1: Frontend Foundations (4-6 weeks)\n` +
    `- HTML5 & CSS3 fundamentals\n` +
    `- JavaScript ES6+ features\n` +
    `- Responsive design principles\n` +
    `- Version control with Git\n\n` +
    `### Phase 2: Frontend Framework (6-8 weeks)\n` +
    `- React.js fundamentals\n` +
    `- Component architecture\n` +
    `- State management\n` +
    `- API integration\n\n` +
    `### Phase 3: Backend Development (6-8 weeks)\n` +
    `- Node.js and Express.js\n` +
    `- Database design (SQL/NoSQL)\n` +
    `- RESTful API development\n` +
    `- Authentication & security\n\n` +
    `### Phase 4: Full-Stack Integration (4-6 weeks)\n` +
    `- Connecting frontend and backend\n` +
    `- Deployment strategies\n` +
    `- Testing and debugging\n` +
    `- Portfolio project development\n`
  )
}

function generateDataSciencePath(level: string, time: string, style: string): string {
  return (
    `## 📊 Data Science Learning Path\n\n` +
    `### Phase 1: Python & Statistics (4-6 weeks)\n` +
    `- Python programming fundamentals\n` +
    `- NumPy and Pandas libraries\n` +
    `- Statistical analysis basics\n` +
    `- Data visualization with Matplotlib\n\n` +
    `### Phase 2: Data Analysis (6-8 weeks)\n` +
    `- Exploratory data analysis\n` +
    `- Data cleaning and preprocessing\n` +
    `- Advanced visualization (Seaborn, Plotly)\n` +
    `- SQL for data analysis\n\n` +
    `### Phase 3: Machine Learning (8-10 weeks)\n` +
    `- Supervised learning algorithms\n` +
    `- Unsupervised learning techniques\n` +
    `- Model evaluation and validation\n` +
    `- Scikit-learn library mastery\n\n` +
    `### Phase 4: Advanced Topics (6-8 weeks)\n` +
    `- Deep learning with TensorFlow/PyTorch\n` +
    `- Natural language processing\n` +
    `- Time series analysis\n` +
    `- MLOps and deployment\n`
  )
}

function generateMobilePath(level: string, time: string, style: string): string {
  return (
    `## 📱 Mobile Development Journey\n\n` +
    `### Phase 1: Mobile Fundamentals (4-6 weeks)\n` +
    `- Mobile app design principles\n` +
    `- Platform differences (iOS vs Android)\n` +
    `- Development environment setup\n` +
    `- Basic UI/UX concepts\n\n` +
    `### Phase 2: Cross-Platform Development (8-10 weeks)\n` +
    `- React Native or Flutter basics\n` +
    `- Component architecture\n` +
    `- Navigation and routing\n` +
    `- State management\n\n` +
    `### Phase 3: Advanced Features (6-8 weeks)\n` +
    `- API integration and networking\n` +
    `- Local storage and databases\n` +
    `- Push notifications\n` +
    `- Device features (camera, GPS)\n\n` +
    `### Phase 4: Publishing & Optimization (4-6 weeks)\n` +
    `- App store guidelines\n` +
    `- Performance optimization\n` +
    `- Testing strategies\n` +
    `- App deployment and distribution\n`
  )
}

function generateGeneralPath(goal: string, level: string, time: string, style: string): string {
  return (
    `## 🎯 Customized Learning Path: ${goal}\n\n` +
    `### Phase 1: Foundation Building (4-6 weeks)\n` +
    `- Core concepts and terminology\n` +
    `- Essential tools and setup\n` +
    `- Basic practical exercises\n` +
    `- Community and resource discovery\n\n` +
    `### Phase 2: Skill Development (6-8 weeks)\n` +
    `- Intermediate concepts and techniques\n` +
    `- Hands-on projects and practice\n` +
    `- Problem-solving strategies\n` +
    `- Best practices and patterns\n\n` +
    `### Phase 3: Advanced Application (6-8 weeks)\n` +
    `- Complex project development\n` +
    `- Integration with other technologies\n` +
    `- Performance and optimization\n` +
    `- Real-world case studies\n\n` +
    `### Phase 4: Mastery & Specialization (4-6 weeks)\n` +
    `- Advanced topics and specializations\n` +
    `- Portfolio development\n` +
    `- Community contribution\n` +
    `- Career preparation and networking\n`
  )
}

export async function handleSendMessage(
  e: React.FormEvent,
  input: string,
  setInput: (value: string) => void,
  messages: any[],
  setMessages: (messages: any[]) => void,
  setIsLoading: (loading: boolean) => void,
  initialData: any,
  learningPath: any,
  setLearningPath: (path: any) => void,
) {
  e.preventDefault()
  if (!input.trim()) return

  const userMessage = {
    id: Date.now().toString(),
    role: "user" as const,
    content: input.trim(),
    timestamp: new Date(),
  }

  setMessages([...messages, userMessage])
  setInput("")
  setIsLoading(true)

  try {
    // Create response context
    const context: ResponseContext = {
      userProfile: {
        goal: initialData.goal,
        currentLevel: initialData.currentLevel,
        timeAvailable: initialData.timeAvailable,
        learningStyle: initialData.learningStyle,
        specificTopics: initialData.specificTopics,
      },
      learningPath: learningPath
        ? {
            phases: learningPath.phases,
            currentPhase: 0,
            completedMilestones: [],
          }
        : undefined,
      conversationHistory: messages.slice(-5), // Last 5 messages for context
    }

    // Check if this is a path adjustment request
    const isPathAdjustment =
      input.toLowerCase().includes("adjust") ||
      input.toLowerCase().includes("change") ||
      input.toLowerCase().includes("modify")

    let response: string
    let updatedPath = learningPath

    if (isPathAdjustment && learningPath) {
      // Generate path adjustment
      const adjustment = responseGenerator.generatePathAdjustment(learningPath, input, context)
      response = adjustment.explanation
      updatedPath = adjustment.adjustedPath
      setLearningPath(updatedPath)
    } else {
      // Try API call first, then fallback to local processing
      try {
        const apiResponse = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
            context,
            learningPath,
          }),
        })

        if (apiResponse.ok) {
          const data = await apiResponse.json()
          response = data.response
          if (data.updatedPath) {
            setLearningPath(data.updatedPath)
          }
        } else {
          throw new Error("API call failed")
        }
      } catch (error) {
        console.log("API call failed, using local processing")
        response = responseGenerator.generateResponse(input, context)
      }
    }

    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant" as const,
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
  } catch (error) {
    console.error("Error processing message:", error)
    const errorMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant" as const,
      content:
        "I apologize, but I encountered an error processing your message. Please try again or rephrase your question.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, errorMessage])
  } finally {
    setIsLoading(false)
  }
}
