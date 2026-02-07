import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Soluciones Integrales de Mantenimiento e Infraestructura - Cuyo Smart",
    template: "%s | Cuyo Smart",
  },
  description: "Mantenimiento industrial, reparación de techos, obras civiles y aislación térmica en Mendoza. Respaldo técnico y calidad garantizada.",
  keywords: ["mantenimiento industrial", "reparación de techos", "obras civiles", "aislación térmica", "poliuretano proyectado", "impermeabilización", "Mendoza"],
  icons: {
    icon: "/logo_symmetrical.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${openSans.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow pt-20 md:pt-28">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
