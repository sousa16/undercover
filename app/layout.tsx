import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { AuthGate } from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "Undercover",
  description: "Custom Undercover for the group.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-[100dvh] font-sans">
        <GameProvider>
          <AuthGate>
            <main className="mx-auto w-full max-w-md min-h-[100dvh] px-4 safe-top safe-bottom flex flex-col">
              {children}
            </main>
          </AuthGate>
        </GameProvider>
      </body>
    </html>
  );
}
