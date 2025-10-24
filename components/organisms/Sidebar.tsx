"use client"

import Image from "next/image";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAbility } from "@/providers/AbilityProvider"
import type { Actions, Subjects } from "@/lib/casl";

// Logo
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
  { id: "dashboard", label: "Vista General", icon: Home, path: "/dashboard", ability: { action: "read", subject: "Dashboard" } },
  { id: "agents", label: "Agentes IA", icon: Bot, path: "/dashboard/agents", ability: { action: "read", subject: "agents" } },
  { id: "manage-agents", label: "Gestión Agentes IA", icon: SettingsIcon, path: "/dashboard/manage-agents", ability: { action: "manage", subject: "agents" } },
  { id: "models-ia", label: "Modelos IA", icon: Brain, path: "/dashboard/models-ia", ability: { action: "read", subject: "Model" } },
  { id: "business-management", label: "Gestión de empresas", icon: Building2, path: "/dashboard/business-management", ability: { action: "manage", subject: "Business" } },
  { id: "plans", label: "Planes", icon: SparklesIcon, path: "/dashboard/plans", ability: { action: "read", subject: "plans" } },
  { id: "conversations", label: "Historial Conversaciones", icon: MessageSquare, path: "/dashboard/conversations", ability: { action: "read", subject: "Conversation" } },
  { id: "analytics", label: "Análisis Consultas", icon: BarChart3, path: "/dashboard/analytics", ability: { action: "read", subject: "Analytics" } },
  { id: "monitoring", label: "Monitoreo", icon: Activity, path: "/dashboard/monitoring", ability: { action: "read", subject: "Monitoring" } },
  { id: "users", label: "Gestión Usuarios", icon: Users, path: "/dashboard/users", ability: { action: "read", subject: "user" } },
  { id: "roles", label: "Roles", icon: Shield, path: "/dashboard/roles", ability: { action: "read", subject: "Roles" } },
  { id: "settings", label: "Configuración", icon: SettingsIcon, path: "/dashboard/settings", ability: { action: "update", subject: "Settings" } },
  { id: "profile", label: "Mi Perfil", icon: User, path: "/dashboard/profile", ability: { action: "read", subject: "Settings" } },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const ability = useAbility();

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-primary transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header del sidebar */}
      <div className="flex h-16 items-center justify-between px-4 border-b my-auto bg-white ">
        {!collapsed && (
          <div className="flex items-center">
            <div className="flex justify-center">
              <Image
                src={Logo}
                alt="ByBinary logo"
                className="w-24"
              />
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-700">Agentes IA ByBinary</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Menú */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems
          .filter((item) => ability.can(item.ability.action, item.ability.subject))
          .map((item) => {
            const Icon = item.icon

            const itemSegments = item.path.split("/").filter(Boolean);

            const isActive =
              pathname === item.path ||
              (pathname.startsWith(item.path + "/") &&
                itemSegments.length > 1);

            return (
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
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
