"use client";

import { use, useEffect, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SelectSearch from "@/components/ui/SelectSearch"
import { Plus, Edit, Trash2, Bot } from "lucide-react";

import { Formik } from "formik";
import {
  businessManagementInitialValues,
  businnessManagementValidationSchema,
} from "@/shared/schemas/business-managent";
import { toasts } from "@/lib/toasts"
import { TrashIcon } from "lucide-react";

// API
import {
  useTenantsQuery,
  useTenantQuery,
  useStoreTenantsMutation,
  useUpdateTenantsMutation,
  useDeleteAtentMutation,
  useToggleTenantMutation,
} from "@/store/business-managent/business-managent.api";
import { useLocationsQuery } from "@/store/locations/locations.api";
import { usePlansQuery } from "@/store/plans/plans.api";

// Types
import { Deparment, City } from "@/types/locations";
import { Tenant } from "@/types/tenant"
import { Plan } from "@/types/plan"
import { Agent } from "@/types/agent"

const documentTypes = ["CC", "CE", "TI", "NIT"]

export default function LandingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeletedOpen, setIsDeletedOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [municipalities, setMunicipalities] = useState<City[]>([]);

  // API hooks
  const { data: atentsData, refetch: refetchAtents } = useTenantsQuery({ search: "" })
  const [storeAtent, storeAtentResult] = useStoreTenantsMutation();
  const [deleteAtent, deleteAtentResult] = useDeleteAtentMutation();

  const { data: locationsData } = useLocationsQuery({ search: "" });
  const { data: plansData } = usePlansQuery({ search: "" });

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

  const [currentTenant, setCurrentTenant] = useState<Tenant>();
  const handleEdit = (agent: Tenant) => {
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
          <h2 className="text-3xl font-bold tracking-tight">Gestión de empresas</h2>
          <p className="text-muted-foreground text-sm">
            Aquí puedes gestionar todas las empresas. Crea, edita o elimina empresas según sea necesario.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Crear Empresa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Bot className="h-5 w-5" />
            Lista de Empresas
          </CardTitle>
          <CardDescription>
            Gestiona todas las empresas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atentsData && atentsData.map((agent: Tenant, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{agent.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{agent.city != null ? agent.city.name : ''}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {agent.address}
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
        initialValues={currentTenant ?? businessManagementInitialValues}
        validationSchema={businnessManagementValidationSchema}
        onSubmit={(values, formikHelopers) => {
          storeAtent(values);
          formikHelopers.resetForm();
          setIsDialogOpen(false);
        }}
      >
        {({ handleSubmit, errors, handleChange, setFieldValue, values, resetForm }) => {

          useEffect(() => {
            if (values.department) {
              setMunicipalities( locationsData.filter((dep: Deparment) => dep.id === values.department)[0].children ?? []);
            }
          }, [values]);

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
                  <DialogTitle>{editingAgent ? "Editar Agente" : "Crear nueva empresa"}</DialogTitle>
                  <DialogDescription>
                    {editingAgent
                      ? "Edita los detalles de la empresa"
                      : "Completa los detalles de la nueva empresa"}
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
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico de la empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        placeholder="Correo electrónico de la empresa"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="documentType">Tipo de documento</Label>
                      <Select
                        value={values.documentType}
                        name="documentType"
                        onValueChange={(value) => setFieldValue("documentType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">Número de documento</Label>
                      <Input
                        id="documentNumber"
                        value={values.documentNumber}
                        name="documentNumber"
                        onChange={handleChange}
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deparment">Departamento</Label>
                      <SelectSearch
                        colourOptions={locationsData && locationsData.map((dep: Deparment) => {
                          return {
                            value: dep.id,
                            label: dep.name,
                          }
                        })}
                        name="department"
                        onChange={(value: any) => setFieldValue("department", value.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">Municipio</Label>
                      <SelectSearch
                        colourOptions={municipalities && municipalities.map((dep: City) => {
                          return {
                            value: dep.id,
                            label: dep.name,
                          }
                        })}
                        name="city"
                        onChange={(value: any) => setFieldValue("city", value.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deparment">Plan</Label>
                      <Select
                        value={values.plan}
                        name="plan"
                        onValueChange={(value) => setFieldValue("plan", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plansData && plansData.map((deparment: Plan) => (
                            <SelectItem key={deparment.id} value={deparment.id}>
                              {deparment.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyTokenLimit">
                        Límite mensual de tokens
                      </Label>
                      <Input
                        id="monthlyTokenLimit"
                        value={values.monthlyTokenLimit}
                        name="monthlyTokenLimit"
                        onChange={handleChange}
                        placeholder="Límite mensual de tokens"
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