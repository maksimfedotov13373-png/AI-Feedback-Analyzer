import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Feedback Analyzer",
  description: "Turn customer feedback into clear business decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
