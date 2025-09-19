'use client';

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, AlertTriangle } from "lucide-react";

interface ChatClientProps {
  sessionId: string;
};

// API
import {
  useMessagesSessionQuery,
  useMessageChatSessionMutation,
} from "@/store/chat/chat.api"

// Type
import { Agent } from '@/types/agent'
import { Message } from "@/types/message";

export default function ChatClient({ sessionId }: ChatClientProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent>();
  const [chatMessage, setChatMessage] = useState("");

  const { data: sessionData, refetch: refetchMessages } = useMessagesSessionQuery({ sessionId });

  const [messageChatSession, messageChatSessionResult] = useMessageChatSessionMutation();

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
    if (!sessionData) return [];

    return sessionData.messages.map((model: Message) => {
      return {
        id: model.id,
        text: model.content,
        sender: model.role,
        time: model.createdAt,
      }
    })
  }, [sessionData]);

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedAgent) return;
    messageChatSession({
      sessionId,
      message: chatMessage,
    })
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
      <div className="flex-1 overflow-hidden pb-32">
        <ScrollArea className="h-full">
          <div className="space-y-4 pb-24">
            {chatMessages.length === 0 ? (
              <div className="text-center text-slate-700 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                {selectedAgent && (
                  <p>Inicia una conversación con {selectedAgent.name}</p>
                )}
              </div>
            ) : (
              chatMessages.map((message: any) => (
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
          {!selectedAgent?.url && (
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
