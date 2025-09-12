import "../styles/globals.css";
import "../styles/output.css";

import ReduxProvider from '@/providers/ReduxProvider'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "Agentes IA ByBinary",
  description: "Plataforma de IA",
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
