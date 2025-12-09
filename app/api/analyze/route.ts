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

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to analyze skin: ${errorMessage}` },
      { status: 500 }
    );
  }
}
