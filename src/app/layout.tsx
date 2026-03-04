import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AI Document Workspace",
    description:
        "AI-powered document assistant — paste a document, ask questions, get streaming answers.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} flex h-full min-h-0 flex-col antialiased`}
            >
                <Providers>
                    <SiteHeader />
                    <main className="flex min-h-0 flex-1 flex-col">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
