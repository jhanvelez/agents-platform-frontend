"use client";

import { use, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { Formik } from "formik";

import { useAbility } from "@/providers/AbilityProvider";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SelectSearch from "@/components/ui/SelectSearch"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toasts } from "@/lib/toasts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FileArchiveIcon,
  UsersIcon,
  Badge as BadgeIcon,
  Plus, Edit, Bot,
  Search,
  Filter,
} from "lucide-react";
import {
  ToggleField,
} from '@/components/ui/Fields'


// API
import {
  useAgentsQuery,
  useStoreAgentMutation,
  useUpdateAgentMutation,
  useToggleAgentMutation,
} from "@/store/manage-agents/manage-agents.api"
import {
  useModelsAssetsQuery,
} from "@/store/models-ia/models-ia.api";
import {
  useTenantsQuery
} from "@/store/business-managent/business-managent.api";
import {
  useAssignTokensMutation
} from "@/store/manage-agents/tokens-agents.api";

// Schemas
import {
  agentsInitialValues,
  agentsValidationSchema,
} from "@/shared/schemas/agents"
import {
  tokensUsageInitialValues,
  tokensUsageValidationSchema,
} from "@/shared/schemas/tokens-usage.schema";

//Types
import { Agent } from "@/types/agent"
import { Tenant } from "@/types/tenant"
import { ModelIA } from "@/types/models-ia"

const availableSkills = [
  "Resolución de problemas",
  "Documentación técnica",
  "Ventas consultivas",
  "Negociación",
  "Análisis de datos",
  "Atención al cliente",
];
const personalities = ["Profesional y empático", "Persuasivo y amigable", "Analítico y preciso", "Creativo y dinámico"];

export default function LandingPage() {
  const router = useRouter();
  const ability = useAbility();

  const [monthlyTokenLimit, setMonthlyTokenLimit] = useState<number>(0);

  const [maxLimit, setMaxLimit] = useState<number>(0);

  const [agentId, setAgentId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogTokensOpen, setIsDialogTokensOpen] = useState(false);

  const { data: agentsData, refetch: refetchAgents } = useAgentsQuery({ search: "" });
  const { data: modelsIaData } = useModelsAssetsQuery({ search: "" });

  const models = useMemo(() => {
    if (!modelsIaData) return [];

    return modelsIaData.map((model: ModelIA) => {
      return {
        id: model.id,
        name: `${model.name}`,
      }
    })
  }, [modelsIaData]);


  const [storeAgent, storeAgentResult] = useStoreAgentMutation();

  const { data: atentsData } = useTenantsQuery({ search: searchTerm })

  useEffect(() => {
    if (storeAgentResult.isSuccess) {
      toasts.success(
        "Exito",
        "El agente se ha registrado exitosamente."
      );

      refetchAgents();
      setIsDialogOpen(false);
    }

    if (storeAgentResult.isError) {
      if ((storeAgentResult.error as any)?.data?.message) {
        toasts.error(
          "error",
          (storeAgentResult.error as any)?.data?.message
        )
        return;
      }

      setIsDialogOpen(false);
    }
  }, [storeAgentResult])

  const [currentAgent, setCurrentAgent] = useState<Agent>();
  const handleEdit = (agent: Agent) => {
    setCurrentAgent({
      ...agent,
      modelId: agent.model.id,
      tenantId: agent.tenant.id,
      abilities: String(agent.abilities).split(',').slice(0, 2),

    });
    setIsDialogOpen(true);
  }

  const [updateAgent, updateAgentResult] = useUpdateAgentMutation();
  useEffect(() => {
    if (updateAgentResult.isSuccess) {
      toasts.success(
        "Exito",
        "El agente se ha actualizado exitosamente."
      );

      refetchAgents();
      setIsDialogOpen(false);
    }

    if (updateAgentResult.error) {
      toasts.error(
        "Error",
        "El agente no se ha actualizado."
      );

      setIsDialogOpen(false);
    }
  }, [updateAgentResult])


  const [toggleAgent, toggleAgentResult] = useToggleAgentMutation();

  useEffect(() => {
    if (toggleAgentResult.isSuccess) {
      toasts.success(
        "Exito",
        "Cambio realizado exitosamente."
      );

      refetchAgents();
    }

    if (toggleAgentResult.error) {
      toasts.error(
        "Error",
        "El cambio no se ha realizado."
      );
    }
  }, [toggleAgentResult]);

  const applyFilters = () => {
    console.log("Se hace el envio de los valores")
  }

  const [assignTokens, assignTokensResult] = useAssignTokensMutation();

  useEffect(() => {
    if (assignTokensResult.isSuccess) {
      toasts.success(
        "Exito",
        "Tokens asignados exitosamente."
      );
      setIsDialogTokensOpen(false);
    }

    if (assignTokensResult.error) {
      toasts.error(
        "Error",
        "No se han podido asignar los tokens correctamente."
      );
      setIsDialogTokensOpen(false);
    }
  }, [assignTokensResult]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">Gestión de Agentes IA</h2>
          <p className="text-muted-foreground text-slate-700">Administra la configuración y propiedades de tus agentes</p>
        </div>
        {ability.can("create", "agents") && (
          <Button onClick={() => {
            setIsDialogOpen(true);
            setCurrentAgent(undefined);
          }} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Agente
          </Button>
        )}
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
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters}>Aplicar Filtros</Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-950">
            <Bot className="h-5 w-5" />
            Lista de Agentes
          </CardTitle>
          <CardDescription
            className="text-slate-700"
          >
            Gestiona todos los agentes IA de tu plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Habilidades</TableHead>
                <TableHead>Data para entrenamiento</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Asignar Tokens</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentsData && agentsData.map((agent: Agent, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{agent.description}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <Badge variant="destructive" className="text-xs">
                      {agent.tenant.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{agent.model.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {String(agent.abilities) > "" && String(agent.abilities).split(',').map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-white dark:ring-gray-700 dark:hover:bg-white/20"
                      onClick={() => {
                        router.push(`/dashboard/manage-agents/files/${agent.id}`);
                      }}
                    >
                      <FileArchiveIcon className="h-6 w-6" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-white dark:ring-gray-700 dark:hover:bg-white/20"
                      onClick={() => {
                        router.push(`/dashboard/manage-agents/users/${agent.id}`);
                      }}
                    >
                      <UsersIcon className="h-6 w-6" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 dark:bg-white/10 dark:text-white dark:ring-gray-700 dark:hover:bg-white/20"
                      onClick={() => {
                        setAgentId(agent.id);
                        setMaxLimit(agent.tenant.plan.monthlyTokenLimit);
                        setMonthlyTokenLimit(agent.monthlyLimit);
                        setIsDialogTokensOpen(true);
                      }}
                    >
                      <BadgeIcon className="h-6 w-6" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {ability.can("update", "agents") && (
                        <Button variant="outline" size="sm" onClick={() => handleEdit(agent)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      {ability.can("delete", "agents") && (
                        <div className="pt-1">
                          <ToggleField
                            label="Estado"
                            checked={agent.isActive}
                            onChange={(e) => {
                              toggleAgent({
                                id: agent.id
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Crear/Editar */}
      <Formik
        enableReinitialize
          initialValues={{
          ...agentsInitialValues,
          ...currentAgent,
          isSuperAdmin: ability.can("read", "business"),
        }}
        validationSchema={agentsValidationSchema}
        onSubmit={(values, formikHelopers) => {
          if (currentAgent) {
            const agentData = {
              ...values,
              abilities: values.abilities.toString()
            }

            updateAgent({
              id: currentAgent.id,
              agentData,
            });
          }else {
            storeAgent({
              ...values,
              abilities: values.abilities.toString()
            });
          }

          formikHelopers.resetForm();
          setIsDialogOpen(false);
        }}
      >
        {({ handleSubmit, errors, handleChange, setFieldValue, values, resetForm }) => {

          return (
            <Dialog
              open={isDialogOpen}
              onOpenChange={(newOpenState) => {
                setIsDialogOpen(newOpenState);
                if (!newOpenState) {
                  resetForm();
                }
              }}
            >
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentAgent ? "Editar Agente" : "Crear Nuevo Agente"}</DialogTitle>
                  <DialogDescription>
                    {currentAgent
                      ? "Modifica la configuración del agente seleccionado"
                      : "Configura las propiedades del nuevo agente IA"}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Nombre del agente"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modelo *</Label>
                      <Select
                        value={values.modelId}
                        onValueChange={(value) => setFieldValue("modelId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((model: ModelIA, index: number) => (
                            <SelectItem key={`model-${index}`} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="code">Codigo Agente *</Label>
                      <Input
                        id="code"
                        name="code"
                        value={values.code}
                        onChange={handleChange}
                        placeholder="Codigo workflow"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personality">Personalidad</Label>
                      <Select
                        value={values.personality}
                        onValueChange={(value) => setFieldValue("personality", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona personalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {personalities.map((personality) => (
                            <SelectItem key={personality} value={personality}>
                              {personality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      placeholder="Describe la función del agente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Habilidades</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSkills.map((skill: string) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={values.abilities.includes(skill)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFieldValue("abilities", [...values.abilities, skill]);
                              } else {
                                setFieldValue(
                                  "abilities",
                                  values.abilities.filter((s) => s !== skill)
                                );
                              }
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={`skill-${skill}`} className="text-sm">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">URL Webhook</Label>
                      <Input
                        id="url"
                        name="url"
                        value={values.url}
                        onChange={handleChange}
                        placeholder="https://ia.bybinary.com/webhook/chat/..."
                      />
                    </div>
                    {ability.can("read", "business") && (
                      <div className="space-y-2">
                        <Label htmlFor="tenantId">Empresa</Label>
                        <SelectSearch
                          colourOptions={atentsData && atentsData.map((dep: Tenant) => {
                            return {
                              value: dep.id,
                              label: dep.name,
                            }
                          })}
                          name="tenantId"
                          value={values.tenantId}
                          onChange={(value: any) => {
                            setFieldValue("tenantId", value.value)
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => {
                    console.log(errors)
                    handleSubmit();
                  }} disabled={!errors}>
                    {currentAgent ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }}
      </Formik>

      {/* Modal Asignar tokens */}
      <Formik
        enableReinitialize
        initialValues={{
          tokens: monthlyTokenLimit
        }}
        validationSchema={tokensUsageValidationSchema}
        onSubmit={(values, formikHelopers) => {
          assignTokens({
            agentId: agentId,
            tokensUsed: 0,
            totalTokensAssigned: Number(values.tokens),
          });
          
          formikHelopers.resetForm();
          setIsDialogTokensOpen(false);
        }}
      >
        {({ handleSubmit, errors, handleChange, setFieldValue, values }) => {

          return (
            <Dialog open={isDialogTokensOpen} onOpenChange={setIsDialogTokensOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Asignar toknes</DialogTitle>
                  <DialogDescription>
                    Ingrese la cantidad de tokens a asignar al agente.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tokens *</Label>
                      <Input
                        id="tokens"
                        name="tokens"
                        type="number"
                        value={values.tokens}
                        onChange={handleChange}
                        placeholder="Ejemplo: 1000"
                        error={!!errors.tokens}
                        textError={errors.tokens}
                      />
                    </div>
                  </div>

                  {values.tokens > maxLimit && (
                    <p className="text-red-600 font-medium text-sm mt-2">
                      El valor ingresado supera el límite mensual permitido por el plan.
                      El máximo permitido es <span className="font-semibold text-red-800">{maxLimit.toLocaleString()}</span> tokens.
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogTokensOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!errors || (values.tokens > maxLimit)}
                    onClick={() => {
                      console.log(errors)
                      handleSubmit();
                    }}
                  >
                    Asignar Tokens
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        }}
      </Formik>
    </div>
  );
}