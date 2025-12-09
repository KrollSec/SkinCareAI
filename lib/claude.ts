import Anthropic from "@anthropic-ai/sdk";

export interface FormData {
  gender: string;
  concerns: string[];
  currentRoutine: string;
  budget: string;
  preferences: string[];
}

export interface RoutineStep {
  step: number;
  product: string;
  why: string;
  price: string;
}

export interface AnalysisResult {
  analysis: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
  totalCost: string;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function buildPrompt(formData: FormData): string {
  return `You are a professional skincare consultant analyzing a client's skin and creating a personalized routine.

CLIENT INFORMATION:
- Gender: ${formData.gender}
- Primary Concerns: ${formData.concerns.join(", ")}
- Current Routine: ${formData.currentRoutine}
- Budget: ${formData.budget}
- Preferences: ${formData.preferences.length > 0 ? formData.preferences.join(", ") : "None specified"}

[Image of their face is attached]

INSTRUCTIONS:
1. Analyze the attached face photo for:
   - Skin texture (dry, oily, combination)
   - Visible concerns (acne, dark spots, uneven tone, etc.)
   - Overall skin health indicators
   - Pay special attention to melanin-rich skin characteristics if applicable

2. Create a complete skincare routine with SPECIFIC product recommendations:
   - Give actual product names (e.g., "CeraVe Hydrating Facial Cleanser", not "a gentle cleanser")
   - Include approximate prices
   - Explain WHY each product addresses their specific concerns
   - Keep within their stated budget
   - Respect their preferences (fragrance-free, natural, etc.)
   - Focus on beginner-friendly products if they have no current routine

3. Structure the routine as:
   - MORNING: 3-4 steps (cleanser, treatment, moisturizer, SPF)
   - EVENING: 3-5 steps (cleanser, treatment/exfoliant, serum, moisturizer)

4. For Black skin specifically:
   - Avoid products that cause ashy appearance
   - Recommend sunscreens without white cast
   - Address hyperpigmentation/dark spots if relevant
   - Focus on moisture retention

5. Return ONLY a JSON object in this exact format:
{
  "analysis": "2-3 sentence skin analysis based on photo and answers",
  "morning": [
    {
      "step": 1,
      "product": "Exact Product Name",
      "why": "Why this helps their specific concerns",
      "price": "$XX"
    }
  ],
  "evening": [
    {
      "step": 1,
      "product": "Exact Product Name",
      "why": "Why this helps their specific concerns",
      "price": "$XX"
    }
  ],
  "totalCost": "$XXX (will last X months)"
}

Be practical, specific, and focus on products that are widely available (drugstore + Sephora/Ulta).`;
}

export async function analyzeSkin(
  imageBase64: string,
  formData: FormData
): Promise<AnalysisResult> {
  const prompt = buildPrompt(formData);

  // Extract the base64 data and media type
  const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid image format");
  }

  const mediaType = matches[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  const base64Data = matches[2];

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: base64Data,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  });

  // Extract the text content from the response
  const textContent = message.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Parse the JSON response
  const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse JSON from Claude response");
  }

  const result: AnalysisResult = JSON.parse(jsonMatch[0]);
  return result;
}
