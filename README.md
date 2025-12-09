# SkinAI - Progressive Web App

A privacy-first skincare analysis app powered by Claude AI's vision capabilities. Get personalized skincare recommendations in 60 seconds.

## Features

- **AI-Powered Analysis**: Uses Claude's vision API to analyze skin and provide personalized recommendations
- **Privacy First**: No data storage, no accounts, everything is session-based
- **Progressive Web App**: Install on your device and use like a native app
- **Mobile Optimized**: Beautiful, responsive design that works perfectly on phones
- **Fast & Simple**: Complete analysis in under 60 seconds

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Anthropic API key

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Anthropic API key:**
   - Copy `.env.example` to `.env.local`
   - Add your Anthropic API key:
     ```
     ANTHROPIC_API_KEY=sk-ant-your-key-here
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to http://localhost:3000
   - The app is ready to use!

## Progressive Web App (PWA)

This app is configured as a Progressive Web App, which means users can:

- **Install it on their device** (Home screen on mobile, desktop app on computers)
- **Use it offline** (when built for production)
- **Get an app-like experience** (no browser chrome, full screen)

### PWA Features

- **Custom Logo**: Your branded logo appears throughout the app and on the home screen
- **Standalone Mode**: Opens in full-screen without browser UI
- **Theme Colors**: Custom brand colors for status bars and UI elements
- **Installable**: Users get an "Add to Home Screen" prompt on mobile devices

### Testing PWA Functionality

1. **On Mobile (iOS/Android):**
   - Open the app in Safari (iOS) or Chrome (Android)
   - Tap the Share/Menu button
   - Select "Add to Home Screen"
   - The app icon will appear on your home screen

2. **On Desktop (Chrome/Edge):**
   - Open the app in Chrome or Edge
   - Click the install icon in the address bar
   - The app will install as a standalone application

## Project Structure

```
SkinCareAI/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Claude API endpoint
│   ├── globals.css               # Tailwind CSS styles
│   ├── layout.tsx                # Root layout with PWA metadata
│   └── page.tsx                  # Main UI component
├── lib/
│   └── claude.ts                 # Claude API helper functions
├── public/
│   ├── icons/                    # PWA icons (various sizes)
│   ├── logo.png                  # Main logo
│   ├── favicon.png               # Browser favicon
│   └── manifest.json             # PWA manifest
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Environment template
├── next.config.js                # Next.js + PWA configuration
└── package.json
```

## How It Works

1. **Welcome Screen**: User sees the branded logo and starts analysis
2. **Camera/Upload**: User captures or uploads a face photo
3. **Questions**: User answers 5 questions about their skin
4. **AI Analysis**: Claude's vision API analyzes the photo and answers
5. **Results**: User receives personalized morning and evening routines
6. **Export**: User can copy or download their routine

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Anthropic Claude API**: AI vision and text generation
- **next-pwa**: Progressive Web App support
- **Lucide React**: Icon library

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SkinAI PWA"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variable: `ANTHROPIC_API_KEY`
   - Deploy!

3. **PWA in Production:**
   - PWA features are automatically enabled in production
   - Service worker will be generated and registered
   - Users will be able to install the app

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |

## PWA Configuration

The app is configured with:

- **Name**: SkinAI - Personalized Skincare Analysis
- **Short Name**: SkinAI
- **Theme Color**: #4f46e5 (Indigo)
- **Background Color**: #ffffff (White)
- **Display Mode**: Standalone (full-screen app)
- **Orientation**: Portrait (mobile-optimized)

## Privacy & Data Handling

- **No Database**: No data is stored anywhere
- **No User Accounts**: No registration or login required
- **Session-Based**: Data exists only during the browser session
- **Auto-Delete**: All data is deleted when the user closes the browser
- **No Tracking**: No analytics or tracking cookies

## License

Private project - All rights reserved

## Support

For issues or questions, please contact the development team.

---

Built with ❤️ using Claude AI
