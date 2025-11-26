"use client";

import { useEffect, useState, useRef } from "react"
import { Formik, FormikProps } from "formik";
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
import {
  ToggleField,
} from '@/components/ui/Fields'


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
import { Rol } from "@/types/Rol"

// Schemas
import {
  userInitialValues,
  userValidationSchema,
} from "@/shared/schemas/user.schema"

export default function Users() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formikRef = useRef(null);

  // API hooks
  const { data: usersData, refetch: refetchUsers } = useUsersQuery({ search: "" });
  const { data: rolesData, } = useRolesQuery({ search: "" });
  const [storeAtent, storeAtentResult] = useStoreUserMutation();
  const [updateUser, updateUserResult] = useUpdateUserMutation();
  const [toggleUser, toggleUserResult] = useToggleUserMutation();

  useEffect(() => {
    if (storeAtentResult.isSuccess) {
      toasts.success(
        "Exito",
        "El usuario se ha registrado exitosamente."
      );

      refetchUsers();
      setIsDialogOpen(false);

      if (formikRef.current) {
        formikRef.current?.resetForm();
      }
    }

    if (storeAtentResult.isError) {
      if ((storeAtentResult.error as any)?.data) {
        toasts.warning(
          "error",
          (storeAtentResult.error as any)?.data?.message,
        )
        return;
      }
    }
  }, [storeAtentResult]);

  useEffect(() => {
    if (updateUserResult.isSuccess) {
      toasts.success(
        "Exito",
        "El usuario se ha actualizado exitosamente."
      );

      refetchUsers();
      setIsDialogOpen(false);

      if (formikRef.current) {
        formikRef.current?.resetForm();
      }
    }

    if (updateUserResult.isError) {
      if ((updateUserResult.error as any)?.data) {
        toasts.warning(
          "error",
          (updateUserResult.error as any)?.data?.message,
        )
        return;
      }
    }
  }, [updateUserResult]);

  const [currentUser, setCurrentUser] = useState<User>();
  const handleEdit = (user: User) => {
    setCurrentUser({
      ...user,
      roles: user.roles.length > 0 ? [user.roles[0].id] : [],
    });
    setIsDialogOpen(true);
  }

  useEffect(() => {
    if (toggleUserResult.isSuccess) {
      toasts.success(
        "Exito",
        "Operación realizada exitosamente."
      );
      refetchUsers();
    }

    if (toggleUserResult.error) {
      toasts.error(
        "Error",
        "El cambio no se ha podido realizar."
      );
    }
  }, [toggleUserResult]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de usuarios</h2>
          <p className="text-muted-foreground text-sm">
            Aquí puedes gestionar todas los planes. Crea, edita o elimina usuarios según sea necesario.
          </p>
        </div>
        <Button onClick={() => {
          setIsDialogOpen(true);
          setCurrentUser(undefined);
        }} className="gap-2">
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
              {usersData && usersData.map((user: User, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{user.firstName}{" "}{user.lastName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.documentType}{" / "}{user.documentId}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.roles.map((rol: Rol, index: number) => {
                      return (
                        <Badge key={`${index}-${user.id}`} variant="outline">{rol.name}</Badge>
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <div className="pt-1">
                        <ToggleField
                          label="Estado"
                          checked={user.isActive}
                          onChange={(e) => {
                            toggleUser({
                              id: user.id
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
        innerRef={formikRef}
        initialValues={{
          ...userInitialValues,
          ...currentUser,
          isEditing: !!currentUser,
        }}
        validationSchema={userValidationSchema}
        onSubmit={(values, formikHelopers) => {
          if (currentUser) {
            updateUser({
              id: currentUser.id,
              userData: values,
            });
          }else{
            storeAtent(values);
          }
        }}
      >
        {({ handleSubmit, errors, handleChange, setFieldValue, values }) => {
          return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentUser ? "Editar Usuario" : "Crear nuevo usuario"}</DialogTitle>
                  <DialogDescription>
                    {currentUser
                      ? "Edita la información del usuario."
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

                    {!currentUser && (
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
                    )}

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
                    {currentUser ? "Actualizar" : "Crear"}
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