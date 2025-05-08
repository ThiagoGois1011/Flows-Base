'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FlowProvider } from "@/contexts/FlowContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <FlowProvider>
            {children}
          </FlowProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
