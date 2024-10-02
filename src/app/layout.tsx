import { ThemeProvider } from "@/theme/theme-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../app/globals.css";
import { Navbar } from "./components/navbar/navbar";
import { Toaster } from "@components/ui/toaster";
import Head from "next/head";

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Funtrail",
  description: "Generated by create next app",
  icons: {
    icon: "/logo/logo.svg", // /public path
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          themes={["light", "dark", "purple"]}
        >
          <Navbar />
          <main className="mt-16">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
