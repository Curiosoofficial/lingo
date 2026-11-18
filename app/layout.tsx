import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ExitModal from "@/components/modals/ExitModal";
import HeartsModal from "@/components/modals/HeartsModal";
import PracticeModal from "@/components/modals/PracticeModal";


const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lingo",
  description: "Sprachen lernen im Duolingo-Stil (Tutorial-Projekt)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className={font.className}>
          <Toaster />
          <ExitModal />
          <HeartsModal />
          <PracticeModal/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
