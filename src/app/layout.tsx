import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiLearningAssistant from "@/components/AiLearningAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: "GlobeSkill | Technology & AI Education for Every Child",
  description:
    "GlobeSkill is an initiative to help underserved learners gain access to digital skills, technology education and AI-enabled career opportunities.",
  keywords: ["GlobeSkill", "AI Education", "Digital Skills", "NGO", "Non-Profit Education", "Youth Tech", "PWA", "Offline Learning"],
  authors: [{ name: "GlobeSkill Initiative" }],
  manifest: "/manifest.json",
};

import OfflineStatusBanner from "@/components/OfflineStatusBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <OfflineStatusBanner />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <AiLearningAssistant />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


