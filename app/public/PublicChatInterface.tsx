"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  Send,
  User,
  Copy,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toasts } from "@/lib/toasts";

// Utils
import { formatTime } from "@/utils/dateFormat";

interface PublicChatInterfaceProps {
  publicSlug: string;
  sessionId: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

interface PublicConfig {
  id: string;
  agent: {
    id: string;
    name: string;
    description?: string;
  };
  customWelcomeMessage?: string;
}

export default function PublicChatInterface({ publicSlug, sessionId }: PublicChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cargar configuración y mensajes existentes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar configuración
        const configResponse = await fetch(`/api/public-chat/config/${publicSlug}`);
        if (configResponse.ok) {
          const configData = await configResponse.json();
          setConfig(configData);
        }

        // Cargar mensajes existentes
        const messagesResponse = await fetch(`/api/public-chat/session/${sessionId}/messages`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);
        }
      } catch (error) {
        toasts.error("Error", "No se pudo cargar el chat");
      }
    };

    loadData();
  }, [publicSlug, sessionId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    // Mostrar mensaje del usuario inmediatamente
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/public-chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          content: inputMessage,
        }),
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: messageData.reply,
          role: 'assistant',
          createdAt: new Date().toISOString(),
        }]);
      } else {
        toasts.error("Error", "No se pudo enviar el mensaje");
      }
    } catch (error) {
      toasts.error("Error", "Error de conexión");
    } finally {
      setIsLoading(false);
    }

    // Auto-focus después de enviar
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleCopyMessage = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toasts.success("Éxito", "Mensaje copiado");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      toasts.error("Error", "No se pudo copiar el mensaje");
    }
  };

  // Auto-scroll al final
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {config.agent.name}
                </h1>
                <p className="text-sm text-gray-600 truncate">
                  {config.agent.description || "Chat en vivo"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Bot className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      ¡Hola! Soy {config.agent.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {config.agent.description || 'Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?'}
                    </p>
                    {config.customWelcomeMessage && (
                      <p className="text-sm text-gray-500 italic">
                        {config.customWelcomeMessage}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      } group`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] relative ${
                          message.role === "user"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white border border-gray-200 shadow-md"
                        } rounded-2xl p-4 transition-all duration-200 hover:shadow-xl`}
                      >
                        {/* Message Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1 rounded-full ${
                            message.role === "user" 
                              ? "bg-blue-500" 
                              : "bg-green-500"
                          }`}>
                            {message.role === "user" ? (
                              <User className="h-3 w-3 text-white" />
                            ) : (
                              <Bot className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className={`text-xs font-medium ${
                            message.role === "user" ? "text-blue-100" : "text-gray-500"
                          }`}>
                            {message.role === "user" ? "Tú" : config.agent.name}
                          </span>
                          <span className={`text-xs ${
                            message.role === "user" ? "text-blue-200" : "text-gray-400"
                          }`}>
                            {formatTime(message.createdAt)}
                          </span>
                        </div>

                        {/* Message Content */}
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            code: ({ children }) => (
                              <code className="bg-black/20 px-1.5 py-0.5 rounded text-xs">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-black/10 p-3 rounded-lg overflow-x-auto text-xs my-2">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>

                        {/* Copy Button */}
                        <div className="flex justify-end mt-2 pt-2 border-t border-white/20">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  message.role === "user" 
                                    ? "hover:bg-white/20" 
                                    : "hover:bg-black/10"
                                }`}
                                onClick={() => handleCopyMessage(message.content, message.id)}
                              >
                                {copiedMessageId === message.id ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedMessageId === message.id ? "Copiado" : "Copiar mensaje"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-1 bg-green-500 rounded-full">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-sm text-gray-600">
                              Escribiendo...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={scrollRef} />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Escribe tu mensaje para ${config.agent.name}...`}
                  rows={1}
                  className="min-h-[60px] max-h-[120px] resize-none rounded-2xl border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all pr-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-2 bottom-2 h-8 w-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}