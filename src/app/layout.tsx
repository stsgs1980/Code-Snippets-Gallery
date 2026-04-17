import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Aesthetic Snippets — Where Code Meets Art",
  description:
    "A curated gallery of beautiful code snippets, shaders, generative art, and creative coding masterpieces",
  keywords: [
    "Code Aesthetic Snippets",
    "Creative Coding",
    "Generative Art",
    "Shaders",
    "Algorithms",
    "Gallery",
  ],
  authors: [{ name: "Code Aesthetic Snippets" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Code Aesthetic Snippets — Where Code Meets Art",
    description:
      "A curated gallery of beautiful code snippets, shaders, generative art, and creative coding masterpieces",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
