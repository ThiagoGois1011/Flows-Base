'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFlowStore } from "@/store/flowStore";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { fetchFlows } = useFlowStore()

  useEffect(() => {
    fetchFlows()
  }, [])
   
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
