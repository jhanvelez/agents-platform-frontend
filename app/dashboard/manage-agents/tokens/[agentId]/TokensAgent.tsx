"use client";

import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { 
  Coins, 
  Users, 
  Building, 
  Zap, 
  BarChart3, 
  RefreshCw,
  Edit3,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  PieChart,
  Target,
  Shield,
  Rocket,
  Sparkles,
  Calendar,
  Download,
  Filter,
  ArrowLeft,
  Cpu
} from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

// API
import { 
  useGetAgentTokenInfoQuery, 
  useAssignTokensMutation,
  useGetAllTokenUsageQuery 
} from "@/store/manage-agents/tokens-agents.api";

// Schemas
import { 
  tokensAssignmentValidationSchema, 
  tokensInitialValues 
} from "@/shared/schemas/tokens.schema";

// Types
import { 
  AgentWithTokenInfo,
  TokenStats 
} from "@/types/tokens";

// Lib
import { toasts } from "@/lib/toasts"

interface TokensAgentProps {
  agentId: string;
}

export default function TokenManagement({ agentId }: TokensAgentProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month");

  const { 
    data: agentData, 
    refetch: refetchAgentData, 
    isLoading: isLoadingAgent,
    error: agentError 
  } = useGetAgentTokenInfoQuery(agentId);

  const { 
    data: usageData,
    isLoading: isLoadingUsage 
  } = useGetAllTokenUsageQuery({});

  const [assignTokens, { isLoading: isAssigning }] = useAssignTokensMutation();

  useEffect(() => {
    if (agentError) {
      toasts.error("Error", "No se pudo cargar la información del agente");
    }
  }, [agentError]);

  const handleAssignTokens = () => {
    setIsDialogOpen(true);
  };

  const calculateUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (percentage < 80) return "bg-gradient-to-r from-amber-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage < 50) return { text: "Óptimo", color: "text-green-600" };
    if (percentage < 80) return { text: "Moderado", color: "text-amber-600" };
    return { text: "Crítico", color: "text-red-600" };
  };

  // Calcular estadísticas para este agente específico
  const calculateStats = (): TokenStats => {
    if (!agentData) {
      return {
        totalAssigned: 0,
        totalUsed: 0,
        totalAvailable: 0,
        usagePercentage: 0,
        agentsCount: 1,
        activeAgents: 0
      };
    }

    const totalAssigned = agentData.tokenUsage?.monthlyLimit || 0;
    const totalUsed = agentData.tokenUsage?.tokensUsed || 0;
    const totalAvailable = agentData.tokenUsage?.tokensAvailable || 0;
    const usagePercentage = totalAssigned > 0 ? (totalUsed / totalAssigned) * 100 : 0;

    return {
      totalAssigned,
      totalUsed,
      totalAvailable,
      usagePercentage,
      agentsCount: 1,
      activeAgents: agentData.agent.isActive ? 1 : 0
    };
  };

  const stats = calculateStats();

  if (isLoadingAgent) {
    return <LoadingSkeleton />;
  }

  if (!agentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Agente no encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No se pudo cargar la información del agente solicitado.
            </p>
            <Button onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver atrás
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con Gradiente */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl" />
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4 mb-4 lg:mb-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Cpu className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {agentData.agent.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    Gestión de Tokens - {agentData.agent.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      {timeRange === "month" ? "Este Mes" : 
                        timeRange === "quarter" ? "Este Trimestre" : "Este Año"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTimeRange("month")}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Este Mes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeRange("quarter")}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Este Trimestre
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeRange("year")}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Este Año
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  className="gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  onClick={() => refetchAgentData()}
                  disabled={isLoadingAgent}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingAgent ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Tenant */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {agentData.agent.tenant.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Plan: {agentData.agent.tenant.plan.name} • 
                    Límite: {agentData.agent.tenant.monthlyTokenLimit.toLocaleString()} tokens
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={
                agentData.availableTokensForTenant > 0 
                  ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300"
                  : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300"
              }>
                {agentData.availableTokensForTenant.toLocaleString()} tokens disponibles
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pestañas de Navegación */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Historial
            </TabsTrigger>
          </TabsList>

          {/* Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab 
              agentData={agentData} 
              stats={stats} 
              getUsageColor={getUsageColor}
              onAssignTokens={handleAssignTokens}
            />
          </TabsContent>

          {/* Historial */}
          <TabsContent value="history" className="space-y-6">
            <HistoryTab 
              agentData={agentData}
              usageData={usageData}
              isLoadingUsage={isLoadingUsage}
            />
          </TabsContent>
        </Tabs>

        {/* Modal de Asignación de Tokens */}
        <TokenAssignmentDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          agentData={agentData}
          onAssignTokens={assignTokens}
          isAssigning={isAssigning}
          onSuccess={() => refetchAgentData()}
        />
      </div>
    </div>
  );
}

// Componente de Resumen
function OverviewTab({ agentData, stats, getUsageColor, onAssignTokens }: any) {
  const usageStatus = stats.usagePercentage < 50 ? "Óptimo" : 
                    stats.usagePercentage < 80 ? "Moderado" : "Crítico";
  
  const statusColor = stats.usagePercentage < 50 ? "text-green-600" : 
                    stats.usagePercentage < 80 ? "text-amber-600" : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Coins className="h-6 w-6" />}
          title="Límite Asignado"
          value={stats.totalAssigned.toLocaleString()}
          subtitle="Tokens máximos"
          gradient="from-blue-500 to-cyan-500"
        />
        
        <MetricCard
          icon={<Zap className="h-6 w-6" />}
          title="Tokens Usados"
          value={stats.totalUsed.toLocaleString()}
          subtitle="Consumo actual"
          gradient="from-amber-500 to-orange-500"
        />
        
        <MetricCard
          icon={<PieChart className="h-6 w-6" />}
          title="Disponibles"
          value={stats.totalAvailable.toLocaleString()}
          subtitle="Para usar"
          gradient="from-green-500 to-emerald-500"
        />
        
        <MetricCard
          icon={<Target className="h-6 w-6" />}
          title="Estado de Uso"
          value={usageStatus}
          subtitle={`${stats.usagePercentage.toFixed(1)}% utilizado`}
          gradient="from-purple-500 to-pink-500"
          valueColor={statusColor}
        />
      </div>

      {/* Barra de Progreso Principal y Acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Progreso de Uso
            </CardTitle>
            <CardDescription>
              Distribución de tokens asignados vs utilizados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tokens utilizados</span>
              <span className="font-semibold">{stats.totalUsed.toLocaleString()} / {stats.totalAssigned.toLocaleString()}</span>
            </div>
            <Progress 
              value={stats.usagePercentage} 
              className={`h-3 ${getUsageColor(stats.usagePercentage)}`}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span className="font-medium">{stats.usagePercentage.toFixed(1)}%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-purple-500" />
              Acciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={onAssignTokens}
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="lg"
            >
              <Edit3 className="h-4 w-4" />
              Gestionar Tokens
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full gap-2"
              size="lg"
            >
              <Download className="h-4 w-4" />
              Exportar Reporte
            </Button>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Última actualización:</span>
                  <span className="font-medium">Hoy</span>
                </div>
                <div className="flex justify-between">
                  <span>Estado del agente:</span>
                  <Badge variant={agentData.agent.isActive ? "default" : "secondary"} className={
                    agentData.agent.isActive 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }>
                    {agentData.agent.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Recomendaciones de Uso
              </h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p>• {stats.usagePercentage > 80 ? 
                  'El uso de tokens es elevado. Considera aumentar el límite asignado.' :
                  'El uso de tokens está en niveles óptimos. Buen trabajo!'
                }</p>
                <p>• {stats.totalAvailable < stats.totalAssigned * 0.2 ? 
                  'Quedan pocos tokens disponibles. Planifica una nueva asignación pronto.' :
                  'Tienes tokens suficientes para continuar operando normalmente.'
                }</p>
                <p>• Monitorea el consumo semanal para optimizar el uso de recursos.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Historial
function HistoryTab({ agentData, usageData, isLoadingUsage }: any) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          Historial de Consumo
        </CardTitle>
        <CardDescription>
          Registro histórico del uso de tokens del agente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingUsage ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Historial en Desarrollo
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Próximamente: Gráficos detallados del historial de consumo.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Resumen actual:</strong> {agentData.tokenUsage?.tokensUsed.toLocaleString()} tokens usados este mes.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de Tarjeta de Métrica
function MetricCard({ icon, title, value, subtitle, gradient, valueColor = "" }: any) {
  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className={`text-2xl font-bold ${valueColor || "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"}`}>
              {value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente del Modal de Asignación
function TokenAssignmentDialog({ 
  isOpen, 
  onClose, 
  agentData, 
  onAssignTokens, 
  isAssigning,
  onSuccess 
}: any) {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        tokens: agentData?.tokenUsage?.monthlyLimit || 0
      }}
      validationSchema={tokensAssignmentValidationSchema}
      onSubmit={async (values, formikHelpers) => {
        if (!agentData) return;
        
        try {
          await onAssignTokens({
            agentId: agentData.agent.id,
            totalTokensAssigned: Number(values.tokens),
          }).unwrap();
          
          toasts.success("Éxito", "Tokens asignados correctamente");
          formikHelpers.resetForm();
          onClose();
          onSuccess();
        } catch (error: any) {
          toasts.error("Error", error?.data?.message || "No se pudieron asignar los tokens");
        }
      }}
    >
      {({ handleSubmit, errors, handleChange, setFieldValue, values, isValid, dirty }) => {
        const currentTokens = agentData?.tokenUsage?.monthlyLimit || 0;
        const tokensDifference = values.tokens - currentTokens;
        const canAssign = agentData && tokensDifference <= agentData.availableTokensForTenant;

        return (
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Asignar Tokens
                </DialogTitle>
                <DialogDescription>
                  Gestiona los tokens del agente: {agentData?.agent.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Información actual */}
                {agentData?.tokenUsage && (
                  <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600 dark:text-blue-400">Límite actual:</span>
                          <p className="font-semibold text-blue-800 dark:text-blue-300">
                            {agentData.tokenUsage.monthlyLimit.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-600 dark:text-blue-400">Usados:</span>
                          <p className="font-semibold text-blue-800 dark:text-blue-300">
                            {agentData.tokenUsage.tokensUsed.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Input de tokens */}
                <div className="space-y-2">
                  <Label htmlFor="tokens" className="text-sm font-medium">
                    Nuevo límite de tokens *
                  </Label>
                  <Input
                    id="tokens"
                    name="tokens"
                    type="number"
                    value={values.tokens}
                    onChange={handleChange}
                    placeholder="Ejemplo: 1000000"
                    error={!!errors.tokens}
                    textError={errors.tokens ? errors.tokens : ""}
                    className="w-full"
                  />
                </div>

                {/* Información de disponibilidad */}
                {agentData && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tokens disponibles en tenant:</span>
                      <span className="font-semibold text-green-600">
                        {agentData.availableTokensForTenant.toLocaleString()}
                      </span>
                    </div>
                    
                    {tokensDifference !== 0 && (
                      <div className={`flex justify-between text-sm ${
                        tokensDifference > 0 ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        <span>
                          {tokensDifference > 0 ? 'Tokens a asignar:' : 'Tokens a liberar:'}
                        </span>
                        <span className="font-semibold">
                          {Math.abs(tokensDifference).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {tokensDifference > 0 && tokensDifference > agentData.availableTokensForTenant && (
                      <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertDescription className="text-red-800 dark:text-red-200">
                          No hay suficientes tokens disponibles. 
                          Necesitas {tokensDifference.toLocaleString()} pero solo tienes {agentData.availableTokensForTenant.toLocaleString()} disponibles.
                        </AlertDescription>
                      </Alert>
                    )}

                    {tokensDifference > 0 && tokensDifference <= agentData.availableTokensForTenant && (
                      <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                          Tokens suficientes disponibles. 
                          Quedarán {(agentData.availableTokensForTenant - tokensDifference).toLocaleString()} tokens libres.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isAssigning}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={() => handleSubmit()}
                  disabled={!isValid || !dirty || !canAssign || isAssigning}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isAssigning ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Coins className="h-4 w-4" />
                  )}
                  {isAssigning ? 'Asignando...' : 'Asignar Tokens'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      }}
    </Formik>
  );
}

// Componente de Loading
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Tenant Info Skeleton */}
        <Skeleton className="h-20 rounded-2xl mb-6" />

        {/* Tabs Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}