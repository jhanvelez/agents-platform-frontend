"use client";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";


import ClientWrapper from "@/components/ClientWrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Footer />
      </div>
    </div>
  );
}
