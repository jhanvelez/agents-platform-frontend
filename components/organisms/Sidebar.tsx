"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAbility } from "@/providers/AbilityProvider";
import type { Actions, Subjects } from "@/lib/casl";
import {
  Bot,
  BarChart3,
  Settings as SettingsIcon,
  Building2,
  SparklesIcon,
  Users,
  MessageSquare,
  Activity,
  Shield,
  User,
  Home,
  ChevronLeft,
  ChevronRight,
  Brain,
} from "lucide-react";

import Logo from "@/public/logo.png";

export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  ability: {
    action: Actions;
    subject: Subjects;
  };
}

export const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Vista General", icon: Home, path: "/dashboard", ability: { action: "read", subject: "dashboard" } },
  { id: "agents", label: "Agentes IA", icon: Bot, path: "/dashboard/agents", ability: { action: "read", subject: "agents" } },
  { id: "manage-agents", label: "Gestión agentes IA", icon: SettingsIcon, path: "/dashboard/manage-agents", ability: { action: "read", subject: "manage-agents" } },
  { id: "models-ia", label: "Modelos IA", icon: Brain, path: "/dashboard/models-ia", ability: { action: "read", subject: "model" } },
  { id: "business-management", label: "Gestión de empresas", icon: Building2, path: "/dashboard/business-management", ability: { action: "read", subject: "business" } },
  { id: "plans", label: "Planes", icon: SparklesIcon, path: "/dashboard/plans", ability: { action: "read", subject: "plans" } },
  { id: "conversations", label: "Historial conversaciones", icon: MessageSquare, path: "/dashboard/conversations", ability: { action: "read", subject: "conversation" } },
  { id: "analytics", label: "Análisis consultas", icon: BarChart3, path: "/dashboard/analytics", ability: { action: "read", subject: "analytics" } },
  { id: "monitoring", label: "Monitoreo", icon: Activity, path: "/dashboard/monitoring", ability: { action: "read", subject: "monitoring" } },
  { id: "users", label: "Gestión usuarios", icon: Users, path: "/dashboard/users", ability: { action: "read", subject: "users" } },
  { id: "roles", label: "Gestión roles", icon: Shield, path: "/dashboard/roles", ability: { action: "read", subject: "roles" } },
  { id: "settings", label: "Configuración", icon: SettingsIcon, path: "/dashboard/settings", ability: { action: "update", subject: "settings" } },
  { id: "profile", label: "Mi perfil", icon: User, path: "/dashboard/profile", ability: { action: "read", subject: "profile" } },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const ability = useAbility();

  useEffect(() => {
    // Espera a que las abilities se carguen completamente
    const waitForAbility = async () => {
      // Simulación de carga si el provider tarda en montar las abilities
      if (!ability || Object.keys(ability.rules || {}).length === 0) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    };
    waitForAbility();
  }, [ability]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-64 items-center justify-center bg-primary/5 text-gray-600">
        <div className="animate-pulse text-sm font-medium">Cargando permisos...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-primary transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b bg-white">
        {!collapsed && (
          <div className="flex items-center">
            <Image src={Logo} alt="ByBinary logo" className="w-24" />
            <span className="ml-2 text-sm font-semibold text-gray-700">
              Agentes IA ByBinary
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/*
        Menú
      */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems
            .map((item) => {
              const Icon = item.icon;
              const itemSegments = item.path.split("/").filter(Boolean);
              const isActive =
                pathname === item.path ||
                (pathname.startsWith(item.path + "/") && itemSegments.length > 1);

              const permited = ability.can("read", item.ability.subject);

              return (
                permited && (
                  <Link key={item.id} href={item.path} className="block">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                    >
                      <Icon className="h-5 w-5" />
                      {!collapsed && <span className="ml-2">{item.label}</span>}
                    </Button>
                  </Link>
                )
              );
            })}
        </nav>
      </ScrollArea>
    </div>
  );
}
