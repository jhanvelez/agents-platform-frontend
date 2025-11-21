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
import { Bot, Activity, MessageSquare, TrendingUp, RefreshCw } from "lucide-react"
import { skipToken } from "@reduxjs/toolkit/query";
import { useAuth } from '@/hooks/use-auth'
import { useMemo, useState } from "react";

import { useAbility } from "@/providers/AbilityProvider";

import SelectSearch from "@/components/ui/SelectSearch"
import { Label } from "@/components/ui/label"

// API
import {
  useMetricsQuery,
  useMetricsTenantQuery,
} from '@/store/dashboard/dashboard.api';
import {
  useTenantsQuery,
} from "@/store/business-managent/business-managent.api";

// Type
import { Tenant } from "@/types/tenant"

interface chatDistributionProps {
  fill: string;
  name: string;
  value: number;
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [tenantId, setTenantId] = useState("");

  const ability = useAbility();
  const canReadAll = ability.can("read", "business");

  const { data: atentsData } = useTenantsQuery({ search: "" })

  const { data: DashboardMetricsData, refetch, isFetching } = canReadAll ?
    useMetricsTenantQuery( tenantId ? { tenantId } : skipToken ) :
    useMetricsQuery({})

  const kpiData = useMemo(() => {
    if (!DashboardMetricsData?.data) return [];

    const { agents, messages, successMetrics } = DashboardMetricsData;

    return [
      {
        title: "Agentes Totales",
        value: agents.total,
        change: `+ ${agents.growth} este mes`,
        icon: Bot,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Agentes Activos",
        value: `${agents.active}/${agents.total}`,
        change: `${Math.round((agents.active / agents.total) * 100)}% activos`,
        icon: Activity,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Consultas (Hoy)",
        value: messages.today,
        change: `${messages.growthPercent}% vs ayer - ${messages.growthText}`,
        icon: MessageSquare,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        title: "Tasa Éxito Global",
        value: `${successMetrics.globalRate}%`,
        change: successMetrics.weeklyChange,
        icon: TrendingUp,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
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

  const tasaExitoData = useMemo(() => {
    if (!DashboardMetricsData) return [];
    return DashboardMetricsData.successMetrics.weeklyTrend;
  }, [DashboardMetricsData]);

  const tiempoRespuestaData = useMemo(() => {
    if (!DashboardMetricsData) return [];
    return DashboardMetricsData.responseTimes;
  }, [DashboardMetricsData]);

  const hasData = useMemo(() => {

    console.log('DashboardMetricsData', DashboardMetricsData);

    return DashboardMetricsData && 
          (DashboardMetricsData.agents.total > 0 || 
            DashboardMetricsData.messages.today > 0);
  }, [DashboardMetricsData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Vista General</h2>
            <p className="text-muted-foreground">Resumen del rendimiento de tus agentes IA</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
        {atentsData && (
          ability.can("read", "business") && (
            <div className="w-64">
              <Label htmlFor="tenantId">Empresa</Label>
              <SelectSearch
                colourOptions={atentsData && atentsData.map((dep: Tenant) => {
                  return {
                    value: dep.id,
                    label: dep.name,
                  }
                })}
                name="tenantId"
                value={tenantId}
                onChange={(value: any) => setTenantId(value.value)}
              />
            </div>
          )
        )}
      </div>

      {!hasData ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Bot className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No hay datos disponibles</h3>
                <p className="text-muted-foreground">
                  Comienza a usar tus agentes IA para ver las métricas aquí.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                <Card key={index} className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full ${kpi.bgColor} opacity-20`}></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {/* Consultas en Últimos 7 Días */}
            <Card className="col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Consultas en Últimos 7 Días
                  {consultasData.some((item: any) => item.consultas > 0) && (
                    <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      +{consultasData.filter((item: any) => item.consultas > 0).length} días con actividad
                    </span>
                  )}
                </CardTitle>
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
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="day" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        cursor={{ stroke: 'hsl(var(--chart-1))', strokeWidth: 1, strokeDasharray: '3 3' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="consultas" 
                        stroke="var(--color-consultas)" 
                        strokeWidth={3}
                        dot={{ fill: 'var(--color-consultas)', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'var(--color-consultas)', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Distribución por Agente */}
            <Card className="col-span-2 lg:col-span-1">
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
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => 
                          `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                        }
                        labelLine={false}
                      >
                        {distribucionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.fill}
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value} consultas`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Tasa de Éxito */}
            <Card className="col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Tasa de Éxito en Últimos 7 Días
                  <span className={`text-xs font-normal px-2 py-1 rounded-full ${
                    DashboardMetricsData.successMetrics.globalRate >= 80 
                      ? 'text-green-600 bg-green-50' 
                      : DashboardMetricsData.successMetrics.globalRate >= 60
                      ? 'text-yellow-600 bg-yellow-50'
                      : 'text-red-600 bg-red-50'
                  }`}>
                    {DashboardMetricsData.successMetrics.globalRate >= 80 ? 'Excelente' : 
                    DashboardMetricsData.successMetrics.globalRate >= 60 ? 'Bueno' : 'A mejorar'}
                  </span>
                </CardTitle>
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
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="day" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value}%`, 'Tasa de éxito']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="tasa" 
                        stroke="var(--color-tasa)" 
                        strokeWidth={3}
                        dot={{ fill: 'var(--color-tasa)', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'var(--color-tasa)', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Tiempo de Respuesta */}
            <Card className="col-span-2 lg:col-span-1">
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
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="hour" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value} segundos`, 'Tiempo promedio']}
                      />
                      <Area
                        type="monotone"
                        dataKey="tiempo"
                        stroke="var(--color-tiempo)"
                        fill="var(--color-tiempo)"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}