import type { Metadata } from "next";
import { Playfair_Display, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Proposta Digital 360º — Nefertari Cozinha Viva",
  description:
    "Ecossistema Digital 360º para transformar a essência da Nefertari em uma máquina previsível de vendas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn(playfair.variable, inter.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
