'use client';

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, AlertTriangle } from "lucide-react";

interface ChatClientProps {
  agentId: string;
};

// API
import {
  useAgentQuery,
} from "@/store/manage-agents/manage-agents.api"
import {
  useStartChatSessionMutation,
} from "@/store/chat/chat.api"

// Type
import {
  Agent
} from '@/types/agent'
import { toasts } from '@/lib/toasts'

// Utils
import { formatTime } from "@/utils/dateFormat";

export default function ChatClient({ agentId }: ChatClientProps) {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<Agent>();
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: number; text: string; sender: "user" | "agent"; time: string }>
  >([]);

  const {
    data: agentData,
    error: errorAgent,
    isFetching: isFetchingAgent,
  } = useAgentQuery({ id: agentId });
  const [startChatSession, startChatSessionResult] = useStartChatSessionMutation();

  useEffect(() => {
    if (startChatSessionResult.isSuccess) {
      router.push(`/dashboard/agents/chat/agent/${startChatSessionResult.data.sessionId}`);
    }
  }, [startChatSessionResult])

  useEffect(() => {
    if (agentData) {

      const cleanText = agentData.initialMessage.replace(/[{}]/g, '');

      const parts = cleanText
        .split('","')
        .map((p: any) => p.replace(/(^"|"$)/g, '').trim());

      const finalMessage = parts.join(', ');

      const newMessage = {
        id: Date.now(),
        text: finalMessage,
        sender: "agent" as const,
        time: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, newMessage]);

      setSelectedAgent(agentData);
    }
  }, [agentData])

  useEffect(() => {
    if (errorAgent) {
      if ( (errorAgent as any) ) {
        if ((errorAgent as any)?.data) {
          toasts.error(
            "error",
            (errorAgent as any)?.data?.message || "Error al cargar el agente."
          );
          router.push('/dashboard/agents');
          return;
        }
      }
    }
  }, [errorAgent]);

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedAgent) return;

    startChatSession({
      agentId: selectedAgent.id,
      message: chatMessage,
    });

    const newMessage = {
      id: Date.now(),
      text: chatMessage,
      sender: "user" as const,
      time: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatMessage("");
  };

  return (
        <div className="flex flex-col h-[calc(84vh-10px)] bg-white/30 backdrop-blur-md">
      {/* Header */}
      <CardTitle className="flex items-center justify-between">
        <CardHeader className="py-1">
          <CardTitle>
            {selectedAgent ? `Chat con: ${selectedAgent.name}` : "Selecciona un agente"}
          </CardTitle>
          {selectedAgent && (
            <CardDescription>
              {selectedAgent.description} • Estado:{" "}
              {selectedAgent.isActive ? "Activo" : "Inactivo"}
            </CardDescription>
          )}
        </CardHeader>
      </CardTitle>

      {/* Chat Body con scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 py-6 max-w-3xl mx-auto">
            {chatMessages.length === 0 ? (
              <div className="text-center text-slate-700 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                {selectedAgent && <p>Inicia una conversación con {selectedAgent.name}</p>}
              </div>
            ) : (
              chatMessages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg flex flex-col ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-white shadow-md"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Box (fuera del scroll, siempre visible abajo) */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-0">
        <Card
          className="p-4 border border-white/20  bg-white/30 backdrop-blur-md shadow-lg rounded-2xl"
        >
          {selectedAgent ? (
            <>
              <div className="flex items-end gap-3">
                <Textarea
                  required
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  rows={2}
                  className="flex-1 resize-none rounded-xl border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={(selectedAgent.monthlyTokenLimit == 0)}
                />
              </div>

              {selectedAgent.monthlyTokenLimit == 0 && (
                <Alert className="mt-3 rounded-xl">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Límite mensual de tokens excedido.
                  </AlertDescription>
                </Alert>
              )}
            </>
          ): null}

          {!selectedAgent?.url && (
            <Alert className="mt-3 rounded-xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Chat deshabilitado: LLM no configurado
              </AlertDescription>
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
}
