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
  icons: {
    icon: "/icon-192.png",
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GlobeSkill",
  },
};

import OfflineStatusBanner from "@/components/OfflineStatusBanner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AppUpdateNotifier from "@/components/AppUpdateNotifier";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                var reg = function() { navigator.serviceWorker.register('/sw.js', { scope: '/' }); };
                if (document.readyState === 'complete') { reg(); } else { window.addEventListener('load', reg); }
              }
            `,
          }}
        />
        <ServiceWorkerRegister />
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <OfflineStatusBanner />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <AiLearningAssistant />
            <AppUpdateNotifier />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}



