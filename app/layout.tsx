import "../styles/globals.css";
import "../styles/output.css";

import ReduxProvider from '@/providers/ReduxProvider'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: "Agentes IA TEK",
  description: "Plataforma de IA",
};

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <html lang="es">
        <body className="min-h-screen bg-background">
          <Toaster position="top-right" />
          {children}
        </body>
      </html>
    </ReduxProvider>
  );
}
