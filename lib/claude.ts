import Anthropic from "@anthropic-ai/sdk";

export interface FormData {
  gender: string;
  concerns: string[];
  currentRoutine: string;
  budget: string;
  preferences: string[];
}

export interface WhereToBuy {
  store: string;
  price: string;
  link?: string;
}

export interface RoutineStep {
  step: number;
  product: string;
  why: string;
  price: string;
  howToUse: string;
  amount: string;
  application: string;
  waitTime?: string;
  whereToBuy?: WhereToBuy[];
}

export interface BeginnerGuide {
  morningTime: string;
  eveningTime: string;
  tips: string[];
  mistakes: string[];
}

export interface AnalysisResult {
  analysis: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
  totalCost: string;
  beginnerGuide?: BeginnerGuide;
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

4. For EACH product, provide detailed usage instructions:
   - **howToUse**: Complete instructions (e.g., "Apply to damp skin, massage in circular motions for 30 seconds, rinse thoroughly with lukewarm water")
   - **amount**: Specific amount (e.g., "dime-sized amount", "2-3 drops", "pea-sized", "nickel-sized")
   - **application**: How to apply (e.g., "gentle circular motions", "pat into skin", "press into face and neck", "smooth upward strokes")
   - **waitTime**: If needed between steps (e.g., "Wait 60 seconds before next step", "Let absorb for 1-2 minutes")
   - **whereToBuy**: List 2-3 best places to buy based on budget:
     * $ budget: Amazon, Target, CVS, Walgreens, Walmart
     * $$ budget: Ulta, Sephora, brand website, Dermstore
     * $$$ budget: Sephora, Nordstrom, Dermstore, dermatologist office
     * Include approximate prices at each retailer

5. If user has NO current routine (currentRoutine is "Nothing really"), include a beginnerGuide section:
   - **morningTime**: Total time estimate (e.g., "5 minutes total")
   - **eveningTime**: Total time estimate (e.g., "7-10 minutes total")
   - **tips**: 4-5 practical tips for beginners (e.g., "Always apply products to damp skin for better absorption", "Start with once daily and build up gradually")
   - **mistakes**: 3-4 common mistakes to avoid (e.g., "Don't rub products in too hard", "Never skip sunscreen", "Don't use hot water on your face")

6. For Black skin specifically:
   - Avoid products that cause ashy appearance
   - Recommend sunscreens without white cast
   - Address hyperpigmentation/dark spots if relevant
   - Focus on moisture retention

7. Return ONLY a JSON object in this exact format:
{
  "analysis": "2-3 sentence skin analysis based on photo and answers",
  "morning": [
    {
      "step": 1,
      "product": "Exact Product Name",
      "why": "Why this helps their specific concerns",
      "price": "$XX",
      "howToUse": "Complete step-by-step instructions with water temperature, time, technique",
      "amount": "Specific amount (dime-sized, 2-3 drops, etc.)",
      "application": "How to apply (circular motions, pat in, etc.)",
      "waitTime": "Optional - only if needed between steps",
      "whereToBuy": [
        {"store": "Amazon", "price": "$XX"},
        {"store": "Target", "price": "$XX"}
      ]
    }
  ],
  "evening": [
    {
      "step": 1,
      "product": "Exact Product Name",
      "why": "Why this helps their specific concerns",
      "price": "$XX",
      "howToUse": "Complete step-by-step instructions",
      "amount": "Specific amount",
      "application": "How to apply",
      "waitTime": "Optional",
      "whereToBuy": [
        {"store": "Store Name", "price": "$XX"}
      ]
    }
  ],
  "totalCost": "$XXX (will last X months)",
  "beginnerGuide": {
    "morningTime": "5 minutes total",
    "eveningTime": "7-10 minutes total",
    "tips": [
      "Practical tip 1",
      "Practical tip 2",
      "Practical tip 3",
      "Practical tip 4"
    ],
    "mistakes": [
      "Common mistake to avoid 1",
      "Common mistake to avoid 2",
      "Common mistake to avoid 3"
    ]
  }
}

Be practical, specific, and focus on products that are widely available (drugstore + Sephora/Ulta).`;
}

function normalizeMediaType(rawMediaType: string): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  // Normalize to lowercase
  const normalized = rawMediaType.toLowerCase().trim();

  // Handle common variants
  const mediaTypeMap: Record<string, "image/jpeg" | "image/png" | "image/gif" | "image/webp"> = {
    "image/jpg": "image/jpeg",
    "image/jpeg": "image/jpeg",
    "image/png": "image/png",
    "image/gif": "image/gif",
    "image/webp": "image/webp",
  };

  const mappedType = mediaTypeMap[normalized];
  if (!mappedType) {
    throw new Error(`Unsupported image format: ${rawMediaType}. Please use JPEG, PNG, GIF, or WebP.`);
  }

  return mappedType;
}

export async function analyzeSkin(
  imageBase64: string,
  formData: FormData
): Promise<AnalysisResult> {
  const prompt = buildPrompt(formData);

  // Extract the base64 data and media type
  const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid image format. Please make sure you're uploading a valid image file.");
  }

  const rawMediaType = matches[1];
  const base64Data = matches[2];

  // Normalize and validate the media type
  const mediaType = normalizeMediaType(rawMediaType);

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
