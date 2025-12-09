import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkinAI - Personalized Skincare Analysis",
  description: "Get a personalized skincare routine in 60 seconds. 100% private, no account needed.",
  applicationName: "SkinAI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SkinAI",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#4f46e5",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
