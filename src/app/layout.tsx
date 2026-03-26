import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visa Copilot - AI-Powered Visa Application Assistant",
  description:
    "Stop juggling documents and deadlines. Visa Copilot's AI agent organizes, verifies, and completes your visa application steps automatically.",
  openGraph: {
    title: "Visa Copilot - AI-Powered Visa Application Assistant",
    description:
      "Your AI copilot for visa applications. Organize documents, track progress, and let AI handle the paperwork.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
