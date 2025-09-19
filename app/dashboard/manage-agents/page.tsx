"use client";

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { Formik } from "formik";

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
  TrashIcon,
  Plus, Edit, Bot
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

// Schemas
import {
  agentsInitialValues,
  agentsValidationSchema,
} from "@/shared/schemas/agents"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const { data: atentsData } = useTenantsQuery({ search: "" })

  useEffect(() => {
    if (storeAgentResult.isSuccess) {
      toasts.success(
        "Exito",
        "El agente se ha registrado exitosamente."
      );

      refetchAgents();
      setIsDialogOpen(false);
    }

    if (storeAgentResult.error) {
      toasts.error(
        "Error",
        "El agente no se ha registrado."
      );

      setIsDialogOpen(false);
    }
  }, [storeAgentResult])

  const [currentAgent, setCurrentAgent] = useState<Agent>();
  const handleEdit = (agent: Agent) => {
    setCurrentAgent({
      ...agent,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">Gestión de Agentes IA</h2>
          <p className="text-muted-foreground text-slate-700">Administra la configuración y propiedades de tus agentes</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Crear Agente
        </Button>
      </div>

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
                      {String(agent.abilities).split(',').slice(0, 2).map((skill, index) => (
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
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(agent)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <div className="pt-1">
                        <ToggleField
                          label="Estado"
                          checked={agent.isActive}
                          onChange={(e) => {
                            toggleAgent({
                              id: agent.id
                            });
                            //console.log("nuevo estado:", e.target.checked)
                          }}
                        />
                      </div>
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
        initialValues={currentAgent ?? agentsInitialValues}
        validationSchema={agentsValidationSchema}
        onSubmit={(values, formikHelopers) => {
          if (currentAgent) {
            updateAgent({
              ...values,
              abilities: values.abilities.toString()
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
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado *</Label>
                      <Select
                        onValueChange={(value: "active" | "inactive") => setFieldValue("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
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
                        placeholder="https://n8n.sustentiatec.com/webhook/chat/..."
                      />
                    </div>
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
                        onChange={(value: any) => {
                          setFieldValue("tenantId", value.value)
                        }}
                      />
                    </div>
                    {/* 
                    <div className="space-y-2">
                      <Label htmlFor="detailsUrl">URL Detalles N8N</Label>
                      <Input
                        id="detailsUrl"
                        value={formData.detailsUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, detailsUrl: e.target.value }))}
                        placeholder="https://n8n.example.com/webhook/details/..."
                      />
                    </div>
                    */}
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
    </div>
  );
}