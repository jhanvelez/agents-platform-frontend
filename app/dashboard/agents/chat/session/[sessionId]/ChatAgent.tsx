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
import { toasts } from "@/lib/toasts"

// API
import {
  useMessagesSessionQuery,
  useMessageChatSessionMutation,
  useExportChatSessionMutation,
  useCloseChatSessionMutation,
  useChatSessionsQuery,
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

  const scrollRef = useRef<HTMLDivElement | null>(null);

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
          "error",
          (messageChatSessionResult.error as any)?.data?.message,
        )
        return;
      }
    }
  }, [messageChatSessionResult]);

  const [feedbackMessage, feedbackMessageResult] = useFeedbackMessageMutation();

  useEffect(() => {
    if (feedbackMessageResult.isSuccess) {
      toasts.success('Exito', 'Respuesta guardada.')
      refetchMessages();
    }
    if (feedbackMessageResult.isError) {
      toasts.success('Error', 'No se pudo guardar la respuesta.')
    }
  }, [feedbackMessageResult]);

  useEffect(() => {
    if (sessionData && sessionData.isActive === false) {
      toasts.info(
        "Info",
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
  };

  const [exportChat, exportChatResult] = useExportChatSessionMutation();

  useEffect(() => {
    if (exportChatResult.isSuccess) {
      toasts.success(
        "Exito",
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

  const { refetch: refetchSessions } = useChatSessionsQuery({ search: "" });
  
  const [closeSession, closeSessionResult] = useCloseChatSessionMutation();
  useEffect(() => {
    if (closeSessionResult.isSuccess) {
      refetchSessions();
      toasts.success(
        "Exito",
        "La sesión se ha cerrado correctamente."
      );
      router.push('/dashboard/agents');
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
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages.length, messageChatSessionResult.isLoading]);
  

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
        <div className="space-x-1">
          <Button
            size="sm"
            className="gap-1 bg-gray-600 hover:bg-gray-700 "
            onClick={() => {
              closeSession({ sessionId });
            }}
          >
            <XCircle className="h-3 w-3" />
            Terminar
          </Button>
          <Button
            size="sm"
            className="gap-1 bg-green-600 hover:bg-green-700 "
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <FileDown className="h-3 w-3" />
            Exportar
          </Button>
        </div>
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
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 text-sm text-gray-800">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                        li: ({ children }) => <li className="text-sm text-gray-700">{children}</li>,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>

                    <p className="text-xs opacity-70 mt-1">{formatTime(message.time)}</p>

                    {message.sender === "agent" && (
                      <div className="flex items-center gap-2 mt-2 self-start">
                        <Button
                          size="icon"
                          variant={message.liked === true ? "default" : "outline"}
                          className="h-7 w-7"
                          onClick={() =>
                            feedbackMessage({ messageId: message.id, liked: true })
                          }
                          disabled={feedbackMessageResult.isLoading}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant={message.liked === false ? "default" : "outline"}
                          className="h-7 w-7"
                          onClick={() =>
                            feedbackMessage({ messageId: message.id, liked: false })
                          }
                          disabled={feedbackMessageResult.isLoading}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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

            <div ref={scrollRef} />
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
                  disabled={messageChatSessionResult.isLoading || (selectedAgent.monthlyLimit == 0)}
                />
              </div>

              {selectedAgent.monthlyLimit == 0 && (
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

      {/* Modal Crear/Editar */}
      <Formik
        enableReinitialize
        initialValues={exportChatInitialValues}
        validationSchema={exportChatValidationSchema}
        onSubmit={(values, formikHelopers) => {
          exportChat({
            sessionId: sessionId,
            email: values.email,
          });
          
          formikHelopers.resetForm();
          setIsDialogOpen(false);
        }}
      >
        {({ handleSubmit, errors, handleChange, setFieldValue, values }) => {
          return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Exportar Chat</DialogTitle>
                  <DialogDescription>
                    Ingrese el correo al cual se enviará la conversación.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="exportar@bybinary.com.co"
                        error={!!errors.email}
                        textError={errors.email}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!errors} onClick={() => {
                    console.log(errors)
                    handleSubmit();
                  }}>
                    Exportar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        }}
      </Formik>
    </div>
  );
}
