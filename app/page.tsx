"use client";
import { useRouter } from "next/navigation";
import { Landing } from "@/components/landing";

export default function LandingPage() {
  const router = useRouter();

  return (
    <Landing
      onGetStarted={() => router.push("/login")}
      onLogin={() => router.push("/login")}
    />
  );
}
