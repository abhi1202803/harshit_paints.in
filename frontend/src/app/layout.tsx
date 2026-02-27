import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Harshit Paints | Premium Automotive & Home Colors",
  description: "Your ultimate destination for Asian Paints, Deltron, ASPA, 2K & 4K premium paints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-50`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
