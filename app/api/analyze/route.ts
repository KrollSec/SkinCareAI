import { NextRequest, NextResponse } from "next/server";
import { analyzeSkin, FormData } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, formData } = body as {
      image: string;
      formData: FormData;
    };

    // Validate required fields
    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    if (!formData.gender || formData.concerns.length === 0) {
      return NextResponse.json(
        { error: "Gender and at least one concern are required" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error: API key not set" },
        { status: 500 }
      );
    }

    // Call Claude API
    const result = await analyzeSkin(image, formData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error analyzing skin:", error);

    // Check if it's an Anthropic API error
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status?: number; message?: string };
      const status = apiError.status || 500;
      const message = apiError.message || "API request failed";

      return NextResponse.json(
        { error: `AI service error: ${message}` },
        { status }
      );
    }

    // Handle our custom errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    // Return appropriate status code based on error type
    const status = errorMessage.includes("Unsupported image format") ||
                   errorMessage.includes("Invalid image") ? 400 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
