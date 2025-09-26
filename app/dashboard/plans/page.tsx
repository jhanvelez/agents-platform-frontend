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
  useTogglePlanStatusMutation,
} from "@/store/plans/plans.api";

// Types
import { Plan } from "@/types/plan"

export default function LandingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeletedOpen, setIsDeletedOpen] = useState(false)

  // API hooks
  const { data: atentsData, refetch: refetchAtents } = usePlansQuery({ search: "" });
  const [storePlan, storePlanResult] = useStorePlanMutation();
  const [updatePlan, updatePlanResult] = useUpdatePlanMutation();
  const [togglePlan, tooglePlanResult] = useTogglePlanStatusMutation();

  useEffect(() => {
    if (storePlanResult.isSuccess) {
      toasts.success(
        "Exito",
        "el plan se ha registrado exitosamente."
      );

      refetchAtents();
      setIsDialogOpen(false);
    }

    if (storePlanResult.error) {
      toasts.error(
        "Error",
        "El plan no se ha registrado exitosamente."
      );

      setIsDialogOpen(false);
    }
  }, [storePlanResult]);

  useEffect(() => {
    if (updatePlanResult.isSuccess) {
      toasts.success(
        "Exito",
        "El plan se ha actualizado exitosamente."
      );

      refetchAtents();
      setIsDialogOpen(false);
    }

    if (updatePlanResult.error) {
      toasts.error(
        "Error",
        "El plan no se ha podido actualizar."
      );

      setIsDialogOpen(false);
    }
  }, [updatePlanResult]);

  const [currentPlan, setCurrentPlan] = useState<Plan>();
  const handleEdit = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsDialogOpen(true);
  }

  useEffect(() => {
    if (tooglePlanResult.isSuccess) {
      toasts.success(
        "Exito",
        "Cambio realizado exitosamente."
      );

      refetchAtents();
      setIsDeletedOpen(false);
    }

    if (tooglePlanResult.error) {
      toasts.error(
        "Error",
        "No se ha podido realizar el cambio."
      );
    }
  }, [tooglePlanResult]);



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
              {atentsData && atentsData.map((plan: Plan, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{plan.maxAgents.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{plan.maxConsultsPerMonth.toLocaleString()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {plan.monthlyTokenLimit.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <div className="pt-1">
                        <ToggleField
                          label='Eliminar'
                          checked={plan.isActive}
                          onChange={(e) => {
                            togglePlan({
                              id: plan.id
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
        </CardContent>
      </Card>

      {/* Modal Crear/Editar */}
      <Formik
        enableReinitialize
        initialValues={currentPlan ?? plansInitialValues}
        validationSchema={plansValidationSchema}
        onSubmit={(values, formikHelopers) => {
          if (currentPlan) {
            updatePlan({
              id: currentPlan.id,
              planData: values,
            });
          }else{
            storePlan(values);
          }
          
          formikHelopers.resetForm();
          setIsDialogOpen(false);
        }}
      >
        {({ handleSubmit, errors, handleChange, setFieldValue, values }) => {
          return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentPlan ? "Editar Plan" : "Crear Plan"}</DialogTitle>
                  <DialogDescription>
                    {currentPlan
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
                    {currentPlan ? "Actualizar" : "Crear"}
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