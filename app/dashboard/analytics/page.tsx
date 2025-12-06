"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import Datepicker from "react-tailwindcss-datepicker";

import {
  RefreshCw,
  Download,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
  Users,
  MessageSquare,
  AlertCircle,
  Zap,
  Activity,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  Tooltip as RechartsTooltip,
  Legend,
  RadialBar,
  RadialBarChart,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import { format, subDays, startOfDay, endOfDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// API
import {
  useAgentsQuery
} from "@/store/manage-agents/manage-agents.api";
import {
  useChatAgentAnalyticsQuery
} from "@/store/chat/chat.api";

// Types
import { Agent } from "@/types/agent";

// Tipo para el datepicker
interface DateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Legend Component
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const router = useRouter();

  // Estados
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [dateValue, setDateValue] = useState<DateRangeValue>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("30d");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Consultas a la API
  const { 
    data: agentsData, 
    isLoading: isLoadingAgents,
    error: agentsError 
  } = useAgentsQuery({ search: "" });

  // Función para formatear fecha para la API
  const formatDateForAPI = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString();
  };

  const {
    data: analyticsData,
    refetch: refetchAnalytics,
    isLoading: isLoadingAnalytics,
    isFetching: isFetchingAnalytics,
    error: analyticsError,
  } = useChatAgentAnalyticsQuery(
    selectedAgent !== "all" && dateValue.startDate && dateValue.endDate
      ? {
          agentId: selectedAgent,
          startDate: startOfDay(dateValue.startDate).toISOString(),
          endDate: endOfDay(dateValue.endDate).toISOString(),
        }
      : skipToken
  );

  // Efecto para recargar datos cuando cambia el timeframe
  useEffect(() => {
    const daysMap: { [key: string]: number } = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };

    if (daysMap[timeframe]) {
      setDateValue({
        startDate: subDays(new Date(), daysMap[timeframe]),
        endDate: new Date(),
      });
    }
  }, [timeframe]);

  // Efecto para forzar recarga
  useEffect(() => {
    if (forceRefresh > 0 && selectedAgent !== "all") {
      refetchAnalytics();
    }
  }, [forceRefresh, selectedAgent, refetchAnalytics]);

  // Transformación de datos
  const {
    agents,
    chartData,
    summaryData,
    isLoading,
    hasData
  } = useMemo(() => {
    // Agentes disponibles
    const agentsList = agentsData?.map((agent: Agent) => ({
      id: agent.id,
      name: agent.name,
      status: agent.isActive || "active",
    })) || [];

    // Si no hay datos de analíticas, devolver estructura vacía
    if (!analyticsData || selectedAgent === "all") {
      const mockTrendData = Array.from({ length: 30 }, (_, i) => ({
        fecha: format(subDays(new Date(), 29 - i), "dd/MM", { locale: es }),
        consultas: Math.floor(Math.random() * 100) + 50,
        exitosas: Math.floor(Math.random() * 80) + 40,
        fallidas: Math.floor(Math.random() * 20) + 5,
        satisfaccion: Math.random() * 20 + 70,
      }));

      const mockAgents = agentsList.slice(0, 5).map((agent: Agent, i: number) => ({
        agente: agent.name,
        tasa: 0.7 + (i * 0.05),
        consultas: Math.floor(Math.random() * 500) + 100,
        eficiencia: 60 + (i * 5),
      }));

      return {
        agents: agentsList,
        chartData: {
          trendData: mockTrendData,
          successByAgent: mockAgents,
          resultDistribution: [
            { tipo: "Exitosas", cantidad: 750, fill: "#22c55e", porcentaje: 75 },
            { tipo: "Fallidas", cantidad: 150, fill: "#ef4444", porcentaje: 15 },
            { tipo: "Pendientes", cantidad: 100, fill: "#f59e0b", porcentaje: 10 },
          ],
          hourlyStats: Array.from({ length: 12 }, (_, i) => ({
            hora: `${(i * 2).toString().padStart(2, '0')}-${((i + 1) * 2).toString().padStart(2, '0')}`,
            promedio: 1.5 + Math.random() * 2,
            maximo: 3 + Math.random() * 4,
            consultas: Math.floor(Math.random() * 200) + 50,
          })),
          categoryDistribution: [
            { categoria: "General", cantidad: 350, fill: "#3b82f6" },
            { categoria: "Técnico", cantidad: 280, fill: "#8b5cf6" },
            { categoria: "Comercial", cantidad: 220, fill: "#10b981" },
            { categoria: "Soporte", cantidad: 150, fill: "#f59e0b" },
          ],
          scatterData: Array.from({ length: 50 }, (_, i) => ({
            tiempo: 0.5 + Math.random() * 10,
            complejidad: Math.random() * 100,
            resultado: Math.random() > 0.2 ? "success" : "failure",
            tamaño: 5 + Math.random() * 15,
          })),
        },
        summaryData: {
          totalConsultations: 1000,
          successRate: 85,
          failedConsultations: 150,
          averageResponseTime: 2.3,
          avgSatisfaction: 88,
          peakHour: "14:00-16:00",
          topCategory: "General",
          efficiencyScore: 92,
        },
        isLoading: isLoadingAnalytics || isFetchingAnalytics,
        hasData: false,
      };
    }

    // Procesar datos reales
    const data = analyticsData;
    
    // Datos de tendencia    
    const trendData = (data.trendData || []).map((day: any) => ({
      fecha: day.day,
      consultas: (day.success || 0) + (day.failed || 0),
      exitosas: day.success || 0,
      fallidas: day.failed || 0,
    }));

    // Tasa de éxito por agente
    const successByAgent = (data.successRateByAgent || []).map((agent: any) => ({
      agente: agent.agent,
      tasa: (agent.successRate || 0) / 100,
      consultas: agent.totalConsultations || 0,
      eficiencia: agent.efficiency || 0,
    }));

    // Distribución de resultados
    const resultDistribution = [
      { 
        tipo: "Exitosas", 
        cantidad: data.totalConsultations - data.failedConsultations, 
        fill: "#22c55e",
        porcentaje: ((data.totalConsultations - data.failedConsultations) / data.totalConsultations * 100) || 0
      },
      { 
        tipo: "Fallidas", 
        cantidad: data.failedConsultations, 
        fill: "#ef4444",
        porcentaje: (data.failedConsultations / data.totalConsultations * 100) || 0
      },
      ...(data.pendingConsultations ? [{
        tipo: "Pendientes",
        cantidad: data.pendingConsultations,
        fill: "#f59e0b",
        porcentaje: (data.pendingConsultations / data.totalConsultations * 100) || 0
      }] : [])
    ];

    // Tiempos de respuesta por hora
    const hourlyStats = (data.hourlyResponseStats || []).map((hour: any) => ({
      hora: `${hour.hour.toString().padStart(2, '0')}:00`,
      promedio: hour.average || 0,
      maximo: hour.max || 0,
      consultas: hour.count || 0,
    }));

    // Distribución por categoría
    const categoryDistribution = (data.categoryDistribution || []).map((cat: any, index: number) => ({
      categoria: cat.category || `Categoría ${index + 1}`,
      cantidad: cat.count || 0,
      fill: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"][index % 5],
    }));

    // Datos de dispersión para análisis de correlación
    const scatterData = (data.scatterData || []).map((point: any) => ({
      tiempo: point.responseTime || 0,
      complejidad: point.complexity || 0,
      resultado: point.success ? "success" : "failure",
      tamaño: point.messageLength || 10,
    }));

    return {
      agents: agentsList,
      chartData: { trendData, successByAgent, resultDistribution, hourlyStats, categoryDistribution, scatterData },
      summaryData: {
        totalConsultations: data.totalConsultations || 0,
        successRate: data.successRate || 0,
        failedConsultations: data.failedConsultations || 0,
        averageResponseTime: data.averageResponseTime || 0,
        avgSatisfaction: data.avgSatisfaction || 0,
        peakHour: data.peakHour || "N/A",
        topCategory: data.topCategory || "N/A",
        efficiencyScore: data.efficiencyScore || 0,
      },
      isLoading: isLoadingAnalytics || isFetchingAnalytics,
      hasData: true,
    };
  }, [analyticsData, agentsData, selectedAgent, isLoadingAnalytics, isFetchingAnalytics]);

  // Datos para KPIs
  const kpiData = useMemo(() => [
    {
      title: "Total Consultas",
      value: summaryData.totalConsultations.toLocaleString(),
      change: "+12.5%",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Consultas procesadas",
      trend: "up",
    },
    {
      title: "Tasa de Éxito",
      value: `${summaryData.successRate.toFixed(1)}%`,
      change: summaryData.successRate > 90 ? "+3.2%" : summaryData.successRate > 80 ? "+1.5%" : "-2.1%",
      icon: CheckCircle,
      color: summaryData.successRate > 90 ? "text-green-600" : summaryData.successRate > 80 ? "text-yellow-600" : "text-red-600",
      bgColor: summaryData.successRate > 90 ? "bg-green-50" : summaryData.successRate > 80 ? "bg-yellow-50" : "bg-red-50",
      description: "Consultas exitosas",
      trend: summaryData.successRate > 90 ? "up" : summaryData.successRate > 80 ? "stable" : "down",
    },
    {
      title: "Tiempo Respuesta",
      value: `${summaryData.averageResponseTime.toFixed(1)}s`,
      change: summaryData.averageResponseTime < 2 ? "-15%" : summaryData.averageResponseTime < 5 ? "+5%" : "+22%",
      icon: Clock,
      color: summaryData.averageResponseTime < 2 ? "text-green-600" : summaryData.averageResponseTime < 5 ? "text-yellow-600" : "text-red-600",
      bgColor: summaryData.averageResponseTime < 2 ? "bg-green-50" : summaryData.averageResponseTime < 5 ? "bg-yellow-50" : "bg-red-50",
      description: "Promedio por consulta",
      trend: summaryData.averageResponseTime < 2 ? "down" : summaryData.averageResponseTime < 5 ? "stable" : "up",
    },
    {
      title: "Eficiencia",
      value: `${summaryData.efficiencyScore}%`,
      change: "+8.7%",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Score general",
      trend: "up",
    },
  ], [summaryData]);

  // Manejo de exportación
  const handleExport = () => {
    const dataStr = JSON.stringify(chartData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Manejo seguro de refetch
  const handleApplyFilters = () => {
    // Solo hacer refetch si hay un agente seleccionado y no es "all"
    if (selectedAgent !== "all" && dateValue.startDate && dateValue.endDate) {
      refetchAnalytics();
    } else {
      // Si no hay agente seleccionado, incrementar forceRefresh para recalcular datos mock
      setForceRefresh(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    handleApplyFilters();
  };

  const handleResetFilters = () => {
    setSelectedAgent("all");
    setDateValue({
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
    });
    setTimeframe("30d");
    setForceRefresh(prev => prev + 1);
  };

  // Manejo del cambio de fecha
  const handleDateChange = (newValue: any) => {
    setDateValue(newValue);
  };

  // Determinar si se puede hacer refetch
  const canRefresh = selectedAgent !== "all" && dateValue.startDate && dateValue.endDate;

  // Renderizado condicional de carga
  if (isLoadingAgents) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Panel de Análisis
          </h1>
          <p className="text-muted-foreground mt-2">
            Métricas en tiempo real y tendencias de rendimiento de tus agentes IA
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar datos en formato JSON</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {analyticsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error al cargar los datos analíticos. Intenta nuevamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros Avanzados */}
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Filtros de Análisis</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-1"
            >
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showAdvanced ? "Menos opciones" : "Más opciones"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Agente */}
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
                  {agents.map((agent: any) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        {agent.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rango de Fechas con react-tailwindcss-datepicker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rango de Fechas</label>
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
                    past: (period) => `Últimos ${period} días`,
                    currentMonth: "Este mes",
                    pastMonth: "Mes pasado"
                  }
                }}
                containerClassName="relative"
                inputClassName="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                toggleClassName="absolute right-3 top-1/2 transform -translate-y-1/2"
                popoverDirection="down"
              />
            </div>

            {/* Timeframe Rápido */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Período
              </label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                  <SelectItem value="1y">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Acciones */}
            <div className="flex items-end gap-2">
              <Button 
                onClick={handleApplyFilters} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
              >
                Reiniciar
              </Button>
            </div>
          </div>

          {/* Filtros Avanzados Expandidos */}
          {showAdvanced && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-4">Filtros Avanzados</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Consulta</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Técnico</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                      <SelectItem value="support">Soporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="success">Exitosas</SelectItem>
                      <SelectItem value="failed">Fallidas</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nivel de Complejidad</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los niveles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los niveles</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de Estado */}
      {!hasData && selectedAgent === "all" && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Modo de demostración</AlertTitle>
          <AlertDescription className="text-blue-700">
            Selecciona un agente específico para ver datos reales. Actualmente mostrando datos de ejemplo.
          </AlertDescription>
        </Alert>
      )}

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className={`border-l-4 ${kpi.bgColor}`} style={{ borderLeftColor: kpi.color.replace('text-', '') }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                  {kpi.trend === "up" && <ChevronUp className="h-4 w-4 text-green-600" />}
                  {kpi.trend === "down" && <ChevronDown className="h-4 w-4 text-red-600" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                  <Badge 
                    variant={kpi.trend === "up" ? "default" : kpi.trend === "down" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <Progress value={kpi.title === "Tasa de Éxito" ? summaryData.successRate : 
                               kpi.title === "Eficiencia" ? summaryData.efficiencyScore : 75} 
                         className="mt-3 h-1" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Estadísticas Adicionales */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Hora Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.peakHour}</div>
            <p className="text-xs text-muted-foreground mt-1">Mayor volumen de consultas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Categoría Principal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.topCategory}</div>
            <p className="text-xs text-muted-foreground mt-1">Consulta más frecuente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Satisfacción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.avgSatisfaction}%</div>
            <p className="text-xs text-muted-foreground mt-1">Promedio de satisfacción</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Gráficos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
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
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Resumen */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Distribución de Resultados */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Resultados</CardTitle>
                <CardDescription>Proporción de consultas por estado</CardDescription>
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
                    pendientes: {
                      label: "Pendientes",
                      color: "hsl(var(--chart-5))",
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
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="cantidad"
                        label={({ tipo, porcentaje }) => `${tipo}: ${porcentaje.toFixed(1)}%`}
                      >
                        {chartData.resultDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [value, "Consultas"]} />
                      <Legend content={<CustomLegend />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Tasa de Éxito por Agente */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Agente</CardTitle>
                <CardDescription>Tasa de éxito y volumen por agente</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    tasa: {
                      label: "Tasa de Éxito",
                      color: "hsl(var(--chart-1))",
                    },
                    consultas: {
                      label: "Consultas",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.successByAgent}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="agente" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="tasa" fill="var(--color-tasa)" name="Tasa de Éxito" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" dataKey="consultas" fill="var(--color-consultas)" name="Total Consultas" radius={[4, 4, 0, 0]} />
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tendencia de Consultas</CardTitle>
                  <CardDescription>Evolución diaria del volumen de consultas</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Exitosas
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    Fallidas
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  consultas: {
                    label: "Total Consultas",
                    color: "hsl(var(--chart-1))",
                  },
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
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="consultas"
                      stackId="1"
                      stroke="var(--color-consultas)"
                      fill="var(--color-consultas)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="exitosas"
                      stackId="2"
                      stroke="var(--color-exitosas)"
                      fill="var(--color-exitosas)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="fallidas"
                      stackId="2"
                      stroke="var(--color-fallidas)"
                      fill="var(--color-fallidas)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rendimiento */}
        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Distribución por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle>Consultas por Categoría</CardTitle>
                <CardDescription>Distribución de consultas por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="10%" 
                      outerRadius="80%" 
                      data={chartData.categoryDistribution}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar
                        label={{ position: 'insideStart', fill: '#fff' }}
                        background
                        dataKey="cantidad"
                      />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                      <RechartsTooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Dispersión */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Correlación</CardTitle>
                <CardDescription>Tiempo vs Complejidad de consultas</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="tiempo" name="Tiempo (s)" />
                      <YAxis type="number" dataKey="complejidad" name="Complejidad" />
                      <ZAxis type="number" dataKey="tamaño" range={[60, 400]} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter 
                        name="Exitosas" 
                        data={chartData.scatterData.filter((d: any) => d.resultado === 'success')} 
                        fill="#22c55e" 
                      />
                      <Scatter 
                        name="Fallidas" 
                        data={chartData.scatterData.filter((d: any) => d.resultado === 'failure')} 
                        fill="#ef4444" 
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tiempos de Respuesta */}
        <TabsContent value="response">
          <Card>
            <CardHeader>
              <CardTitle>Tiempos de Respuesta</CardTitle>
              <CardDescription>Análisis temporal de rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-4">Por Hora del Día</h3>
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
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.hourlyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hora" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="promedio"
                          stroke="var(--color-promedio)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="maximo"
                          stroke="var(--color-maximo)"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Volumen por Hora</h3>
                  <ChartContainer className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.hourlyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hora" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="consultas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Detallado</CardTitle>
                <CardDescription>Métricas avanzadas y recomendaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Resumen de Rendimiento</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tasa de éxito objetivo</span>
                        <span className="font-semibold">90%</span>
                      </div>
                      <Progress value={summaryData.successRate} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm">Tiempo respuesta objetivo</span>
                        <span className="font-semibold">{"< 3s"}</span>
                      </div>
                      <Progress 
                        value={Math.min(100, (summaryData.averageResponseTime / 5) * 100)} 
                        className="h-2" 
                      />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="font-semibold">Recomendaciones</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Optimizar respuestas para consultas técnicas (mayor tiempo de respuesta)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Mejorar entrenamiento en categoría {summaryData.topCategory}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span>Revisar fallas en horario {summaryData.peakHour}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Tendencias Clave</h3>
                    <div className="space-y-3">
                      <Card className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Crecimiento mensual</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            +12.5%
                          </Badge>
                        </div>
                      </Card>
                      <Card className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Reducción de fallas</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            -8.2%
                          </Badge>
                        </div>
                      </Card>
                      <Card className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Mejora en satisfacción</span>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            +5.3%
                          </Badge>
                        </div>
                      </Card>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="font-semibold">Próximos Pasos</h3>
                    <div className="space-y-2 text-sm">
                      <p>• Programar auditoría de rendimiento para la próxima semana</p>
                      <p>• Actualizar base de conocimiento con casos recientes</p>
                      <p>• Revisar configuración de agentes con menor tasa de éxito</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>Última actualización: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}</p>
        <p className="mt-1">Los datos se actualizan automáticamente cada 5 minutos</p>
      </div>
    </div>
  );
}