import { type NextRequest, NextResponse } from "next/server"
import { huggingFaceService } from "@/lib/huggingface"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goal, currentLevel, timeAvailable, learningStyle, specificTopics } = body

    // Validate required fields
    if (!goal || !currentLevel || !timeAvailable || !learningStyle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate learning path using Hugging Face
    const learningPath = await huggingFaceService.generateLearningPath({
      goal,
      currentLevel,
      timeAvailable,
      learningStyle,
      specificTopics,
    })

    return NextResponse.json({ learningPath })
  } catch (error) {
    console.error("Error in generate-path API:", error)
    return NextResponse.json({ error: "Failed to generate learning path" }, { status: 500 })
  }
}
