
"use client";
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  CalendarIcon,
  Search,
  Filter,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Conversation {
  id: string
  agent: string
  question: string
  response: string
  duration: number
  success: boolean
  date: string
}

const resultOptions = ["Todos", "Exitoso", "Fallido"]

import type { DateRange } from "react-day-picker"

// API
import {
  useAgentsQuery
} from "@/store/manage-agents/manage-agents.api"
import {
  useChatAgentConversationsQuery
} from "@/store/chat/chat.api"

// Type
import { Agent } from "@/types/agent"

export default function LoginPage() {
  const router = useRouter();

  const [conversations] = useState<Conversation[]>();
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedResult, setSelectedResult] = useState("Todos")

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: agentsData } = useAgentsQuery({ search: "" });

  const agents = useMemo(() => {
    if (!agentsData) return [];

    return agentsData.map((agent: Agent) => {
      return {
        id: agent.id,
        name: agent.name
      };
    });
  }, [agentsData]);


  const {
    data: agentConversations,
    refetch: refetchSearchInChats,
    isLoading: isLoadingAgentConversations,
  } = useChatAgentConversationsQuery(
    selectedAgent ? { agentId: selectedAgent.id, search: searchTerm } : skipToken
  );

  useEffect(() => {
    if (agentConversations) {
      setFilteredConversations(agentConversations);
    }
  }, [agentConversations]);

  const applyFilters = () => {
    if (!conversations) return [];
    let filtered = conversations

    if (selectedResult !== "Todos") {
      const isSuccess = selectedResult === "Exitoso"
      filtered = filtered.filter((conv) => conv.success === isSuccess)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (conv) =>
          conv.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (dateRange?.from) {
      filtered = filtered.filter((conv) => {
        const convDate = new Date(conv.date)
        return convDate >= dateRange.from!
      })
    }

    if (dateRange?.to) {
      filtered = filtered.filter((conv) => {
        const convDate = new Date(conv.date)
        return convDate <= dateRange.to!
      })
    }

    setFilteredConversations(filtered)
    setCurrentPage(1)
  }
  
  const totalPages = filteredConversations ? Math.ceil(filteredConversations.length / itemsPerPage) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Historial de Conversaciones</h2>
          <p className="text-muted-foreground text-sm">
            Revisa todas las interacciones entre usuarios y agentes IA
          </p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Refrescar Lista
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar en conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por Agente</label>
              <Select value={selectedAgent ? selectedAgent.id : ""} onValueChange={(value) => {
                setSelectedAgent(agents.filter((agent: Agent) => agent.id == value)[0]);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent: Agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por Resultado</label>
              <Select value={selectedResult} onValueChange={setSelectedResult}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resultOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Rango de Fechas</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: es })
                      )
                    ) : (
                      <span className="text-muted-foreground">Seleccionar fechas</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-2 mt-2 bg-white border rounded-xl shadow-xl z-[9999]"
                  align="start"
                  sideOffset={4}
                >
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="rounded-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters}>Aplicar Filtros</Button>
            <Button
              variant="outline"
              onClick={() => {
                setDateRange(undefined)
                setSelectedResult("Todos")
                setSearchTerm("")
                setFilteredConversations(conversations)
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Conversaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversaciones ({filteredConversations ? filteredConversations.length : 0})
          </CardTitle>
          <CardDescription>Lista paginada de todas las consultas procesadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Sesión</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Pregunta</TableHead>
                <TableHead>Respuesta</TableHead>
                <TableHead>Tiempo (s)</TableHead>
                <TableHead>Éxito</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentConversations && agentConversations.map((conversation: Conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell className="font-mono text-sm">{conversation.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{conversation.agent}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={conversation.question}>
                      {conversation.question}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="truncate" title={conversation.response}>
                      {conversation.response}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={conversation.duration > 3 ? "destructive" : "secondary"}>
                      {conversation.duration}s
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={conversation.success ? "default" : "destructive"}>
                      {conversation.success ? "Exitoso" : "Fallido"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(conversation.date).toLocaleString("es-ES")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredConversations ? filteredConversations.length : 0)} de {filteredConversations ? filteredConversations.length : 0}{" "}
                conversaciones
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
