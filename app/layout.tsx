import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event·ing — Discover Local Events",
  description: "Browse and share local events near you. Music, sports, arts, food, tech, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-teal-900 text-teal-200 py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-white">Event·ing</span>
            </div>
            <p className="text-sm text-teal-400">
              © {new Date().getFullYear()} Event·ing. Bringing communities together.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
