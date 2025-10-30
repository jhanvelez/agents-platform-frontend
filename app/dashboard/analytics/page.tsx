
"use client";

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { CalendarIcon, BarChart3, Clock, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const consultasTendencia = [
  { fecha: "2024-01-08", consultas: 45, exitosas: 42, fallidas: 3 },
  { fecha: "2024-01-09", consultas: 52, exitosas: 48, fallidas: 4 },
  { fecha: "2024-01-10", consultas: 38, exitosas: 35, fallidas: 3 },
  { fecha: "2024-01-11", consultas: 61, exitosas: 58, fallidas: 3 },
  { fecha: "2024-01-12", consultas: 55, exitosas: 51, fallidas: 4 },
  { fecha: "2024-01-13", consultas: 42, exitosas: 39, fallidas: 3 },
  { fecha: "2024-01-14", consultas: 48, exitosas: 45, fallidas: 3 },
  { fecha: "2024-01-15", consultas: 67, exitosas: 63, fallidas: 4 },
];

const tasaExitoPorAgente = [
  { agente: "Agente Soporte", tasa: 0.945 },
  { agente: "Agente Ventas", tasa: 0.918 },
  { agente: "Agente FAQ", tasa: 0.873 },
  { agente: "Agente Técnico", tasa: 0.961 },
];

const distribucionResultados = [
  { tipo: "Exitosas", cantidad: 342, fill: "#22c55e" },
  { tipo: "Fallidas", cantidad: 28, fill: "#ef4444" },
];

const tiemposRespuesta = [
  { hora: "00-02", promedio: 1.2, maximo: 2.1 },
  { hora: "02-04", promedio: 0.8, maximo: 1.5 },
  { hora: "04-06", promedio: 0.9, maximo: 1.8 },
  { hora: "06-08", promedio: 1.8, maximo: 3.2 },
  { hora: "08-10", promedio: 2.1, maximo: 4.1 },
  { hora: "10-12", promedio: 2.8, maximo: 5.2 },
  { hora: "12-14", promedio: 3.2, maximo: 6.1 },
  { hora: "14-16", promedio: 2.9, maximo: 4.8 },
  { hora: "16-18", promedio: 2.5, maximo: 4.2 },
  { hora: "18-20", promedio: 2.1, maximo: 3.8 },
  { hora: "20-22", promedio: 1.8, maximo: 3.1 },
  { hora: "22-00", promedio: 1.4, maximo: 2.6 },
];

// API
import {
  useAgentsQuery
} from "@/store/manage-agents/manage-agents.api"
import {
  useChatAgentAnalyticsQuery
} from "@/store/chat/chat.api"

// Type
import { Agent } from "@/types/agent"

import type { DateRange } from "react-day-picker"

export default function LoginPage() {
  const router = useRouter();

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  })

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
    data: chatsAgentAnalytics,
    refetch: refetchSearchInChats,
    isLoading: isLoadingAgentConversations,
  } = useChatAgentAnalyticsQuery(
    selectedAgent ? { agentId: selectedAgent.id } : skipToken
  );

  const kpiCards = useMemo(() => {
    if (!chatsAgentAnalytics) return [];

    console.log(chatsAgentAnalytics)

    return [
      {
        title: "Total Consultas",
        value: "370",
        change: "+8.2% vs período anterior",
        icon: BarChart3,
        color: "text-blue-600",
      },
      {
        title: "Tasa de Éxito",
        value: "92.4%",
        change: "+1.8% vs período anterior",
        icon: CheckCircle,
        color: "text-green-600",
      },
      {
        title: "Consultas Fallidas",
        value: "28",
        change: "-12% vs período anterior",
        icon: XCircle,
        color: "text-red-600",
      },
      {
        title: "Tiempo Promedio",
        value: "2.1s",
        change: "-0.3s vs período anterior",
        icon: Clock,
        color: "text-orange-600",
      },
    ]
  }, [chatsAgentAnalytics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Análisis de Consultas</h2>
          <p className="text-muted-foreground text-sm">
            Métricas detalladas y tendencias de rendimiento de tus agentes IA
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
          <CardTitle>Filtros de Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
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
              <label className="text-sm font-medium">Rango de Fechas</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
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

            <div className="flex items-end">
              <Button className="w-full">Aplicar Filtros</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tendencia de Consultas */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Consultas</CardTitle>
            <CardDescription>Evolución diaria de consultas exitosas y fallidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                exitosas: {
                  label: "Exitosas",
                  color: "hsl(var(--chart-2))",
                },
                fallidas: {
                  label: "Fallidas",
                  color: "hsl(var(--destructive))",
                },
              }}
              className="h-[290px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consultasTendencia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" tickFormatter={(value) => format(new Date(value), "dd/MM")} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="exitosas"
                    stackId="1"
                    stroke="var(--color-exitosas)"
                    fill="var(--color-exitosas)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="fallidas"
                    stackId="1"
                    stroke="var(--color-fallidas)"
                    fill="var(--color-fallidas)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tasa de Éxito por Agente */}
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Éxito por Agente</CardTitle>
            <CardDescription>Porcentaje de consultas exitosas por agente</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                tasa: {
                  label: "Tasa de Éxito (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[290px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasaExitoPorAgente} layout="horizontal">
                  <CartesianGrid strokeDasharray="6 6" />
                  <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                  <YAxis dataKey="agente" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="tasa" fill="var(--color-tasa)" radius={[0, 4, 4, 0]}
                    name="Tasa de Éxito" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribución de Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Resultados</CardTitle>
            <CardDescription>Proporción de consultas exitosas vs fallidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cantidad: {
                  label: "Cantidad",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionResultados}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="cantidad"
                    label={({ tipo, cantidad, percent }) =>
                      `${tipo}: ${cantidad} (${percent !== undefined ? (percent * 100).toFixed(1) : "0.0"}%)`
                    }
                  >
                    {distribucionResultados.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tiempos de Respuesta */}
        <Card>
          <CardHeader>
            <CardTitle>Tiempos de Respuesta por Hora</CardTitle>
            <CardDescription>Tiempo promedio y máximo de respuesta durante el día</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                promedio: {
                  label: "Tiempo Promedio (s)",
                  color: "hsl(var(--chart-4))",
                },
                maximo: {
                  label: "Tiempo Máximo (s)",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tiemposRespuesta}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="promedio"
                    stroke="var(--color-promedio)"
                    strokeWidth={2}
                    name="Promedio"
                  />
                  <Line
                    type="monotone"
                    dataKey="maximo"
                    stroke="var(--color-maximo)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Máximo"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
