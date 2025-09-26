'use client';

import { useEffect, useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Bot, AlertTriangle } from "lucide-react";

// API
import {
  useMessagesSessionQuery,
  useMessageChatSessionMutation,
} from "@/store/chat/chat.api"

// Type
import { Agent } from '@/types/agent'
import { Message } from "@/types/message";

// Utils
import { formatTime } from "@/utils/dateFormat";

interface ChatClientProps {
  sessionId: string;
};

export default function ChatClient({ sessionId }: ChatClientProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent>();
  const [chatMessage, setChatMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<any[]>([]);

  const { data: sessionData, refetch: refetchMessages } = useMessagesSessionQuery({ sessionId });

  const [messageChatSession, messageChatSessionResult] = useMessageChatSessionMutation();

  // Refrescar mensajes cuando llegan del backend
  useEffect(() => {
    if (messageChatSessionResult.isSuccess) {
      refetchMessages();
    }
  }, [messageChatSessionResult]);

  useEffect(() => {
    if (sessionData) {
      setSelectedAgent(sessionData.agent);
    }
  }, [sessionData]);

  const chatMessages = useMemo(() => {
    if (!sessionData) return [...localMessages];
    return [...sessionData.messages, ...localMessages].map((model: any) => ({
      id: model.id ?? Math.random().toString(),
      text: model.content ?? model.text,
      sender: model.role ?? model.sender,
      time: model.createdAt ?? model.time ?? new Date().toISOString(),
    }));
  }, [sessionData, localMessages]);

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedAgent) return;

    const tempMessage = {
      id: Math.random().toString(),
      text: chatMessage,
      sender: "user",
      time: new Date().toISOString(),
    };

    // Mostrar mensaje del usuario inmediatamente
    setLocalMessages((prev) => [...prev, tempMessage]);

    // Enviar al backend
    messageChatSession({
      sessionId,
      message: chatMessage,
    });

    setChatMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(93vh-50px)] bg-white/30 backdrop-blur-md">
      {/* Header */}
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
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{formatTime(message.time)}</p>
                  </div>
                </div>
              ))
            )}

            {/* Loader cuando el bot está respondiendo */}
            {messageChatSessionResult.isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg text-sm animate-pulse">
                  Estoy pensando dame un momento...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Box (fuera del scroll, siempre visible abajo) */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-4">
        <Card
          className="p-4 border border-white/20  bg-white/30 backdrop-blur-md shadow-lg rounded-2xl"
        >
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
            />
          </div>

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
