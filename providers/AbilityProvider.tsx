"use client";

import { createContext, useContext, useMemo } from "react";
import { defineAbilityFor, AppAbility } from "@/lib/casl";
import { useUser } from "@/hooks/useUser";

const AbilityContext = createContext<AppAbility | null>(null);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();

  const ability = useMemo(() => {
    return defineAbilityFor(user.role || "viewer", user.permissions || []);
  }, [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const ability = useContext(AbilityContext);
  if (!ability) throw new Error("useAbility must be used inside AbilityProvider");
  return ability;
}
