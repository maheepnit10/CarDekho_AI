import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarMatch AI — Find Your Perfect Car",
  description:
    "AI-powered car recommendation that understands your city, family, and lifestyle. Go from confused to confident in 5 questions.",
  verification: {
    google: "vOxSZ_KzlQLNhfwWQ4iXBEZx0ssLigVAjzUEQWf6-H8",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
