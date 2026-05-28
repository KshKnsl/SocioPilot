import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SocioPilot",
  description: "AI-Powered Social Media Content Generator",
  icons: {
    icon: "/logo.png",
  },
};

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className={`antialiased bg-background text-foreground`}>
        <script dangerouslySetInnerHTML={{ __html: "try{if(typeof document !== 'undefined' && document.body && document.body.hasAttribute && document.body.hasAttribute('cz-shortcut-listen')){document.body.removeAttribute('cz-shortcut-listen');}}catch(e){}" }} />
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
