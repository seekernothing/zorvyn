import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zorvyn · Your Money, Clearly",
    template: "%s · Zorvyn",
  },
  description:
    "Zorvyn is a clean, intelligent personal finance dashboard. Track income, expenses, spending patterns, and financial insights — all in one place.",
  keywords: ["finance", "dashboard", "budget", "expenses", "income", "spending tracker"],
  authors: [{ name: "Abhishek Biradar" }],
  creator: "Zorvyn",
  metadataBase: new URL("https://zorvyn.vercel.app"),
  openGraph: {
    title: "Zorvyn · Your Money, Clearly",
    description: "Track income, expenses, and financial insights with Zorvyn.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zorvyn · Your Money, Clearly",
    description: "Track income, expenses, and financial insights with Zorvyn.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ReduxProvider>
            <TooltipProvider delayDuration={300}>
              {children}
              <Toaster richColors position="bottom-right" />
            </TooltipProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
