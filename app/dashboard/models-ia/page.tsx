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
  modelsInitialValues,
  modelsValidationSchema
} from "@/shared/schemas/models-ia.api";
import { toasts } from "@/lib/toasts"

import {
  ToggleField,
} from '@/components/ui/Fields'

// API
import {
  useModelsQuery,
  useStoreModelMutation,
  useToggleModelStatusMutation,
} from "@/store/models-ia/models-ia.api";

// Types
import { ModelIA } from "@/types/models-ia"

export default function LandingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<ModelIA | null>(null);

  // API hooks
  const { data: modelsData, refetch: refetchModels } = useModelsQuery({ search: "" });

  const [storeAtent, storeAtentResult] = useStoreModelMutation();
  useEffect(() => {
    if (storeAtentResult.isSuccess) {
      toasts.success(
        "Exito",
        "El modelo se ha registrado exitosamente."
      );

      refetchModels();
      setIsDialogOpen(false);
    }

    if (storeAtentResult.error) {
      toasts.error(
        "Error",
        "El modelo no se ha registrado."
      );

      setIsDialogOpen(false);
    }
  }, [storeAtentResult]);

    const [toggleMoelIa, toggleMoelIaResult] = useToggleModelStatusMutation();
    useEffect(() => {
    if (toggleMoelIaResult.isSuccess) {
      toasts.success(
        "Exito",
        "Cambio realizado exitosamente."
      );

      refetchModels();
    }

    if (toggleMoelIaResult.error) {
      toasts.error(
        "Error",
        "El cambio no se ha realizado."
      );
    }
  }, [toggleMoelIaResult]);

  const [currentTenant, setCurrentTenant] = useState<ModelIA>();
  const handleEdit = (agent: ModelIA) => {
    setCurrentTenant(agent);
    setIsDialogOpen(true);
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de modelos ia</h2>
          <p className="text-muted-foreground text-sm">
            Aquí puedes gestionar todas los models. Crea, edita o elimina modelos ia según sea necesario.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Modelo IA
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Sparkle className="h-5 w-5" />
            Lista de Modelos IA
          </CardTitle>
          <CardDescription>
            Gestiona todos los modelos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Versión</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Parámetros</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelsData && modelsData.map((model: ModelIA, index: number) => (
              <TableRow key={model.id}>
                <TableCell>{index+1}</TableCell>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>{model.provider}</TableCell>
                <TableCell>{model.version}</TableCell>
                <TableCell>{model.type}</TableCell>
                <TableCell>{model.parameters}</TableCell>
                <TableCell>
                  <Badge variant={model.isActive ? "default" : "secondary"}>
                    {model.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(model)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <div className="pt-1">
                      <ToggleField
                        label="Estado"
                        checked={model.isActive}
                        onChange={(e) => {
                          toggleMoelIa({
                            id: model.id
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
        initialValues={currentTenant ?? modelsInitialValues}
        validationSchema={modelsValidationSchema}
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
                  <DialogTitle>{editingAgent ? "Editar Modelo IA" : "Crear Modelo IA"}</DialogTitle>
                  <DialogDescription>
                    {editingAgent
                      ? "Edita los detalles del modelo"
                      : "Completa los detalles del nuevo modelo"}
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
                        placeholder="Ej. GPT-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider">Proveedor</Label>
                      <Input
                        id="provider"
                        name="provider"
                        type="text"
                        value={values.provider}
                        onChange={handleChange}
                        placeholder="OpenAI / Meta / HuggingFace"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="version">Versión</Label>
                      <Input
                        id="version"
                        name="version"
                        type="text"
                        value={values.version}
                        onChange={handleChange}
                        placeholder="Ej. v1, 7B, 4.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Input
                        id="type"
                        name="type"
                        type="text"
                        value={values.type}
                        onChange={handleChange}
                        placeholder="chat, vision, speech, embeddings"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parameters">Parámetros</Label>
                      <Input
                        id="parameters"
                        name="parameters"
                        type="text"
                        value={values.parameters}
                        onChange={handleChange}
                        placeholder="7B, 70B, 1T"
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
    </div>
  );
}