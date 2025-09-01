'use client';

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Send, AlertTriangle } from "lucide-react";

interface ChatClientProps {
  chatId: string;
}

const mockAgents = [
  {
    id: 1,
    name: "Agente Soporte",
    description: "Asistente para consultas de soporte técnico",
    status: "active",
    chatUrl: "https://n8n.example.com/webhook/chat/support",
    lastActive: "2024-01-15 10:30",
  },
  {
    id: 2,
    name: "Agente Ventas",
    description: "Especialista en consultas comerciales",
    status: "active",
    chatUrl: "",
    lastActive: "2024-01-15 09:15",
  },
  {
    id: 3,
    name: "Agente FAQ",
    description: "Responde preguntas frecuentes",
    status: "inactive",
    chatUrl: "https://n8n.example.com/webhook/chat/faq",
    lastActive: "2024-01-14 16:45",
  },
];

export default function ChatClient({ chatId }: ChatClientProps) {
  const [selectedAgent, setSelectedAgent] = useState<typeof mockAgents[0] | null>(mockAgents[0]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: number; text: string; sender: "user" | "agent"; time: string }>
  >([]);

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedAgent) return;

    const newMessage = {
      id: Date.now(),
      text: chatMessage,
      sender: "user" as const,
      time: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatMessage("");

    setTimeout(() => {
      const agentResponse = {
        id: Date.now() + 1,
        text: `Respuesta de ${selectedAgent.name}: "${chatMessage}" recibida. Elaborando respuesta contextual.`,
        sender: "agent" as const,
        time: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, agentResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="">
        <CardHeader>
          <CardTitle>{selectedAgent ? `Chat con ${selectedAgent.name}` : "Selecciona un agente"}</CardTitle>
          {selectedAgent && (
            <CardDescription>
              {selectedAgent.description} • Estado: {selectedAgent.status === "active" ? "Activo" : "Inactivo"}
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
                {selectedAgent && (
                  <p>Inicia una conversación con {selectedAgent.name}</p>
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
          {!selectedAgent?.chatUrl && (
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
