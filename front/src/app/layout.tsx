import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Premium Imports",
  description: "Carros do mais alto padrão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="pt-br">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <header className="w-full h-20 flex justify-center items-center border-b-2">
            <div className="px-10 w-full flex justify-between">
              <div className="flex gap-10">
                <div className="w-36">
                  {/* <Image src={""} alt="logo" /> */}
                </div>
                <nav className="flex gap-4">
                  <Link href={"/vendas"}>Vendas</Link>
                  <Link href={"/compras"}>Compras</Link>
                  <Link href={"/pedidos"}>Pedidos</Link>
                  <Link href={"/veiculos"}>Veículos</Link>
                  <Link href={"/modelos"}>Modelos</Link>
                  <Link href={"/montadoras"}>Montadoras</Link>
                  <Link href={"/clientes"}>Clientes</Link>
                </nav>
              </div>
              <div>Buscar</div>
            </div>
          </header>
          <main className="w-full h-full p-10">{children}</main>
          <Toaster />
        </body>
      </html>
    </QueryClientProvider>
  );
}
