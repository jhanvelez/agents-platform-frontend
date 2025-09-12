"use client";

import { useEffect, useState } from "react"
import { Formik } from "formik";
import { TrashIcon } from "lucide-react";
import { Plus, Edit, Trash2, Sparkle } from "lucide-react";

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  plansInitialValues,
  plansValidationSchema,
} from "@/shared/schemas/plans";
import { toasts } from "@/lib/toasts"

import {
  ToggleField,
} from '@/components/ui/Fields'

// API
import {
  usePlansQuery,
  useStorePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "@/store/plans/plans.api";

// Types
import { Plan } from "@/types/plan"
import { Agent } from "@/types/agent"

export default function LandingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeletedOpen, setIsDeletedOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // API hooks
  const { data: atentsData, refetch: refetchAtents } = usePlansQuery({ search: "" });
  const [storeAtent, storeAtentResult] = useStorePlanMutation();
  const [deleteAtent, deleteAtentResult] = useDeletePlanMutation();

  useEffect(() => {
    if (storeAtentResult.isSuccess) {
      toasts.success(
        "Exito",
        "La empresa se ha registrado exitosamente."
      );

      refetchAtents();
      setIsDialogOpen(false);
    }

    if (storeAtentResult.error) {
      toasts.error(
        "Error",
        "La empresa no se ha registrado exitosamente."
      );

      setIsDialogOpen(false);
    }
  }, [storeAtentResult]);

  const [currentTenant, setCurrentTenant] = useState<Plan>();
  const handleEdit = (agent: Plan) => {
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

      refetchAtents();
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
          <h2 className="text-3xl font-bold tracking-tight">Gestión de planes</h2>
          <p className="text-muted-foreground text-sm">
            Aquí puedes gestionar todas los planes. Crea, edita o elimina planes según sea necesario.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Sparkle className="h-5 w-5" />
            Lista de Planes
          </CardTitle>
          <CardDescription>
            Gestiona todos los planes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Max Agentes</TableHead>
                <TableHead>Max Consultas por mes</TableHead>
                <TableHead>Tokens mensuales por mes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atentsData && atentsData.map((agent: Plan, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{agent.maxAgents.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{agent.maxConsultsPerMonth.toLocaleString()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {agent.monthlyTokenLimit.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={agent.isActive ? "default" : "secondary"}>
                      {agent.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(agent)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <div className="pt-1">
                        <ToggleField
                          label='Eliminar'
                          checked={agent.isActive}
                          onChange={(e) => {
                            console.log(e.target.checked)
                            if (e.target.checked) {
                              console.log("Activar")
                            } else if (!e.target.checked) {
                              console.log("Inactivar")
                            }
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
        initialValues={currentTenant ?? plansInitialValues}
        validationSchema={plansValidationSchema}
        onSubmit={(values, formikHelopers) => {
          storeAtent(values);
          formikHelopers.resetForm();
          setIsDialogOpen(false);
        }}
      >
        {({ handleSubmit, errors, handleChange, setFieldValue, values }) => {
          return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingAgent ? "Editar Plan" : "Crear Plan"}</DialogTitle>
                  <DialogDescription>
                    {editingAgent
                      ? "Edita los detalles del plan"
                      : "Completa los detalles del nuevo plan"}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Nombre del plan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAgents">Agentes maximos</Label>
                      <Input
                        id="maxAgents"
                        name="maxAgents"
                        type="number"
                        value={values.maxAgents}
                        onChange={handleChange}
                        placeholder="Agentes maximos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxConsultsPerMonth">Maximo consultas por mes</Label>
                      <Input
                        id="maxConsultsPerMonth"
                        name="maxConsultsPerMonth"
                        type="number"
                        value={values.maxConsultsPerMonth}
                        onChange={handleChange}
                        placeholder="Maximo consultas por mes"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyTokenLimit">Tokens maximos por mes</Label>
                      <Input
                        id="monthlyTokenLimit"
                        name="monthlyTokenLimit"
                        type="number"
                        value={values.monthlyTokenLimit}
                        onChange={handleChange}
                        placeholder="Tokens maximos por mes"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!errors} onClick={() => {
                    console.log(errors)
                    handleSubmit();
                  }}>
                    {editingAgent ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
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