
"use client";
import { useState } from "react"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  MessageSquare,
  Search,
  CalendarIcon,
  MessageSquareIcon,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { Formik } from "formik";
import { es } from "date-fns/locale"

// API
import {
  useAgentsPermittedAccessQuery
} from "@/store/manage-agents/manage-agents.api"
import {
  useChatSessionsQuery,
  useSearchInChatSessionsQuery
} from "@/store/chat/chat.api"

// Schema
import {
  searchInChatSessionsInitialValues,
  searchInChatSessionsValidationSchema,
} from "@/shared/schemas/chat.schema"

//Types
import { Agent } from "@/types/agent"
import { ChatSession } from "@/types/chat-session"

export default function LoginPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: agentsData } = useAgentsPermittedAccessQuery({ });

  const { data: chatSessions } = useChatSessionsQuery({ search: "" });

  const {
    data: resultsChatSessions,
    refetch: refetchSearchInChats,
    isLoading: isLoadingChatSessions,
  } = useSearchInChatSessionsQuery(
    { query: searchQuery },
    {
      skip: searchQuery.trim().length <= 2,
    }
  );

  const handleSearch = (values: { query: string }) => {
    setSearchQuery(values.query);
    refetchSearchInChats();
    console.log("Buscando:", values.query);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agentes IA</h2>
          <p className="text-slate-700">Gestiona y chatea con tus agentes de inteligencia artificial</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lista de Agentes */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-950">
                <Bot className="h-5 w-5" />
                Agentes ByBinary Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agentsData && agentsData.map((agent: Agent) => (
                <div key={agent.id} className="space-y-2">
                  <span className="isolate inline-flex w-full h-auto rounded-xl shadow-md dark:shadow-none">
                    <button
                      disabled={!agent.isActive}
                      className={`
                        relative w-full text-left p-4 rounded-xl border transition-all duration-200
                        ${agent.isActive 
                          ? 'bg-white hover:bg-gray-50 dark:bg-white/10 dark:hover:bg-white/20 border-gray-200 dark:border-gray-700'
                          : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-70'
                        }
                      `}
                      onClick={() => {
                        if (agent.isActive) {
                          router.push(`/dashboard/agents/chat/agent/${agent.id}/new`);
                        }
                      }}
                    >
                      {/* contenido */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col w-2/3">
                          <div className="text-base font-semibold truncate">{agent.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {agent.description}
                          </div>
                          {!agent.isActive && (
                            <div className="mt-1 text-xs font-medium text-red-500">
                              🚫 Este agente está inactivo
                            </div>
                          )}
                        </div>
                        <div className="text-right w-1/3 flex flex-col items-end space-y-1">
                          <Badge
                            variant={agent.isActive ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {agent.tenant.name}
                          </Badge>
                          {agent.isActive ? (
                            <span className="text-xs text-green-600 font-medium">Disponible</span>
                          ) : (
                            <span className="text-xs text-red-500 font-medium">Inactivo</span>
                          )}
                        </div>
                      </div>

                      {/* overlay visual para reforzar el bloqueo */}
                      {!agent.isActive && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-black/40 rounded-xl backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-sm font-semibold text-red-500">Inactivo</span>
                        </div>
                      )}
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
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Search className="h-3 w-3" />
                  Busqueda
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(74vh-64px)]">
                <div className="space-y-2">
                  {chatSessions && chatSessions.map((session: ChatSession) => (
                    <Card
                      key={session.id}
                      className="relative group transition-all hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base font-semibold">
                          <span className="">{session.name}</span>
                          <Badge
                            variant={session.isActive ? "default" : "secondary"}
                            className={session.isActive ? "bg-green-600" : "bg-gray-500"}
                          >
                            {session.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                          Agente: {session.agent.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col space-y-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {session.agent.description}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {String(session.agent.abilities)?.split(",").map((ability: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ability}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {format(new Date(session.createdAt), "PPPp", { locale: es })}
                        </div>

                        <Button
                          variant="default"
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={!session.isActive}
                          onClick={() => router.push(`/dashboard/agents/chat/session/${session.id}`)}
                        >
                          <MessageSquareIcon className="w-4 h-4" />
                          {session.isActive ? "Reabrir chat" : "Finalizado"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Formik
        enableReinitialize
        initialValues={searchInChatSessionsInitialValues}
        validationSchema={searchInChatSessionsValidationSchema}
        onSubmit={(values) => handleSearch(values)}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
              
              {/* 🔹 Barra superior */}
              <div className="p-4 border-b flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="query" className="text-sm font-medium">Buscar en chats</Label>
                  <Input
                    id="query"
                    name="query"
                    placeholder="Escriba algo que recuerde de la conversación..."
                    value={values.query}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    error={!!errors.query}
                    textError={errors.query}
                  />
                </div>
                <Button onClick={() => handleSubmit} disabled={isLoadingChatSessions}>
                  {isLoadingChatSessions ? "Buscando..." : "Buscar"}
                </Button>
              </div>

              {/* 🔸 Resultados */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoadingChatSessions ? (
                  <p className="text-center text-sm text-gray-500">Buscando conversaciones...</p>
                ) : !resultsChatSessions ? (
                  <p className="text-center text-sm text-gray-500">
                    Ingrese al menos 3 caracteres para iniciar la búsqueda.
                  </p>
                ) : resultsChatSessions.length === 0 ? (
                  <p className="text-center text-sm text-gray-500">
                    No se encontraron resultados para esta búsqueda.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {resultsChatSessions.map((chat: any) => (
                      <li
                        key={chat.sessionId}
                        onClick={() => router.push(`/chat/${chat.sessionId}`)}
                        className="border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {chat.agent?.name || "Agente desconocido"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(chat.lastMessageTime).toLocaleString()}
                            </p>
                          </div>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            Sesión #{chat.sessionId.slice(0, 6)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {chat.lastMessage}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Formik>
    </div>
  );
}
