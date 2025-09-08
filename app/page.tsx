"use client";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/login/page";

export default function LandingPage() {
  const router = useRouter();

  return (
    <LoginPage />
  );
}
