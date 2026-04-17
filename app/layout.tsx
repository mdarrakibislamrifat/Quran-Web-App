import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quran Web App",
  description: "Read the Holy Quran",
  other: {
    google: "notranslate",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className="h-full" translate="no">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <div className="flex min-h-screen">
          {/* Main Content Area */}
          <main className="flex-1 mr-64 p-6"> 
            {children}
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </body>
    </html>
  );
}