import type { Metadata } from "next"
import { Geist_Mono, Outfit } from "next/font/google"

import { DevEnv } from "@/components/static/dev-banner"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Oxalis - Qr Based Attendance with Notification System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable
      )}
    >
      <body>
        <ThemeProvider>
          <DevEnv>{children}</DevEnv>
        </ThemeProvider>
      </body>
    </html>
  )
}
