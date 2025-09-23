"use client";

import { use, useEffect, useMemo, useState } from "react"
import { Formik } from "formik";
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
import { Pagination } from "@/components/ui/PaginationUI"
import { Plus, Edit, Bot } from "lucide-react";
import {
  ToggleField,
} from '@/components/ui/Fields'


import {
  businessManagementInitialValues,
  businnessManagementValidationSchema,
} from "@/shared/schemas/business-managent";
import { toasts } from "@/lib/toasts"
import { TrashIcon } from "lucide-react";

// API
import {
  useTenantsQuery,
  useStoreTenantsMutation,
  useUpdateTenantsMutation,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [municipalities, setMunicipalities] = useState<City[]>([]);

  // API hooks
  const { data: atentsData, refetch: refetchAtents } = useTenantsQuery({ search: "" })
  const [storeTenant, storeTenantResult] = useStoreTenantsMutation();
  const [toggleTenant, toggleTenantResult] = useToggleTenantMutation();

  const { data: locationsData } = useLocationsQuery({ search: "" });
  const { data: plansData } = usePlansQuery({ search: "" });


  const departments = useMemo(() => {
    if (!locationsData) return [];

    return locationsData.map((dep: Deparment) => {
      return {
        value: dep.id,
        label: dep.name,
      }
    })
  }, [locationsData]);

  useEffect(() => {
    if (storeTenantResult.isSuccess) {
      toasts.success(
        "Exito",
        "La empresa se ha registrado exitosamente."
      );

      refetchAtents();
      setIsDialogOpen(false);
    }

    if (storeTenantResult.error) {
      toasts.error(
        "Error",
        "La empresa no se ha registrado exitosamente."
      );

      setIsDialogOpen(false);
    }
  }, [storeTenantResult]);

  const [currentTenant, setCurrentTenant] = useState<Tenant>();
  const handleEdit = (agent: Tenant) => {
    setCurrentTenant(agent);
    setIsDialogOpen(true);
  }


  useEffect(() => {
    if (toggleTenantResult.isSuccess) {
      toasts.success(
        "Exito",
        "La empresa se ha eliminado exitosamente."
      );

      refetchAtents();
    }

    if (toggleTenantResult.error) {
      toasts.error(
        "Error",
        "La empresa no se ha podido eliminar."
      );
    }
  }, [toggleTenantResult]);

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
                      <div className="pt-1">
                        <ToggleField
                          label="Estado"
                          checked={agent.isActive}
                          onChange={(e) => {
                            toggleTenant({
                              id: agent.id
                            });
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            totalItems={atentsData ? atentsData.length : 0}
            itemsPerPage={10}
            currentPage={1}
            onPageChange={(newPage) => {
              setCurrentPage(newPage);
            }}
          />
        </CardContent>
      </Card>

      {/* Modal Crear/Editar */}
      <Formik
        enableReinitialize
        initialValues={currentTenant ?? businessManagementInitialValues}
        validationSchema={businnessManagementValidationSchema}
        onSubmit={(values, formikHelopers) => {
          storeTenant(values);
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
                      <Input
                        id="name"
                        name="name"
                        label="Nombre *"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Nombre de la empresa"
                        error={!!errors.name}
                        textError={errors.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="email"
                        name="email"
                        label="Correo electrónico *"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico de la empresa"
                        error={!!errors.email}
                        textError={errors.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="address"
                        name="address"
                        label="Dirección *"
                        value={values.address}
                        onChange={handleChange}
                        placeholder="Correo electrónico de la empresa"
                        error={!!errors.address}
                        textError={errors.address}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Select
                        name="documentType"
                        value={values.documentType}
                        onValueChange={(value) => setFieldValue("documentType", value)}
                      >
                        <SelectTrigger label="Tipo de documento" error={!!errors.documentType} textError={errors.documentType}>
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
                      <Input
                        id="documentNumber"
                        name="documentNumber"
                        label="Número de documento"
                        value={values.documentNumber}
                        onChange={handleChange}
                        placeholder="9876543210"
                        error={!!errors.documentNumber}
                        textError={errors.documentNumber}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deparment">Departamento</Label>
                      <SelectSearch
                        name="department"
                        colourOptions={departments}
                        onChange={(value: any) => setFieldValue("department", value.value)}
                        error={!!errors.department}
                        textError={errors.department}
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
                        error={!!errors.city}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Select
                        value={values.plan}
                        name="plan"
                        onValueChange={(value) => setFieldValue("plan", value)}
                      >
                        <SelectTrigger label="Plan" error={!!errors.plan} textError={errors.plan}>
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
    </div>
  );
}