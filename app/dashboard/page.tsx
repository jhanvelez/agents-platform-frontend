
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
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
import { Bot, Activity, MessageSquare, TrendingUp } from "lucide-react"
import { useAuth } from '@/hooks/use-auth'
import { useMemo } from "react";

// API
import {
  useMetricsQuery,
} from '@/store/dashboard/dashboard.api';

const tasaExitoData = [
  { day: "Lun", tasa: 0 },
  { day: "Mar", tasa: 0 },
  { day: "Mié", tasa: 0 },
  { day: "Jue", tasa: 0 },
  { day: "Vie", tasa: 0 },
  { day: "Sáb", tasa: 0 },
  { day: "Dom", tasa: 0 },
];

const tiempoRespuestaData = [
  { hour: "00", tiempo: 0 },
  { hour: "04", tiempo: 0 },
  { hour: "08", tiempo: 0 },
  { hour: "12", tiempo: 0 },
  { hour: "16", tiempo: 0 },
  { hour: "20", tiempo: 0 },
];

interface chatDistributionProps {
  fill: string;
  name: string;
  value: number;
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();

  const { data: DashboardMetricsData, refetch: refetchDashboardMetrics } = useMetricsQuery({ search: "" });

  const kpiData = useMemo(() => {
    if (!DashboardMetricsData) return [];

    console.log(DashboardMetricsData.messages)

    return [
      {
        title: "Agentes Totales",
        value: DashboardMetricsData.agents.total,
        change: `+${DashboardMetricsData.agents.growth} este mes`,
        icon: Bot,
        color: "text-blue-600",
      },
      {
        title: "Agentes Activos",
        value: DashboardMetricsData.agents.active,
        change: `${DashboardMetricsData.agents.growth}% activos`,
        icon: Activity,
        color: "text-green-600",
      },
      {
        title: "Consultas (Hoy)",
        value: DashboardMetricsData.messages.today,
        change: `${DashboardMetricsData.messages.growthPercent}% vs ayer - ${DashboardMetricsData.messages.growthText}`,
        icon: MessageSquare,
        color: "text-purple-600",
      },
      {
        title: "Tasa Éxito Global",
        value: "94.2%",
        change: "+2.1% esta semana",
        icon: TrendingUp,
        color: "text-orange-600",
      },
    ]
  }, [DashboardMetricsData]);

  const consultasData = useMemo(() => {
    if (!DashboardMetricsData) return [];

    return DashboardMetricsData.chatWeeklyMetrics;
  }, [DashboardMetricsData]);

  const distribucionData: chatDistributionProps[] = useMemo(() => {
    if (!DashboardMetricsData) return [];

    return DashboardMetricsData.chatDistribution;
  }, [DashboardMetricsData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Vista General</h2>
        <p className="text-muted-foreground">Resumen del rendimiento de tus agentes IA</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => {
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

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Consultas en Últimos 7 Días */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas en Últimos 7 Días</CardTitle>
            <CardDescription>Tendencia de consultas diarias</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                consultas: {
                  label: "Consultas",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consultasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="consultas" stroke="var(--color-consultas)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribución por Agente */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Consultas por Agente</CardTitle>
            <CardDescription>Porcentaje de consultas por agente</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Consultas",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : "0"}%`}
                  >
                    {distribucionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tasa de Éxito */}
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Éxito en Últimos 7 Días</CardTitle>
            <CardDescription>Porcentaje de consultas exitosas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                tasa: {
                  label: "Tasa de Éxito (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tasaExitoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[80, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="tasa" stroke="var(--color-tasa)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tiempo de Respuesta */}
        <Card>
          <CardHeader>
            <CardTitle>Tiempo de Respuesta Promedio</CardTitle>
            <CardDescription>Tiempo promedio en segundos por hora</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                tiempo: {
                  label: "Tiempo (s)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tiempoRespuestaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="tiempo"
                    stroke="var(--color-tiempo)"
                    fill="var(--color-tiempo)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
