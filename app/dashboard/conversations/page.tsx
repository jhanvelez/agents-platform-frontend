"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import Datepicker from "react-tailwindcss-datepicker";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Search,
  Filter,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Conversation {
  id: string;
  agent: string;
  question: string;
  response: string;
  duration: number;
  success: boolean;
  date: string;
}

const resultOptions = [
  { value: "all", label: "Todos" },
  { value: "success", label: "Exitoso" },
  { value: "failed", label: "Fallido" },
];

// API
import {
  useAgentsQuery,
} from "@/store/manage-agents/manage-agents.api";
import {
  useChatAgentConversationsQuery,
} from "@/store/chat/chat.api";

// Type
import { Agent } from "@/types/agent";

interface DateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}

export default function ConversationsHistoryPage() {
  const router = useRouter();

  // Estados
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [selectedResult, setSelectedResult] = useState<string>("all");
  const [dateValue, setDateValue] = useState<DateRangeValue>({
    startDate: null,
    endDate: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Consultas a la API
  const { 
    data: agentsData, 
    isLoading: isLoadingAgents,
    error: agentsError 
  } = useAgentsQuery({ search: "" });

  const agents = useMemo(() => {
    if (!agentsData) return [];
    return agentsData.map((agent: Agent) => ({
      id: agent.id,
      name: agent.name,
    }));
  }, [agentsData]);

  const {
    data: agentConversations,
    refetch: refetchConversations,
    isLoading: isLoadingConversations,
    isFetching: isFetchingConversations,
    error: conversationsError,
  } = useChatAgentConversationsQuery(
    selectedAgent !== "all" || searchTerm || dateValue.startDate
      ? {
          agentId: selectedAgent !== "all" ? selectedAgent : undefined,
          search: searchTerm || undefined,
          startDate: dateValue.startDate ? dateValue.startDate.toISOString() : undefined,
          endDate: dateValue.endDate ? dateValue.endDate.toISOString() : undefined,
          result: selectedResult !== "all" ? selectedResult : undefined,
        }
      : skipToken
  );

  // Filtrar conversaciones localmente si es necesario
  const filteredConversations = useMemo(() => {
    if (!agentConversations) return [];
    
    let filtered = [...agentConversations];

    // Filtrar por resultado si no se filtró en la API
    if (selectedResult !== "all") {
      const isSuccess = selectedResult === "success";
      filtered = filtered.filter((conv: Conversation) => conv.success === isSuccess);
    }

    return filtered;
  }, [agentConversations, selectedResult]);

  // Aplicar filtros y recargar datos
  const applyFilters = () => {
    if (selectedAgent !== "all" || searchTerm || dateValue.startDate) {
      refetchConversations();
    } else {
      setForceRefresh(prev => prev + 1);
    }
    setCurrentPage(1);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSelectedAgent("all");
    setSelectedResult("all");
    setDateValue({ startDate: null, endDate: null });
    setSearchTerm("");
    setCurrentPage(1);
    setForceRefresh(prev => prev + 1);
  };

  // Manejar cambio de fecha
  const handleDateChange = (newValue: any) => {
    setDateValue(newValue);
  };

  // Paginación
  const totalItems = filteredConversations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedConversations = filteredConversations.slice(startIndex, endIndex);

  // Renderizado condicional de carga
  if (isLoadingAgents) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Historial de Conversaciones
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Revisa todas las interacciones entre usuarios y agentes IA
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => refetchConversations()}
                disabled={isLoadingConversations}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingConversations ? 'animate-spin' : ''}`} />
                {isLoadingConversations ? 'Actualizando...' : 'Refrescar Lista'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Actualizar datos de conversaciones</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Alertas de error */}
      {conversationsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error al cargar las conversaciones. Intenta nuevamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-500" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Buscar */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar en conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
              </div>
            </div>

            {/* Filtrar por Agente */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filtrar por Agente</Label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los agentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los agentes</SelectItem>
                  {agents.map((agent: Agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtrar por Resultado */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filtrar por Resultado</Label>
              <Select value={selectedResult} onValueChange={setSelectedResult}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los resultados" />
                </SelectTrigger>
                <SelectContent>
                  {resultOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rango de Fechas con react-tailwindcss-datepicker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Rango de Fechas
              </Label>
              <Datepicker
                value={dateValue}
                onChange={handleDateChange}
                primaryColor="blue"
                separator="a"
                displayFormat="DD/MM/YYYY"
                placeholder="Seleccionar fechas"
                i18n="es"
                showShortcuts={true}
                configs={{
                  shortcuts: {
                    today: "Hoy",
                    yesterday: "Ayer",
                    past: (period: number) => `Últimos ${period} días`,
                    currentMonth: "Este mes",
                    pastMonth: "Mes pasado",
                  },
                }}
                containerClassName="relative"
                inputClassName="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                toggleClassName="absolute right-3 top-1/2 transform -translate-y-1/2"
                popoverDirection="down"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={applyFilters} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Filter className="h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              Limpiar Filtros
            </Button>
            
            {/* Selector de items por página */}
            <div className="flex items-center gap-2 ml-auto">
              <Label className="text-sm text-muted-foreground">Mostrar:</Label>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Exitosas: {filteredConversations.filter(c => c.success).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span>Fallidas: {filteredConversations.filter(c => !c.success).length}</span>
            </div>
            <div>Total: {totalItems} conversaciones</div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Conversaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Conversaciones ({totalItems})
            {isLoadingConversations && (
              <span className="text-sm text-muted-foreground ml-2">
                <RefreshCw className="h-3 w-3 animate-spin inline mr-1" />
                Cargando...
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Lista paginada de todas las consultas procesadas
            {dateValue.startDate && dateValue.endDate && (
              <span className="ml-2">
                • Del {format(dateValue.startDate, "dd/MM/yyyy")} al {format(dateValue.endDate, "dd/MM/yyyy")}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingConversations ? (
            // Skeletons mientras carga
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : totalItems === 0 ? (
            // Estado vacío
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron conversaciones</h3>
              <p className="text-muted-foreground mb-4">
                {selectedAgent !== "all" || searchTerm || dateValue.startDate
                  ? "Intenta con otros filtros de búsqueda"
                  : "No hay conversaciones registradas en este momento"}
              </p>
              {(selectedAgent !== "all" || searchTerm || dateValue.startDate) && (
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">ID Sesión</TableHead>
                      <TableHead>Agente</TableHead>
                      <TableHead>Pregunta</TableHead>
                      <TableHead>Respuesta</TableHead>
                      <TableHead className="w-[100px]">Duración</TableHead>
                      <TableHead className="w-[100px]">Resultado</TableHead>
                      <TableHead className="w-[150px]">Fecha y Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedConversations.map((conversation: Conversation) => (
                      <TableRow 
                        key={conversation.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          // Aquí podrías navegar a un detalle de conversación
                          console.log("Ver detalles:", conversation.id);
                        }}
                      >
                        <TableCell className="font-mono text-xs">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="truncate block max-w-[100px]">
                                  {conversation.id.substring(0, 8)}...
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{conversation.id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {conversation.agent}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <p className="truncate font-medium">
                                  {conversation.question}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[300px]">
                                <p>{conversation.question}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <p className="truncate text-muted-foreground">
                                  {conversation.response}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[400px]">
                                <p>{conversation.response}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              conversation.duration > 5 ? "destructive" : 
                              conversation.duration > 3 ? "outline" : "secondary"
                            }
                          >
                            {conversation.duration.toFixed(1)}s
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {conversation.success ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <Badge variant="default" className="bg-green-50 text-green-700 hover:bg-green-50">
                                  Exitoso
                                </Badge>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <Badge variant="destructive">
                                  Fallido
                                </Badge>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(conversation.date), "dd/MM/yyyy HH:mm", { locale: es })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Mostrando <span className="font-semibold">{startIndex + 1}</span> a{" "}
                    <span className="font-semibold">{Math.min(endIndex, totalItems)}</span> de{" "}
                    <span className="font-semibold">{totalItems}</span> conversaciones
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-8 h-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>Última actualización: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}</p>
        <p className="mt-1">Los datos se actualizan automáticamente cada 5 minutos</p>
      </div>
    </div>
  );
}