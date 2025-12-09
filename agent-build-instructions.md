# SkinAI - Agent Build Instructions

## Project Overview

You are building a web-based skincare analysis app that uses Claude's vision API to analyze a user's face photo and provide personalized skincare product recommendations and routines. This is a single-session, privacy-focused app with NO accounts, NO database, and NO data persistence.

**Core Purpose:** Help users (specifically Black males initially, but works for anyone) who don't know where to start with skincare get a personalized routine based on their face photo and skin concerns.

## Key Principles

1. **Privacy First**: No data storage. Image and responses exist only during the session. Close browser = everything gone.
2. **Stateless**: Each analysis is independent. No user accounts or history.
3. **Fast**: Single-page app with smooth transitions. Should feel like a native mobile app.
4. **Minimal**: Clean UI with no unnecessary elements. Mobile-first design.
5. **One Day Build**: Simple architecture, no over-engineering.

## User Flow

```
Welcome → Camera/Upload → Questions → [AI Analysis] → Results → Export/Exit
```

**Step by Step:**
1. **Welcome Screen**: Introduction, privacy message, "Start Analysis" button
2. **Camera Screen**: Capture/upload face photo
3. **Questions Screen**: 5-question form about skin concerns, budget, preferences
4. **Processing**: Send image + answers to Claude API
5. **Results Screen**: Display personalized routine with products, prices, reasoning
6. **Export**: Copy to clipboard or download as text/PDF
7. **Exit**: Close page, all data wiped

## Technical Requirements

**Stack:**
- Next.js 14+ (App Router)
- React with TypeScript
- Tailwind CSS
- Anthropic Claude API (with vision)
- Deployed on Vercel

**Project Structure:**
```
app/
├── page.tsx                    # Main UI with all screens
├── api/
│   └── analyze/route.ts        # Claude API endpoint
└── layout.tsx

components/
├── WelcomeScreen.tsx
├── CameraScreen.tsx
├── QuestionsScreen.tsx
└── ResultsScreen.tsx

lib/
└── claude.ts                   # Claude API helper functions
```

## The 5 Questions

1. **Gender**: Male / Female (affects product recommendations)
2. **Primary Concerns** (multi-select): 
   - Dryness
   - Acne/Pimples
   - Dark Spots
   - Oily
   - Sensitive
   - Uneven Tone
3. **Current Routine**: 
   - Nothing really
   - Just wash my face
   - Have some products
4. **Budget Range**:
   - $ (Under $50)
   - $$ ($50-150)
   - $$$ ($150+)
5. **Preferences** (multi-select, optional):
   - Fragrance-free
   - Natural/Clean
   - Vegan
   - Cruelty-free

## Claude API Integration

**What to Send to Claude:**
1. The face image (base64 encoded)
2. User's answers to all 5 questions
3. A carefully crafted prompt (see below)

**What Claude Should Return:**
```typescript
{
  analysis: string,           // Overall skin analysis
  morning: Array<{
    step: number,
    product: string,          // Specific product name
    why: string,              // Why this product for their concerns
    price: string,            // Approximate price
    howToUse: string,         // Detailed usage instructions
    amount: string,           // How much to use (e.g., "dime-sized", "2-3 drops")
    application: string,      // How to apply (e.g., "massage in circular motions")
    waitTime?: string,        // Optional wait time before next step
    whereToBuy: Array<{       // Best places to purchase
      store: string,
      price: string,
      link?: string           // Optional product link
    }>
  }>,
  evening: Array<{
    step: number,
    product: string,
    why: string,
    price: string,
    howToUse: string,
    amount: string,
    application: string,
    waitTime?: string,
    whereToBuy: Array<{
      store: string,
      price: string,
      link?: string
    }>
  }>,
  totalCost: string,          // Total investment estimate
  beginnerGuide: {            // For users with no current routine
    morningTime: string,      // "5 minutes total"
    eveningTime: string,      // "7-10 minutes total"
    tips: Array<string>,      // Common beginner tips
    mistakes: Array<string>   // Common mistakes to avoid
  }
}
```

## The Claude Prompt Template

```
You are a professional skincare consultant analyzing a client's skin and creating a personalized routine.

CLIENT INFORMATION:
- Gender: {gender}
- Primary Concerns: {concerns}
- Current Routine: {currentRoutine}
- Budget: {budget}
- Preferences: {preferences}

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

5. If user has NO current routine, include a beginnerGuide section:
   - **morningTime**: Total time estimate (e.g., "5 minutes total")
   - **eveningTime**: Total time estimate (e.g., "7-10 minutes total")  
   - **tips**: 4-5 practical tips for beginners (e.g., "Always apply products to damp skin for better absorption", "Start with once daily and build up gradually")
   - **mistakes**: 3-4 common mistakes to avoid (e.g., "Don't rub products in too hard", "Never skip sunscreen", "Don't use hot water on your face")

6. For Black skin specifically:
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

Be practical, specific, and focus on products that are widely available (drugstore + Sephora/Ulta).
```

## API Route Implementation

**File: `app/api/analyze/route.ts`**

This route should:
1. Accept POST request with `{ image: base64String, formData: object }`
2. Convert image to format Claude accepts
3. Build the prompt with user's form data
4. Call Claude API with both image and text prompt
5. Parse Claude's JSON response
6. Return the structured routine data
7. Handle errors gracefully

**Claude API Specifics:**
- Use `claude-sonnet-4-20250514` model (has vision)
- Max tokens: 2000-3000 should be enough
- Temperature: 0.3 (we want consistent, reliable recommendations)
- Include image as: `{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64Data }}`

## UI Implementation Notes

**Reference the provided UI file** (`skincare-ui-preview.jsx`) for:
- Exact styling and layout
- Component structure
- Screen transitions
- Button states and interactions

**Key UI Requirements:**
- Mobile-first responsive design
- Smooth screen transitions (no jarring jumps)
- Loading state during API call
- Error handling (show friendly message if API fails)
- Copy to clipboard functionality
- Download as text file functionality
- Fixed bottom buttons on results screen
- Back navigation on each screen

## Environment Variables

```env
ANTHROPIC_API_KEY=your_key_here
```

## Testing Checklist

Before considering it complete:
- [ ] Camera/upload works on mobile
- [ ] All form validations work (can't submit without gender + concerns)
- [ ] API successfully calls Claude with image + form data
- [ ] Results display properly with all sections
- [ ] Copy button copies routine to clipboard
- [ ] Download button saves as text file
- [ ] Back buttons work correctly
- [ ] Mobile responsive (test on phone)
- [ ] Privacy - no data persists after closing browser
- [ ] Error handling if API fails

## Build Instructions for Agent

Using the provided UI preview file (`skincare-ui-preview.jsx`):

1. **Convert to Next.js structure**: Split the single component into proper Next.js App Router structure
2. **Implement real camera**: Use browser's camera API or file upload
3. **Build the API route**: Create `/api/analyze/route.ts` with Claude integration
4. **Add environment variable**: Set up `ANTHROPIC_API_KEY`
5. **Implement copy/download**: Add real clipboard and file download functionality
6. **Error handling**: Add try/catch and user-friendly error messages
7. **Loading states**: Add spinner/loading UI during API call
8. **Test thoroughly**: Ensure mobile works perfectly

## Success Criteria

The app is complete when:
- User can upload face photo
- User can answer all questions
- Claude analyzes photo and returns personalized routine
- **Phase 2**: Each product includes detailed usage instructions (amount, application, wait times)
- **Phase 2**: Each product shows where to buy based on budget
- **Phase 2**: If user has no routine, show beginner's guide with tips and common mistakes
- Results display with specific products, prices, and reasoning
- User can copy or download their routine (including usage instructions)
- Everything works smoothly on mobile
- No data persists after session ends
- Deployed to Vercel and accessible via URL

## Phase 2 Notes

**Beginner's Guide Display Logic:**
- ONLY show the beginner's guide section if `formData.currentRoutine === "Nothing really"`
- This section should appear prominently between the analysis and the morning routine
- Include timing estimates, practical tips, and common mistakes
- Make it visually distinct (green gradient background in the UI mockup)

**Usage Instructions:**
- Each product should be expandable/collapsible to show full details
- Keep the main view clean, details on demand
- Usage instructions should be practical and specific (not generic advice)
- Include visual indicators where helpful (💧 for water, ⏱️ for wait time, etc.)

**Where to Buy:**
- List 2-3 actual retailers based on the user's budget
- Show price variations between stores
- Prioritize stores that are widely accessible
- $ budget → drugstores, Amazon, Target
- $$ budget → Ulta, Sephora, brand websites
- $$$ budget → premium retailers, dermatologist offices

---

**Remember**: This is a one-day build focused on functionality and user experience. Keep it simple, clean, and working. No over-engineering.
