import type { Metadata } from "next";
import {JetBrains_Mono } from "next/font/google";
import "./globals.css";
const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "SocioPilot",
  description: "AI-Powered Social Media Content Generator",
  icons: {
    icon: "/logo.png",
  },
};

import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className={`antialiased bg-background text-foreground`}>
        <Header />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      </body>
    </html>
  );
}
