import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "Free, open-source diagram studio for students and developers. Write PlantUML or Mermaid, or let AI draw from a sentence, a whiteboard photo or a screenshot. UML, ER, architecture, flowcharts and more.";

export const metadata: Metadata = {
  metadataBase: new URL("https://umlstudio.vercel.app"),
  title: { default: "UML Studio · AI diagrams from text, code or a photo", template: "%s" },
  description,
  keywords: ["PlantUML", "Mermaid", "UML", "ER diagram", "architecture diagram", "AI diagram generator", "text to diagram", "image to diagram", "sequence diagram", "open source"],
  openGraph: { title: "UML Studio", description, url: "/", siteName: "UML Studio", type: "website" },
  twitter: { card: "summary_large_image", title: "UML Studio", description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/app" signUpFallbackRedirectUrl="/app">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="bottom-center" richColors />
          </ThemeProvider>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
}
