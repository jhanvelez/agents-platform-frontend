"use client";

import { useEffect, useState } from "react"
import { Formik } from "formik";
import { TrashIcon } from "lucide-react";
import { Plus, Edit, Trash2, Sparkle } from "lucide-react";

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toasts } from "@/lib/toasts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// API
import {
  useUsersQuery,
  useStoreUserMutation,
  useUpdateUserMutation,
  useToggleUserMutation,
} from "@/store/users/users.api";
import {
  useRolesQuery,
} from "@/store/roles/roles.api";

// Types
import { User } from "@/types/User"
import { Agent } from "@/types/agent"
import { Rol } from "@/types/Rol"

// Schemas
import {
  userInitialValues,
  userValidationSchema,
} from "@/shared/schemas/user.schema"

export default function Users() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeletedOpen, setIsDeletedOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // API hooks
  const { data: usersData, refetch: refetchAtents } = useUsersQuery({ search: "" });
  const { data: rolesData, } = useRolesQuery({ search: "" });
  const [storeAtent, storeAtentResult] = useStoreUserMutation();
  const [deleteAtent, deleteAtentResult] = useToggleUserMutation();

  useEffect(() => {
    console.log(usersData)
  }, [usersData])

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

  const [currentTenant, setCurrentTenant] = useState<User>();
  const handleEdit = (agent: User) => {
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



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de usuarios</h2>
          <p className="text-muted-foreground text-sm">
            Aquí puedes gestionar todas los planes. Crea, edita o elimina usuarios según sea necesario.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Sparkle className="h-5 w-5" />
            Lista de Usuarios
          </CardTitle>
          <CardDescription>
            Gestiona todos los usuarios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nombre completo</TableHead>
                <TableHead>Correo electrónico</TableHead>
                <TableHead>Nº documento</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData && usersData.map((agent: User, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{agent.firstName}{" "}{agent.lastName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{agent.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{agent.documentType}{" / "}{agent.documentId}</Badge>
                  </TableCell>
                  <TableCell>
                    {agent.roles.map((rol: Rol, index: number) => {
                      return (
                        <Badge key={`${index}-${agent.id}`} variant="outline">{rol.name}</Badge>
                      );
                    })}
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
        initialValues={currentTenant ?? userInitialValues }
        validationSchema={userValidationSchema}
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
                  <DialogTitle>{editingAgent ? "Editar Agente" : "Crear nuevo usuario"}</DialogTitle>
                  <DialogDescription>
                    {editingAgent
                      ? "Edita los detalles del plan"
                      : "Ingrese la información para crear un nuevo usuario."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        id="name"
                        name="firstName"
                        type="text"
                        label="Nombre (s)"
                        span="Obligatorio"
                        value={values.firstName}
                        onChange={handleChange}
                        placeholder="Nombre del usuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        label="Apellidos"
                        span="Obligatorio"
                        value={values.lastName}
                        onChange={handleChange}
                        placeholder="Apellidos del usuario"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentType">Tipo de documento</Label>
                      <Select
                        value={values.documentType}
                        onValueChange={(value) => setFieldValue("documentType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            {value: '1', label: "CC"},
                            {value: '2', label: "NIT"},
                            {value: '3', label: "TI"}
                          ].map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="documentId"
                        name="documentId"
                        type="text"
                        label="Nº de doocumento"
                        span="Obligatorio"
                        value={values.documentId}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="number"
                        label="Número telefonico"
                        span="Obligatorio"
                        value={values.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Correo electrónico"
                        span="Obligatorio"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Contraseña"
                        span="Obligatorio"
                        value={values.password}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentType">Roles</Label>
                      <Select
                        value={values.roles[0]}
                        onValueChange={(value) => setFieldValue("roles", [value])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de documento" />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesData && rolesData.map((option: Rol) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
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