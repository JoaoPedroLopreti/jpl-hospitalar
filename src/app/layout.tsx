import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import PageTransition from "@/components/ui/page-transition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JPL Hospitalar - Fornecimento de Produtos Hospitalares",
  description: "Especializada em fornecimento de produtos hospitalares para instituições de saúde públicas e privadas. Representante autorizada da marca KTK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <Header />
        <main className="flex-1">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}

