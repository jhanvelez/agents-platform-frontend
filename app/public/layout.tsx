"use client";
import { Footer } from "@/components/organisms/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
        <Footer />
      </div>
    </div>
  );
}
