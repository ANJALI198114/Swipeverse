import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "SwipeVerse – Unbiased Dating App",
  description: "Find meaningful connections on SwipeVerse, the unbiased dating app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Outfit', sans-serif" }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
