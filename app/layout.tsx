import "../styles/globals.css";
import "../styles/output.css";

import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/providers/ReduxProvider';
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "Agentes IA ByBinary",
  description: "Plataforma de IA",
  icons: {
    icon: "/favicon.ico",
  },
};

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} min-h-screen bg-background`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <ReduxProvider>
            <Toaster position="top-right" />
            {children}
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
