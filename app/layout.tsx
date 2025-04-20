import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import AppProvider from "./app"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agriculture Assistant",
  description: "Connecting farmers and consumers",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assitant_logo.webp", sizes: "48x48" }
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180" }
    ],
    shortcut: "/assitant_logo.webp"
  },
  manifest: "/favicon/site.webmanifest",
  themeColor: "#15803d",
  appleWebApp: {
    title: "Agriculture Assistant",
    statusBarStyle: "black-translucent"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/icon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon/icon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#15803d" />
        <meta property="og:image" content="/assitant_logo.webp" />
        <title>Agriculture Assistant</title>
        <style>
          {`
            @media (prefers-color-scheme: light) {
              :root {
                --tab-text-color: #15803d;
              }
            }
            @media (prefers-color-scheme: dark) {
              :root {
                --tab-text-color: #22c55e;
              }
            }
          `}
        </style>
        <script dangerouslySetInnerHTML={{ __html: `
          // Set favicon and title color to match navbar
          (function() {
            try {
              // Use high-contrast colors for better visibility in tab
              document.addEventListener('DOMContentLoaded', function() {
                const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const color = isDark ? '#22c55e' : '#15803d';
                document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
              });
            } catch(e) { console.error(e); }
          })();
        `}} />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}

