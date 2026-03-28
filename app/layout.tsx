import "./globals.css";
import Navbar from "@/app/components/ui/Navbar";
import { Bebas_Neue, Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Providers from "./providers";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Vinum et Veritas – Weinclub",
  description: "Sechs Freunde. Viel Rotwein. Ehrliche Urteile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body
  className={`${bebas.variable} ${inter.variable} antialiased min-h-screen flex flex-col bg-white text-neutral-950`}
>
  <Providers>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </Providers>
</body>
    </html>
  );
}