import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import ChatWrapper from "@/components/ChatWrapper";
import Search from "@/components/Search";
import { SearchProvider } from "@/context/SearchContext";
import { ChatProvider } from "@/context/ChatContext";
import { Suspense } from "react";
import { LoadingProvider } from '@/context/LoadingContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Michel's Portfolio",
  description: "An AI-powered portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense>
        <LoadingProvider>
          <AuthProvider>
              <SearchProvider>
                <Header />
                <main className="p-6 mx-auto w-full max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-7xl">
                  <Search />
                  {children}
                </main>
                <Footer />
                <ChatWrapper />
              </SearchProvider>
          </AuthProvider>
          </LoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
