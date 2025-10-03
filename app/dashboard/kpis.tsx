"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Pie,
  PieChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"

// 📊 Datos ficticios de tenant y agentes
const tenantData = {
  nombre: "Tenant ABC",
  tokensAsignados: 10000,
  tokensConsumidos: 7800,
}

const agentesData = [
  { name: "Agente Soporte", asignados: 4000, consumidos: 3200 },
  { name: "Agente Ventas", asignados: 3000, consumidos: 2800 },
  { name: "Agente FAQ", asignados: 2000, consumidos: 1500 },
  { name: "Agente Técnico", asignados: 1000, consumidos: 900 },
]

// 📊 Procesar % de consumo
const donutData = [
  { name: "Consumidos", value: tenantData.tokensConsumidos, fill: "#ef4444" },
  { name: "Disponibles", value: tenantData.tokensAsignados - tenantData.tokensConsumidos, fill: "#22c55e" },
]

const agentesBarData = agentesData.map((agente) => ({
  name: agente.name,
  asignados: agente.asignados,
  consumidos: agente.consumidos,
  porcentaje: Math.round((agente.consumidos / agente.asignados) * 100),
}))

export default function DashboardPage() {
  const porcentajeTenant = Math.round((tenantData.tokensConsumidos / tenantData.tokensAsignados) * 100)

  return (
    <div className="space-y-6">
      {/* 📌 Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Consumo de Tokens</h2>
        <p className="text-muted-foreground">Supervisión de uso mensual por tenant y agentes</p>
      </div>

      {/* 📊 KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tokens Asignados</CardTitle>
            <CardDescription>Cuota mensual del tenant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenantData.tokensAsignados.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tokens Consumidos</CardTitle>
            <CardDescription>Uso acumulado hasta hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tenantData.tokensConsumidos.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Porcentaje de Consumo</CardTitle>
            <CardDescription>Estado actual del tenant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${porcentajeTenant >= 90 ? "text-red-600" : porcentajeTenant >= 80 ? "text-yellow-500" : "text-green-600"}`}>
              {porcentajeTenant}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📊 Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Donut consumo global */}
        <Card>
          <CardHeader>
            <CardTitle>Uso Global del Tenant</CardTitle>
            <CardDescription>Consumidos vs Disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Tokens", color: "hsl(var(--chart-1))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Barras por agente */}
        <Card>
          <CardHeader>
            <CardTitle>Consumo por Agente</CardTitle>
            <CardDescription>Comparación tokens asignados vs consumidos</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                consumidos: { label: "Consumidos", color: "#ef4444" },
                asignados: { label: "Asignados", color: "#22c55e" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentesBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="asignados" fill="#22c55e" />
                  <Bar dataKey="consumidos" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
