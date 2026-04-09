import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'GMC TalentLens',
  description: 'The next-generation ATS powered by AI.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TalentLens",
  },
};

export const viewport: Viewport = {
  themeColor: '#141726',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-base-100">
      <body
        suppressHydrationWarning
        className="bg-base-100 text-base-content min-h-screen flex flex-col antialiased"
      >

        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

      </body>
    </html>
  );
}