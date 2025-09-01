"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Activity, Server, Zap, AlertTriangle, Clock, Database } from "lucide-react"

export function Monitoring() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Monitoreo de Agentes y Sistema</h2>
        <p className="text-muted-foreground">Supervisión en tiempo real del estado y rendimiento del sistema</p>
      </div>

      {/* Estado Actual */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>En Desarrollo:</strong> Esta sección está siendo desarrollada e incluirá funcionalidades avanzadas de
          monitoreo.
        </AlertDescription>
      </Alert>

      {/* Preview de Funcionalidades */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Estado de Agentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Estado de Agentes
            </CardTitle>
            <CardDescription>Monitoreo en tiempo real del estado de cada agente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Agente Soporte</span>
              <Badge variant="default">Activo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Agente Ventas</span>
              <Badge variant="default">Activo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Agente FAQ</span>
              <Badge variant="secondary">Inactivo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Agente Técnico</span>
              <Badge variant="destructive">Error</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-4">
              🚧 Próximamente: Indicadores visuales en tiempo real con AgentOps
            </div>
          </CardContent>
        </Card>

        {/* Métricas del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Métricas del Sistema
            </CardTitle>
            <CardDescription>Uso de recursos y rendimiento del servidor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>RAM</span>
                <span>62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Disco</span>
                <span>28%</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
            <div className="text-xs text-muted-foreground mt-4">
              🚧 Próximamente: Métricas en tiempo real del servidor
            </div>
          </CardContent>
        </Card>

        {/* Latencia API N8N */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Latencia API N8N
            </CardTitle>
            <CardDescription>Tiempo de respuesta de las APIs de N8N</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Webhook Chat</span>
              <Badge variant="default">120ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Webhook Detalles</span>
              <Badge variant="default">95ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Status</span>
              <Badge variant="destructive">Timeout</Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-4">🚧 Próximamente: Monitoreo automático de latencia</div>
          </CardContent>
        </Card>

        {/* Alertas Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Recientes
            </CardTitle>
            <CardDescription>Notificaciones y alertas del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-2 border rounded">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Agente Técnico desconectado</p>
                <p className="text-xs text-muted-foreground">Hace 15 minutos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 border rounded">
              <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Latencia alta detectada</p>
                <p className="text-xs text-muted-foreground">Hace 1 hora</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-4">🚧 Próximamente: Sistema de alertas automáticas</div>
          </CardContent>
        </Card>

        {/* Logs del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Logs Recientes
            </CardTitle>
            <CardDescription>Registro de eventos del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs font-mono bg-muted p-2 rounded">
              [2024-01-15 10:30:15] INFO: Agente Soporte - Consulta procesada
            </div>
            <div className="text-xs font-mono bg-muted p-2 rounded">
              [2024-01-15 10:29:42] WARN: Latencia alta en API N8N
            </div>
            <div className="text-xs font-mono bg-muted p-2 rounded">
              [2024-01-15 10:28:33] ERROR: Agente Técnico - Conexión perdida
            </div>
            <div className="text-xs text-muted-foreground mt-4">🚧 Próximamente: Logs detallados en tiempo real</div>
          </CardContent>
        </Card>

        {/* Integración AgentOps 
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Integración AgentOps
            </CardTitle>
            <CardDescription>Métricas avanzadas de agentes IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm font-medium mb-2">Próximamente</p>
              <p className="text-xs text-muted-foreground">Integración con AgentOps para métricas avanzadas:</p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• Trazabilidad de conversaciones</li>
                <li>• Métricas de rendimiento</li>
                <li>• Análisis de comportamiento</li>
                <li>• Optimización automática</li>
              </ul>
            </div>
          </CardContent>
        </Card>*/}
      </div>

      {/* Información de Desarrollo 
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades en Desarrollo</CardTitle>
          <CardDescription>Próximas características que se implementarán en el sistema de monitoreo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Integración con AgentOps</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Métricas en tiempo real de cada agente</li>
                <li>• Trazabilidad completa de conversaciones</li>
                <li>• Análisis de rendimiento y optimización</li>
                <li>• Detección automática de anomalías</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Monitoreo de Infraestructura</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Estado en tiempo real de agentes (activo/inactivo)</li>
                <li>• Indicadores visuales de salud del sistema</li>
                <li>• Monitoreo de uso de CPU/RAM del servidor</li>
                <li>• Latencia y disponibilidad de APIs N8N</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Sistema de Alertas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Notificaciones automáticas por email/SMS</li>
                <li>• Alertas configurables por umbrales</li>
                <li>• Escalamiento de incidentes</li>
                <li>• Dashboard de alertas activas</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Logs y Auditoría</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Logs detallados de todas las operaciones</li>
                <li>• Búsqueda y filtrado avanzado de logs</li>
                <li>• Exportación de logs para análisis</li>
                <li>• Retención configurable de logs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>*/}
    </div>
  )
}
