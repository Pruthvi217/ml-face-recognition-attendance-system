import type { LearningPathRequest, LearningPathResponse, LearningPhase, Resource } from "./huggingface"

interface CareerPath {
  title: string
  skills: string[]
  phases: PhaseTemplate[]
  estimatedWeeks: number
}

interface PhaseTemplate {
  title: string
  duration: string
  skills: string[]
  projects: string[]
}

interface ResourceDatabase {
  [key: string]: {
    free: Resource[]
    paid: Resource[]
    practice: Resource[]
  }
}

export class LearningPathGenerator {
  private careerPaths: Record<string, CareerPath> = {
    "full-stack developer": {
      title: "Full-Stack Developer",
      skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "Databases", "APIs", "Deployment"],
      estimatedWeeks: 16,
      phases: [
        {
          title: "Frontend Fundamentals",
          duration: "Weeks 1-5",
          skills: ["HTML", "CSS", "JavaScript", "DOM Manipulation"],
          projects: ["Personal Portfolio", "Interactive Calculator", "Todo App"],
        },
        {
          title: "Frontend Framework",
          duration: "Weeks 6-10",
          skills: ["React", "State Management", "Component Architecture", "Routing"],
          projects: ["Weather App", "E-commerce Frontend", "Social Media Dashboard"],
        },
        {
          title: "Backend Development",
          duration: "Weeks 11-14",
          skills: ["Node.js", "Express", "Databases", "Authentication", "APIs"],
          projects: ["REST API", "User Authentication System", "Blog Backend"],
        },
        {
          title: "Full-Stack Integration",
          duration: "Weeks 15-16",
          skills: ["Integration", "Deployment", "Testing", "Performance"],
          projects: ["Full-Stack Application", "Deployed Portfolio"],
        },
      ],
    },
    "data scientist": {
      title: "Data Scientist",
      skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL"],
      estimatedWeeks: 20,
      phases: [
        {
          title: "Python & Statistics Foundation",
          duration: "Weeks 1-6",
          skills: ["Python", "NumPy", "Pandas", "Statistics", "Probability"],
          projects: ["Data Analysis Project", "Statistical Analysis", "Python Scripts"],
        },
        {
          title: "Data Analysis & Visualization",
          duration: "Weeks 7-12",
          skills: ["Matplotlib", "Seaborn", "Plotly", "SQL", "Data Cleaning"],
          projects: ["Business Intelligence Dashboard", "Data Cleaning Pipeline"],
        },
        {
          title: "Machine Learning",
          duration: "Weeks 13-18",
          skills: ["Scikit-learn", "TensorFlow", "Model Evaluation", "Feature Engineering"],
          projects: ["Prediction Model", "Classification System", "Recommendation Engine"],
        },
        {
          title: "Advanced ML & Deployment",
          duration: "Weeks 19-20",
          skills: ["Deep Learning", "Model Deployment", "MLOps", "Cloud Platforms"],
          projects: ["End-to-End ML Pipeline", "Deployed ML Application"],
        },
      ],
    },
    "mobile developer": {
      title: "Mobile Developer",
      skills: ["React Native", "JavaScript", "Mobile UI/UX", "APIs", "App Store"],
      estimatedWeeks: 14,
      phases: [
        {
          title: "Mobile Development Basics",
          duration: "Weeks 1-4",
          skills: ["JavaScript", "React", "Mobile Concepts", "Development Environment"],
          projects: ["Simple Mobile App", "Navigation App", "State Management Demo"],
        },
        {
          title: "React Native Mastery",
          duration: "Weeks 5-9",
          skills: ["React Native", "Native Components", "Styling", "Animations"],
          projects: ["Weather App", "Social Media App", "E-commerce App"],
        },
        {
          title: "Advanced Features",
          duration: "Weeks 10-12",
          skills: ["Push Notifications", "Camera", "Location", "Offline Storage"],
          projects: ["Feature-Rich App", "Location-Based App"],
        },
        {
          title: "Publishing & Optimization",
          duration: "Weeks 13-14",
          skills: ["App Store Optimization", "Performance", "Testing", "Analytics"],
          projects: ["Published App", "Performance Optimized App"],
        },
      ],
    },
  }

  private resourceDatabase: ResourceDatabase = {
    "HTML/CSS": {
      free: [
        {
          type: "course",
          title: "HTML & CSS Crash Course",
          provider: "freeCodeCamp",
          description: "Complete beginner-friendly introduction to web development",
        },
        {
          type: "documentation",
          title: "MDN Web Docs",
          provider: "Mozilla",
          description: "Comprehensive reference for HTML and CSS",
        },
      ],
      paid: [
        {
          type: "course",
          title: "Advanced CSS and Sass",
          provider: "Udemy",
          description: "Master modern CSS techniques and preprocessors",
        },
      ],
      practice: [
        {
          type: "practice",
          title: "CSS Grid Garden",
          provider: "CodePip",
          description: "Interactive game to learn CSS Grid",
        },
      ],
    },
    JavaScript: {
      free: [
        {
          type: "course",
          title: "JavaScript Basics",
          provider: "freeCodeCamp",
          description: "Learn JavaScript fundamentals with hands-on projects",
        },
        {
          type: "book",
          title: "You Don't Know JS",
          provider: "GitHub",
          description: "Deep dive into JavaScript concepts",
        },
      ],
      paid: [
        {
          type: "course",
          title: "The Complete JavaScript Course",
          provider: "Udemy",
          description: "From zero to expert with real-world projects",
        },
      ],
      practice: [
        {
          type: "practice",
          title: "JavaScript30",
          provider: "Wes Bos",
          description: "30 vanilla JavaScript projects in 30 days",
        },
      ],
    },
    React: {
      free: [
        {
          type: "documentation",
          title: "React Official Tutorial",
          provider: "React.dev",
          description: "Official React documentation and tutorial",
        },
        {
          type: "video",
          title: "React Crash Course",
          provider: "Traversy Media",
          description: "Quick introduction to React concepts",
        },
      ],
      paid: [
        {
          type: "course",
          title: "React - The Complete Guide",
          provider: "Udemy",
          description: "Comprehensive React course with hooks and context",
        },
      ],
      practice: [
        {
          type: "practice",
          title: "React Challenges",
          provider: "React Challenges",
          description: "Practice React with coding challenges",
        },
      ],
    },
    Python: {
      free: [
        {
          type: "course",
          title: "Python for Everybody",
          provider: "Coursera",
          description: "University of Michigan's comprehensive Python course",
        },
        {
          type: "documentation",
          title: "Python Official Tutorial",
          provider: "Python.org",
          description: "Official Python documentation and tutorial",
        },
      ],
      paid: [
        {
          type: "course",
          title: "Complete Python Bootcamp",
          provider: "Udemy",
          description: "From zero to hero in Python programming",
        },
      ],
      practice: [
        {
          type: "practice",
          title: "HackerRank Python",
          provider: "HackerRank",
          description: "Python coding challenges and competitions",
        },
      ],
    },
  }

  generateLearningPath(request: LearningPathRequest): LearningPathResponse {
    const careerPath = this.findBestCareerPath(request.goal)
    const phases = this.generatePhases(careerPath, request)
    const timeline = this.calculateTimeline(request.timeAvailable, careerPath.estimatedWeeks)

    return {
      phases,
      estimatedTimeline: timeline,
      totalWeeks: careerPath.estimatedWeeks,
    }
  }

  private findBestCareerPath(goal: string): CareerPath {
    const goalLower = goal.toLowerCase()

    // Try to match with existing career paths
    for (const [key, path] of Object.entries(this.careerPaths)) {
      if (goalLower.includes(key) || goalLower.includes(path.title.toLowerCase())) {
        return path
      }
    }

    // Check for specific technologies or roles
    if (goalLower.includes("web") || goalLower.includes("frontend") || goalLower.includes("backend")) {
      return this.careerPaths["full-stack developer"]
    }

    if (goalLower.includes("data") || goalLower.includes("machine learning") || goalLower.includes("ai")) {
      return this.careerPaths["data scientist"]
    }

    if (
      goalLower.includes("mobile") ||
      goalLower.includes("app") ||
      goalLower.includes("ios") ||
      goalLower.includes("android")
    ) {
      return this.careerPaths["mobile developer"]
    }

    // Default to full-stack developer
    return this.careerPaths["full-stack developer"]
  }

  private generatePhases(careerPath: CareerPath, request: LearningPathRequest): LearningPhase[] {
    return careerPath.phases.map((phaseTemplate, index) => {
      const resources = this.getResourcesForPhase(phaseTemplate.skills, request.learningStyle)
      const timeCommitment = this.calculateTimeCommitment(request.timeAvailable, index)

      return {
        title: phaseTemplate.title,
        duration: phaseTemplate.duration,
        goal: `Master ${phaseTemplate.skills.slice(0, 3).join(", ")} and build practical projects`,
        resources,
        milestones: this.generateMilestones(phaseTemplate),
        timeCommitment,
      }
    })
  }

  private getResourcesForPhase(skills: string[], learningStyle: string): Resource[] {
    const resources: Resource[] = []

    skills.forEach((skill) => {
      const skillResources = this.resourceDatabase[skill]
      if (skillResources) {
        // Always include at least one free resource
        if (skillResources.free.length > 0) {
          resources.push(skillResources.free[0])
        }

        // Add paid resources based on learning style
        if (learningStyle === "structured" && skillResources.paid.length > 0) {
          resources.push(skillResources.paid[0])
        }

        // Add practice resources for hands-on learners
        if (learningStyle === "hands-on" && skillResources.practice.length > 0) {
          resources.push(skillResources.practice[0])
        }
      }
    })

    // Ensure we have at least 3 resources per phase
    while (resources.length < 3) {
      resources.push({
        type: "practice",
        title: "Hands-on Projects",
        provider: "Self-directed",
        description: "Apply your knowledge through practical projects",
      })
    }

    return resources.slice(0, 5) // Limit to 5 resources per phase
  }

  private generateMilestones(phaseTemplate: PhaseTemplate): string[] {
    const baseMilestones = [
      `Complete ${phaseTemplate.skills[0]} fundamentals`,
      `Build ${phaseTemplate.projects[0] || "practice project"}`,
      `Pass phase assessment or quiz`,
    ]

    if (phaseTemplate.projects.length > 1) {
      baseMilestones.push(`Complete ${phaseTemplate.projects[1]} project`)
    }

    if (phaseTemplate.skills.length > 2) {
      baseMilestones.push(`Master ${phaseTemplate.skills[phaseTemplate.skills.length - 1]}`)
    }

    return baseMilestones
  }

  private calculateTimeCommitment(timeAvailable: string, phaseIndex: number): string {
    const timeMap: Record<string, string[]> = {
      "1-2-hours-day": ["1-2 hours daily", "2-3 hours daily", "2-3 hours daily", "3-4 hours daily"],
      "3-4-hours-day": ["2-3 hours daily", "3-4 hours daily", "4-5 hours daily", "4-5 hours daily"],
      "5-6-hours-day": ["3-4 hours daily", "4-5 hours daily", "5-6 hours daily", "5-6 hours daily"],
      "weekends-only": [
        "8-10 hours per weekend",
        "10-12 hours per weekend",
        "12-15 hours per weekend",
        "15-20 hours per weekend",
      ],
      flexible: ["10-15 hours per week", "15-20 hours per week", "20-25 hours per week", "25-30 hours per week"],
    }

    const commitments = timeMap[timeAvailable] || timeMap["1-2-hours-day"]
    return commitments[Math.min(phaseIndex, commitments.length - 1)]
  }

  private calculateTimeline(timeAvailable: string, baseWeeks: number): string {
    const multipliers: Record<string, number> = {
      "1-2-hours-day": 1.5,
      "3-4-hours-day": 1.0,
      "5-6-hours-day": 0.8,
      "weekends-only": 1.8,
      flexible: 1.2,
    }

    const multiplier = multipliers[timeAvailable] || 1.0
    const adjustedWeeks = Math.ceil(baseWeeks * multiplier)

    if (adjustedWeeks <= 12) {
      return `${adjustedWeeks} weeks with consistent effort`
    } else if (adjustedWeeks <= 24) {
      return `${adjustedWeeks} weeks (${Math.ceil(adjustedWeeks / 4)} months) with consistent effort`
    } else {
      return `${Math.ceil(adjustedWeeks / 4)} months with consistent effort`
    }
  }

  // Method to get personalized recommendations based on user input
  getPersonalizedRecommendations(request: LearningPathRequest): string[] {
    const recommendations: string[] = []

    // Level-based recommendations
    if (request.currentLevel === "beginner") {
      recommendations.push("Start with fundamentals and don't rush through concepts")
      recommendations.push("Focus on building a strong foundation before moving to advanced topics")
    } else if (request.currentLevel === "intermediate") {
      recommendations.push("Focus on building portfolio projects to showcase your skills")
      recommendations.push("Consider contributing to open source projects")
    }

    // Time-based recommendations
    if (request.timeAvailable === "weekends-only") {
      recommendations.push("Plan your weekend sessions in advance for maximum productivity")
      recommendations.push("Use weekdays for light reading and review")
    } else if (request.timeAvailable === "1-2-hours-day") {
      recommendations.push("Consistency is key - daily practice is better than long weekend sessions")
      recommendations.push("Break complex topics into smaller, manageable chunks")
    }

    // Learning style recommendations
    if (request.learningStyle === "hands-on") {
      recommendations.push("Build projects alongside learning theory")
      recommendations.push("Use interactive coding platforms and tutorials")
    } else if (request.learningStyle === "video") {
      recommendations.push("Supplement videos with hands-on practice")
      recommendations.push("Take notes while watching to reinforce learning")
    }

    return recommendations
  }
}

export const learningPathGenerator = new LearningPathGenerator()
