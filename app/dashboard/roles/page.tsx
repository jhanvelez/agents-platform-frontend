"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Formik } from "formik";
import {
  TrashIcon,
  Shield,
  Plus,
  Edit,
  Trash2,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toasts } from "@/lib/toasts"


// API
import {
  useRolesQuery,
  useStoreRolMutation,
  useToggleRolMutation
} from "@/store/roles/roles.api"

// Types
import { Rol } from "@/types/Rol"

// Schemas
import {
  rolInitialValues,
  rolValidationSchema, 
} from "@/shared/schemas/rol.schema"

export default function Roles() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeletedOpen, setIsDeletedOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [editingRol, setEditingRol] = useState<Rol | null>(null);

  // API hooks
  const { data: atentsData, refetch: refetchAtents } = useRolesQuery({ search: "" });
  const [storeAtent, storeAtentResult] =   useStoreRolMutation();
  const [deleteAtent, deleteAtentResult] = useToggleRolMutation();

  useEffect(() => {
    if (storeAtentResult.isSuccess) {
      toasts.success(
        "Exito",
        "El usuario se ha registrado exitosamente."
      );

      refetchAtents();
      setIsDialogOpen(false);
    }

    if (storeAtentResult.error) {
      toasts.error(
        "Error",
        "El usuario no se ha registrado exitosamente."
      );

      setIsDialogOpen(false);
    }
  }, [storeAtentResult]);

  const [currentTenant, setCurrentTenant] = useState<Rol>();
  const handleEdit = (agent: Rol) => {
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
        "El usuario se ha eliminado exitosamente."
      );

      refetchAtents();
      setIsDeletedOpen(false);
    }

    if (deleteAtentResult.error) {
      toasts.error(
        "Error",
        "El usuario no se ha podido eliminar."
      );

      setIsDeletedOpen(false);
    }
  }, [deleteAtentResult]);

  const handlePermissions = (idRole: string) => {
    setIsPermissionsOpen(!isPermissionsOpen);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de roles</h2>
          <p className="text-muted-foreground text-sm">
            Aquí puedes gestionar todas los planes. Crea, edita o elimina roles según sea necesario.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Rol
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Shield className="h-5 w-5" />
            Lista de roles
          </CardTitle>
          <CardDescription>
            Gestiona todos los roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Permisos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atentsData && atentsData.map((agent: Rol, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <Button variant="outline" size="sm" onClick={() => {
                      router.push(`roles/${agent.id}/permissions`);
                    }}>
                      <Shield className="h-3 w-3" />
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
        initialValues={currentTenant ?? rolInitialValues}
        validationSchema={rolValidationSchema}
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
                  <DialogTitle>{editingRol ? "Editar Agente" : "Crear nuevo usuario"}</DialogTitle>
                  <DialogDescription>
                    {editingRol
                      ? "Edita los detalles del plan"
                      : "Ingrese la información para crear un nuevo usuario."}
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
                        placeholder="Nombre del rol"
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
                    {editingRol ? "Actualizar" : "Crear"}
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