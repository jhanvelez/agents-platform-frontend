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
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="">
        <CardHeader>
          <CardTitle>{selectedAgent ? `Chat con: ${selectedAgent.name}` : "Selecciona un agente"}</CardTitle>
          {selectedAgent && (
            <CardDescription>
              {selectedAgent.description} • Estado: {selectedAgent.isActive ? "Activo" : "Inactivo"}
            </CardDescription>
          )}
        </CardHeader>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 pb-24">
            {chatMessages.length === 0 ? (
              <div className="text-center text-slate-700 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                {selectedAgent?.url && (
                  <p>Inicia una conversación con {selectedAgent.name}</p>
                )}
                {isFetchingAgent && (
                  <div className="mt-3 w-full flex justify-center">
                    <div className="w-full max-w-md p-4 rounded-xl bg-muted shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-slate-600 rounded-full typing-dot" style={{ animationDelay: '0s' }} />
                          <span className="w-2.5 h-2.5 bg-slate-600 rounded-full typing-dot" style={{ animationDelay: '0.12s' }} />
                          <span className="w-2.5 h-2.5 bg-slate-600 rounded-full typing-dot" style={{ animationDelay: '0.24s' }} />
                        </div>
                        <div className="text-xs text-slate-700 opacity-85">
                          Verificando agente... Por favor espera
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
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

      {/* Input Box (Fijo abajo) */}
      <div className="mt-auto fixed bottom-6 right-40 w-[45rem] rounded-xl ">
        <Card className="p-4 border bg-white shadow-lg">
          <div className="flex gap-2 items-end">
            <Textarea
              required
              value={chatMessage}
              disabled={isFetchingAgent}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              rows={3}
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          {!selectedAgent?.url || isFetchingAgent && (
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Chat deshabilitado: LLM no configurado</AlertDescription>
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
}
