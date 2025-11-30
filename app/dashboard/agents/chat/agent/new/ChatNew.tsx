'use client';

import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react"

import ReactMarkdown from "react-markdown";
import {
  Bot,
  AlertTriangle,
  Send,
  User,
  Loader2,
  Shield,
  Zap,
  Menu,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: number; text: string; sender: "user" | "agent"; time: string }>
  >([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    if (startChatSessionResult.isError) {
      if ((startChatSessionResult.error as any)?.data?.message) {
        toasts.error(
          "error",
          (startChatSessionResult.error as any)?.data?.message
        )
        return;
      }
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

  const getAgentStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <TooltipProvider>
      <div className={`flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[84vh] rounded-xl'
      }`}>
        
        {/* Header Mejorado */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-t-xl">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg flex-shrink-0">
                <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {selectedAgent ? selectedAgent.name : "Chat"}
                </h1>
                {selectedAgent && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs border ${getAgentStatusColor(selectedAgent.isActive)}`}
                    >
                      {selectedAgent.isActive ? "🟢 Activo" : "🔴 Inactivo"}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {selectedAgent.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Fullscreen Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="hidden sm:flex"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Chat Body Mejorado */}
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      ¡Hola! Soy {selectedAgent?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {selectedAgent?.description || 'Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?'}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Seguro
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Rápido
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      } group`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] relative ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md"
                        } rounded-2xl p-4 transition-all duration-200 hover:shadow-xl`}
                      >
                        {/* Message Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1 rounded-full ${
                            message.sender === "user" 
                              ? "bg-blue-500" 
                              : "bg-green-500"
                          }`}>
                            {message.sender === "user" ? (
                              <User className="h-3 w-3 text-white" />
                            ) : (
                              <Bot className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className={`text-xs font-medium ${
                            message.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                          }`}>
                            {message.sender === "user" ? "Tú" : selectedAgent?.name}
                          </span>
                          <span className={`text-xs ${
                            message.sender === "user" ? "text-blue-200" : "text-gray-400 dark:text-gray-500"
                          }`}>
                            {formatTime(message.time)}
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
                              <code className="bg-black/20 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-black/10 dark:bg-white/5 p-3 rounded-lg overflow-x-auto text-xs my-2">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {startChatSessionResult.isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-1 bg-green-500 rounded-full">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
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

        {/* Input Area Mejorada */}
        <div className="border-t border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-b-xl">
          <div className="max-w-4xl mx-auto">
            {selectedAgent ? (
              <>
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Escribe tu mensaje para ${selectedAgent.name}...`}
                      rows={1}
                      className="min-h-[60px] max-h-[120px] resize-none rounded-2xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all pr-12"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={startChatSessionResult.isLoading || selectedAgent.monthlyLimit === 0}
                    />
                    
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim() || startChatSessionResult.isLoading || selectedAgent.monthlyLimit === 0}
                      className="absolute right-2 bottom-2 h-8 w-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                      {startChatSessionResult.isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {selectedAgent.monthlyLimit === 0 && (
                  <Alert className="mt-3 rounded-xl border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-800 dark:text-amber-300">
                      Límite mensual de tokens alcanzado. Contacta al administrador.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert className="rounded-xl border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-300">
                  Chat no disponible: Agente no configurado correctamente
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
