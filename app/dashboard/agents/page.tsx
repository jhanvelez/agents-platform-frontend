
"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  RefreshCw,
  Bot,
  MessageSquare,
  Plus,
} from "lucide-react";

// API
import {
  useAgentsQuery
} from "@/store/manage-agents/manage-agents.api"

//Types
import { Agent } from "@/types/agent"

const mockChatSessions = [
  {
    id: 1,
    title: "Consulta sobre instalación",
    agent: "Agente Soporte",
    date: "2024-01-15 10:30",
    messages: 12,
    
  },
  {
    id: 2,
    title: "Información de precios",
    agent: "Agente Ventas",
    date: "2024-01-15 09:15",
    messages: 8,
  },
]

export default function LoginPage() {
  const router = useRouter();

  const { data: agentsData } = useAgentsQuery({ search: "" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agentes IA</h2>
          <p className="text-slate-700">Gestiona y chatea con tus agentes de inteligencia artificial</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Refrescar Lista
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lista de Agentes */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-950">
                <Bot className="h-5 w-5" />
                Agentes Tek Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agentsData && agentsData.map((agent: Agent) => (
                <div key={agent.id} className="space-y-2">
                  <span className="isolate inline-flex rounded-md shadow-xs dark:shadow-none w-full h-auto">
                    <button
                      className="w-full justify-start h-auto p-3 z-10 hover:bg-accent relative inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-white dark:ring-gray-700 dark:hover:bg-white/20"
                      onClick={() => {
                        router.push(`/dashboard/agents/chat/${agent.id}`);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="text-left w-2/3">
                          <div className="text-slate-950 font-semibold">{agent.name}</div>
                          <div className="text-xs text-slate-700">{agent.description}</div>
                        </div>

                        <div className="text-right w-1/3">
                          <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                            {agent.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {/* Historial de Chats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-950">
                  <MessageSquare className="h-5 w-5" />
                  Historial de Chats
                </span>
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    router.push(`/dashboard/agents/chat//688a4859-ec44-8002-9d25-aa1dbf6a790b`);
                  }}
                >
                  <Plus className="h-3 w-3" />
                  Nuevo Chat
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {mockChatSessions.map((session) => (
                    <div key={session.id} className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <div className="font-medium text-sm text-slate-950">{session.title}</div>
                      <div className="text-xs text-slate-700">
                        {session.agent} • {session.messages} mensajes
                      </div>
                      <div className="text-xs text-slate-800 font-semibold">{session.date}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
