"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export function Footer() {
  const router = useRouter();
  const user = useUser();

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-3 md:flex md:items-center md:justify-between lg:px-4">
        <div className="flex justify-center gap-x-6 md:order-2">
          <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
            <span className="font-extralight">Tu{" "}</span>voz,{" "}
            <span className="font-extralight">tus{" "}</span>datos,{" "}
            <span className="font-extralight">nuestra{" "}</span>inteligencia.
          </h1>
        </div>
        <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
          &copy;{" "}
          <span className="font-extralight">2025{" "}</span>Bybinary.{" "}
          <span className="font-extralight">Todos los derechos reservados.{" "}</span>
        </h1>
      </div>
    </footer>
  );
}
