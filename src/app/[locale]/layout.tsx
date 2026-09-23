import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Voyage | Luxury Travel Curators",
  description: "Curated, ultra-premium travel experiences.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans bg-white dark:bg-black text-[#2a2a2a] dark:text-[#f3f4f6] overflow-x-hidden selection:bg-[#D4AF37]/30 bg-noise" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider defaultTheme="dark">
            <AuthProvider>
              <SmoothScrollProvider>
                {children}
              </SmoothScrollProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
