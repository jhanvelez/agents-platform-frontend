"use client";

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  RefreshCw,
  Download,
  Filter,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Users,
  MessageSquare,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Tooltip,
  Legend,
} from "recharts"
import { CalendarIcon } from "lucide-react"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { es } from "date-fns/locale"

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

export default function AnalyticsPage() {
  const router = useRouter();

  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("overview");

  const { data: agentsData } = useAgentsQuery({ search: "" });

  const agents = useMemo(() => {
    if (!agentsData) return [];
    return agentsData.map((agent: Agent) => ({
      id: agent.id,
      name: agent.name
    }));
  }, [agentsData]);

  const {
    data: analyticsData,
    refetch: refetchAnalytics,
    isLoading: isLoadingAnalytics,
  } = useChatAgentAnalyticsQuery(
    selectedAgent !== "all" ? { 
      agentId: selectedAgent,
      startDate: dateRange?.from?.toISOString(),
      endDate: dateRange?.to?.toISOString()
    } : skipToken
  );

  // Transformar datos para las gráficas
  const chartData = useMemo(() => {
    if (!analyticsData) return {
      trendData: [],
      successByAgent: [],
      resultDistribution: [],
      hourlyStats: [],
      kpiData: []
    };

    const data = analyticsData;

    // Datos de tendencia
    const trendData = data.trendData.map((day: any) => ({
      fecha: day.day,
      consultas: day.success + day.failed,
      exitosas: day.success,
      fallidas: day.failed
    }));

    // Tasa de éxito por agente
    const successByAgent = data.successRateByAgent.map((agent: any) => ({
      agente: agent.agent,
      tasa: agent.successRate / 100
    }));

    // Distribución de resultados
    const resultDistribution = [
      { tipo: "Exitosas", cantidad: data.totalConsultations - data.failedConsultations, fill: "#22c55e" },
      { tipo: "Fallidas", cantidad: data.failedConsultations, fill: "#ef4444" },
    ];

    // Tiempos de respuesta por hora
    const hourlyStats = data.hourlyResponseStats.map((hour: any) => ({
      hora: `${hour.hour.toString().padStart(2, '0')}-${(hour.hour + 2).toString().padStart(2, '0')}`,
      promedio: hour.average,
      maximo: hour.max,
      consultas: hour.count
    }));

    // KPIs
    const kpiData = [
      {
        title: "Total Consultas",
        value: data.totalConsultations.toString(),
        change: "+8.2% vs período anterior",
        icon: MessageSquare,
        color: "text-blue-600",
        description: "Número total de consultas procesadas"
      },
      {
        title: "Tasa de Éxito",
        value: `${data.successRate}%`,
        change: data.successRate > 90 ? "Excelente rendimiento" : data.successRate > 80 ? "Buen rendimiento" : "Necesita mejora",
        icon: CheckCircle,
        color: data.successRate > 90 ? "text-green-600" : data.successRate > 80 ? "text-yellow-600" : "text-red-600",
        description: "Porcentaje de consultas exitosas"
      },
      {
        title: "Consultas Fallidas",
        value: data.failedConsultations.toString(),
        change: data.failedConsultations === 0 ? "Sin fallos" : `${((data.failedConsultations / data.totalConsultations) * 100).toFixed(1)}% de tasa de fallo`,
        icon: XCircle,
        color: "text-red-600",
        description: "Consultas que no pudieron ser procesadas"
      },
      {
        title: "Tiempo Promedio",
        value: `${data.averageResponseTime}s`,
        change: data.averageResponseTime < 2 ? "Rápido" : data.averageResponseTime < 5 ? "Normal" : "Lento",
        icon: Clock,
        color: data.averageResponseTime < 2 ? "text-green-600" : data.averageResponseTime < 5 ? "text-yellow-600" : "text-red-600",
        description: "Tiempo promedio de respuesta"
      },
    ];

    return { trendData, successByAgent, resultDistribution, hourlyStats, kpiData };
  }, [analyticsData]);

  const handleExport = () => {
    // Implementar exportación de datos
    console.log("Exportando datos...");
  };

  const handleApplyFilters = () => {
    refetchAnalytics();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Análisis de Consultas
          </h1>
          <p className="text-muted-foreground mt-2">
            Métricas detalladas y tendencias de rendimiento de tus agentes IA
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={handleApplyFilters} disabled={isLoadingAnalytics} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
            {isLoadingAnalytics ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Filtros de Análisis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Agente
              </label>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="bg-background">
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

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Rango de Fechas
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-background">
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
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleApplyFilters} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoadingAnalytics}
              >
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {chartData.kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-l-4" style={{ borderLeftColor: kpi.color.replace('text-', '') }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
                <p className="text-xs text-muted-foreground mt-2">{kpi.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs de Gráficos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendencias
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Rendimiento
          </TabsTrigger>
          <TabsTrigger value="response" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tiempos
          </TabsTrigger>
        </TabsList>

        {/* Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Distribución de Resultados */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Resultados</CardTitle>
                <CardDescription>Proporción de consultas exitosas vs fallidas</CardDescription>
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
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.resultDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="cantidad"
                        label={({ tipo, cantidad, percent }) =>
                          `${tipo}: ${cantidad} (${percent ? (percent * 100).toFixed(1) : 0}%)`
                        }
                      >
                        {chartData.resultDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
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
                      label: "Tasa de Éxito",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.successByAgent} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <YAxis dataKey="agente" type="category" width={80} />
                      <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Tasa de Éxito']} />
                      <Bar dataKey="tasa" fill="var(--color-tasa)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tendencias */}
        <TabsContent value="trends">
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
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="exitosas"
                      stackId="1"
                      stroke="var(--color-exitosas)"
                      fill="var(--color-exitosas)"
                      fillOpacity={0.6}
                      name="Exitosas"
                    />
                    <Area
                      type="monotone"
                      dataKey="fallidas"
                      stackId="1"
                      stroke="var(--color-fallidas)"
                      fill="var(--color-fallidas)"
                      fillOpacity={0.6}
                      name="Fallidas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tiempos de Respuesta */}
        <TabsContent value="response">
          <Card>
            <CardHeader>
              <CardTitle>Tiempos de Respuesta por Hora</CardTitle>
              <CardDescription>Tiempo promedio y máximo de respuesta durante el día</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  promedio: {
                    label: "Tiempo Promedio",
                    color: "hsl(var(--chart-3))",
                  },
                  maximo: {
                    label: "Tiempo Máximo",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.hourlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="promedio"
                      stroke="var(--color-promedio)"
                      strokeWidth={2}
                      name="Tiempo Promedio (s)"
                    />
                    <Line
                      type="monotone"
                      dataKey="maximo"
                      stroke="var(--color-maximo)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Tiempo Máximo (s)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}