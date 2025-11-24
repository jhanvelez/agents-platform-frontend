'use client';

import { useEffect, useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation";
import { Formik } from "formik";

import ReactMarkdown from "react-markdown";
import {
  Bot,
  AlertTriangle,
  XCircle,
  FileDown,
  ThumbsUp,
  ThumbsDown,
  Send,
  User,
  Copy,
  CheckCircle2,
  Loader2,
  Shield,
  Zap,
  Menu,
  Maximize2,
  Minimize2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toasts } from "@/lib/toasts"

// API
import {
  useMessagesSessionQuery,
  useMessageChatSessionMutation,
  useExportChatSessionMutation,
  useCloseChatSessionMutation,
} from "@/store/chat/chat.api"
import {
  useFeedbackMessageMutation
} from "@/store/chat/chat-message.api"

// Type
import { Agent } from '@/types/agent'

// Utils
import { formatTime } from "@/utils/dateFormat";

// Schema
import {
  exportChatInitialValues,
  exportChatValidationSchema,
} from "@/shared/schemas/chat.schema";

interface ChatClientProps {
  sessionId: string;
};

export default function ChatClient({ sessionId }: ChatClientProps) {
  const router = useRouter();
  const [chatMessage, setChatMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent>();
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: sessionData, refetch: refetchMessages } = useMessagesSessionQuery({ sessionId });

  const [messageChatSession, messageChatSessionResult] = useMessageChatSessionMutation();

  useEffect(() => {
    if (messageChatSessionResult.isSuccess) {
      setLocalMessages([]);
      refetchMessages();
    }

    if (messageChatSessionResult.isError) {
      if ((messageChatSessionResult.error as any)?.data) {
        toasts.warning(
          "Error",
          (messageChatSessionResult.error as any)?.data?.message,
        )
        return;
      }
    }
  }, [messageChatSessionResult]);

  const [feedbackMessage, feedbackMessageResult] = useFeedbackMessageMutation();

  useEffect(() => {
    if (feedbackMessageResult.isSuccess) {
      toasts.success('Éxito', 'Feedback guardado correctamente.')
      refetchMessages();
    }
    if (feedbackMessageResult.isError) {
      toasts.error('Error', 'No se pudo guardar el feedback.')
    }
  }, [feedbackMessageResult]);

  useEffect(() => {
    if (sessionData && sessionData.isActive === false) {
      toasts.info(
        "Información",
        "La sesión de chat está cerrada. No se pueden enviar más mensajes."
      );
      router.push('/dashboard/agents');
    }
  
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
      liked: model.liked
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
    
    // Auto-focus después de enviar
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleCopyMessage = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toasts.success("Éxito", "Mensaje copiado al portapapeles");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      toasts.error("Error", "No se pudo copiar el mensaje");
    }
  };

  const [exportChat, exportChatResult] = useExportChatSessionMutation();

  useEffect(() => {
    if (exportChatResult.isSuccess) {
      toasts.success(
        "Éxito",
        "Se ha enviado el correo exitosamente."
      );
      setIsDialogOpen(false);
    }

    if (exportChatResult.error) {
      toasts.error(
        "Error",
        "No se ha podido exportar el chat correctamente."
      );
      setIsDialogOpen(false);
    }
  }, [exportChatResult]);
  
  const [closeSession, closeSessionResult] = useCloseChatSessionMutation();
  useEffect(() => {
    if (closeSessionResult.isSuccess) {
      toasts.success(
        "Éxito",
        "La sesión se ha cerrado correctamente."
      );
      window.close();
    }

    if (closeSessionResult.error) {
      toasts.error(
        "Error",
        "No se ha podido cerrar la sesión correctamente."
      );
    }
  }, [closeSessionResult]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatMessages.length, messageChatSessionResult.isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [chatMessage]);

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

            {/* Mobile Actions Menu */}
            {(isMobileMenuOpen || window.innerWidth >= 1024) && (
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={() => closeSession({ sessionId })}
                      disabled={closeSessionResult.isLoading}
                    >
                      Terminar chat
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Cerrar sesión de chat
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <FileDown className="h-4 w-4" />
                      <span className="hidden sm:inline">Exportar</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Exportar conversación
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
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

                        {/* Message Actions */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20 dark:border-gray-600">
                          {message.sender === "agent" && (
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant={message.liked === true ? "default" : "ghost"}
                                    className={`h-6 w-6 ${
                                      message.liked === true 
                                        ? "bg-green-500 hover:bg-green-600" 
                                        : "hover:bg-white/20"
                                    }`}
                                    onClick={() => feedbackMessage({ messageId: message.id, liked: true })}
                                    disabled={feedbackMessageResult.isLoading}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Útil
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant={message.liked === false ? "default" : "ghost"}
                                    className={`h-6 w-6 ${
                                      message.liked === false 
                                        ? "bg-red-500 hover:bg-red-600" 
                                        : "hover:bg-white/20"
                                    }`}
                                    onClick={() => feedbackMessage({ messageId: message.id, liked: false })}
                                    disabled={feedbackMessageResult.isLoading}
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  No útil
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )}

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${
                                  message.sender === "user" 
                                    ? "hover:bg-white/20" 
                                    : "hover:bg-black/10 dark:hover:bg-white/10"
                                }`}
                                onClick={() => handleCopyMessage(message.text, message.id)}
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
                  {messageChatSessionResult.isLoading && (
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
                      disabled={messageChatSessionResult.isLoading || selectedAgent.monthlyLimit === 0}
                    />
                    
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim() || messageChatSessionResult.isLoading || selectedAgent.monthlyLimit === 0}
                      className="absolute right-2 bottom-2 h-8 w-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                      {messageChatSessionResult.isLoading ? (
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

        {/* Export Dialog */}
        <Formik
          enableReinitialize
          initialValues={exportChatInitialValues}
          validationSchema={exportChatValidationSchema}
          onSubmit={(values, formikHelpers) => {
            exportChat({
              sessionId: sessionId,
              email: values.email,
            });
            
            formikHelpers.resetForm();
          }}
        >
          {({ handleSubmit, errors, handleChange, values }) => (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileDown className="h-5 w-5" />
                    Exportar Conversación
                  </DialogTitle>
                  <DialogDescription>
                    Ingresa tu correo electrónico para recibir el historial completo del chat.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Correo Electrónico *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      error={!!errors.email}
                      textError={errors.email}
                      className="w-full"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    disabled={exportChatResult.isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => handleSubmit()}
                    disabled={exportChatResult.isLoading || !!errors.email}
                    className="gap-2"
                  >
                    {exportChatResult.isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4" />
                    )}
                    {exportChatResult.isLoading ? 'Exportando...' : 'Exportar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </Formik>
      </div>
    </TooltipProvider>
  );
}