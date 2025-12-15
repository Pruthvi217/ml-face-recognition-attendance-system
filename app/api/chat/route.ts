import { type NextRequest, NextResponse } from "next/server"
import { huggingFaceService } from "@/lib/huggingface"
import { responseGenerator } from "@/lib/response-generator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, learningPath } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let response: string
    let updatedPath = learningPath

    // Check if this is a path adjustment request
    const isPathAdjustment =
      message.toLowerCase().includes("adjust") ||
      message.toLowerCase().includes("change") ||
      message.toLowerCase().includes("modify")

    if (isPathAdjustment && learningPath) {
      // Use local response generator for path adjustments
      const adjustment = responseGenerator.generatePathAdjustment(learningPath, message, context)
      response = adjustment.explanation
      updatedPath = adjustment.adjustedPath
    } else {
      // Try Hugging Face API first, fallback to local processing
      try {
        response = await huggingFaceService.generateFollowUpResponse(message, context || "")
      } catch (error) {
        console.log("Hugging Face API failed, using local processing")
        response = responseGenerator.generateResponse(message, context)
      }
    }

    return NextResponse.json({
      response,
      updatedPath: updatedPath !== learningPath ? updatedPath : undefined,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
