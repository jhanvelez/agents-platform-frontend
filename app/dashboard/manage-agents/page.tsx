"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Formik } from "formik";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Bot } from "lucide-react"
import SelectSearch from "@/components/ui/SelectSearch"
import { toasts } from "@/lib/toasts"
import { TrashIcon } from "lucide-react"

import {
  FileArchiveIcon,
} from "lucide-react";

import {
  agentsInitialValues,
  agentsValidationSchema,
} from "@/shared/schemas/agents"

// API
import {
  useAgentsQuery,
  useAgentQuery,
  useStoreAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useToggleAgentMutation,
} from "@/store/manage-agents/manage-agents.api"

import { useTenantsQuery } from "@/store/business-managent/business-managent.api";

//Types
import { Agent } from "@/types/agent"
import { Tenant } from "@/types/tenant"

const models = ["GPT-4", "GPT-3.5", "Claude-3", "Llama-2"]
const availableSkills = [
  "Resolución de problemas",
  "Documentación técnica",
  "Ventas consultivas",
  "Negociación",
  "Análisis de datos",
  "Atención al cliente",
]
const personalities = ["Profesional y empático", "Persuasivo y amigable", "Analítico y preciso", "Creativo y dinámico"]

export default function LandingPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeletedOpen, setIsDeletedOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const { data: agentsData, refetch: refetchAgents } = useAgentsQuery({ search: "" });
  const [storeAgent, storeAgentResult] = useStoreAgentMutation();
  const [deleteAtent, deleteAtentResult] = useDeleteAgentMutation();

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

  const [currentTenant, setCurrentTenant] = useState<Agent>();
  const handleEdit = (agent: Agent) => {
    setCurrentTenant(agent);
    setIsDialogOpen(true);
  }

  const [currentId, setCurrentId] = useState<string>('');
  const handleDelete = (id: string) => {
    setCurrentId(id);
    setIsDeletedOpen(true);
  }

  const deleteConfirm = () => {
    deleteAtent({
      id: currentId
    });
  }

  useEffect(() => {
    if (deleteAtentResult.isSuccess) {
      toasts.success(
        "Exito",
        "La empresa se ha eliminado exitosamente."
      );

      refetchAgents();
      setIsDeletedOpen(false);
    }

    if (deleteAtentResult.error) {
      toasts.error(
        "Error",
        "La empresa no se ha podido eliminar."
      );

      setIsDeletedOpen(false);
    }
  }, [deleteAtentResult]);

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
                <TableHead>Modelo</TableHead>
                <TableHead>Habilidades</TableHead>
                <TableHead>Drive</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentsData && agentsData.map((agent: Agent, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{agent.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{agent.model}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {agent.abilities.split(',').slice(0, 2).map((skill, index) => (
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
                      <Button variant="outline" size="sm" onClick={() => handleDelete(agent.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
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
        initialValues={agentsInitialValues}
        validationSchema={agentsValidationSchema}
        onSubmit={(values, formikHelopers) => {
          storeAgent({
            ...values,
            abilities: values.abilities.toString()
          });
          // formikHelopers.resetForm();
          // setIsDialogOpen(false);
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
                  <DialogTitle>{editingAgent ? "Editar Agente" : "Crear Nuevo Agente"}</DialogTitle>
                  <DialogDescription>
                    {editingAgent
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
                        value={values.model}
                        onValueChange={(value) => setFieldValue("model", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
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

                  {/*
                  <div className="space-y-2">
                    <Label>Objetivos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableObjectives.map((objective) => (
                        <div key={objective} className="flex items-center space-x-2">
                          <Checkbox
                            id={`objective-${objective}`}
                            checked={values..includes(objective)}
                            onCheckedChange={() => toggleObjective(objective)}
                            className="rounded"
                          />
                          <Label htmlFor={`objective-${objective}`} className="text-sm">
                            {objective}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  */}

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
                      <Label htmlFor="url">URL Chat N8N</Label>
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
                    {editingAgent ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }}
      </Formik>

      {/** 
       * Moidal for deleted
       */}
      <Dialog open={isDeletedOpen} onOpenChange={setIsDeletedOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <div>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
              <TrashIcon />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <DialogTitle className="text-base font-semibold text-gray-900">
                ¿Eliminar la empresa?
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Se eliminará la empresa y los usuarios no podrán ver la información de nuevo.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={() => deleteConfirm()}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
              >
                Eliminar
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setIsDeletedOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              >
                Cancelar
              </button>
            </div>
          </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}