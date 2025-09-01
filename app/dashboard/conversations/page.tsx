
"use client";
import { useRouter } from "next/navigation";

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Filter, MessageSquare, RefreshCw } from "lucide-react"
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

const mockConversations: Conversation[] = [
  {
    id: "SESS-001",
    agent: "Agente Soporte",
    question: "¿Cómo puedo resetear mi contraseña?",
    response: "Para resetear tu contraseña, ve a la página de login y haz clic en 'Olvidé mi contraseña'...",
    duration: 2.3,
    success: true,
    date: "2024-01-15 10:30:15",
  },
  {
    id: "SESS-002",
    agent: "Agente Ventas",
    question: "¿Cuáles son los precios de sus planes?",
    response: "Tenemos tres planes disponibles: Básico ($29/mes), Pro ($79/mes) y Enterprise ($199/mes)...",
    duration: 1.8,
    success: true,
    date: "2024-01-15 09:15:22",
  },
  {
    id: "SESS-003",
    agent: "Agente FAQ",
    question: "¿Tienen soporte 24/7?",
    response: "Lo siento, no pude encontrar información específica sobre nuestro horario de soporte...",
    duration: 4.1,
    success: false,
    date: "2024-01-14 16:45:33",
  },
  {
    id: "SESS-004",
    agent: "Agente Soporte",
    question: "Mi aplicación no se conecta a internet",
    response:
      "Vamos a revisar tu configuración de red. Primero, verifica que tu conexión a internet esté funcionando...",
    duration: 3.2,
    success: true,
    date: "2024-01-14 14:20:10",
  },
  {
    id: "SESS-005",
    agent: "Agente Ventas",
    question: "¿Ofrecen descuentos para estudiantes?",
    response: "Sí, ofrecemos un 50% de descuento para estudiantes con identificación válida...",
    duration: 1.5,
    success: true,
    date: "2024-01-13 11:30:45",
  },
]

const agents = ["Todos", "Agente Soporte", "Agente Ventas", "Agente FAQ"]
const resultOptions = ["Todos", "Exitoso", "Fallido"]

import type { DateRange } from "react-day-picker"


export default function LoginPage() {
  const router = useRouter();

    const [conversations] = useState<Conversation[]>(mockConversations)
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(mockConversations)
    const [selectedAgent, setSelectedAgent] = useState("Todos")
    const [selectedResult, setSelectedResult] = useState("Todos")
  
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
  
    const applyFilters = () => {
      let filtered = conversations
  
      if (selectedAgent !== "Todos") {
        filtered = filtered.filter((conv) => conv.agent === selectedAgent)
      }
  
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
  
    const paginatedConversations = filteredConversations.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    )
  
    const totalPages = Math.ceil(filteredConversations.length / itemsPerPage)

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
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent} value={agent}>
                      {agent}
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
              <label className="text-sm font-medium">Rango de Fechas</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange && dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: es })
                      )
                    ) : (
                      "Seleccionar fechas"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
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
            Conversaciones ({filteredConversations.length})
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
              {paginatedConversations.map((conversation) => (
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
                {Math.min(currentPage * itemsPerPage, filteredConversations.length)} de {filteredConversations.length}{" "}
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
