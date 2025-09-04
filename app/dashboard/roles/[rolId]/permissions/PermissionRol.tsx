"use client";

import { useRouter } from "next/navigation"
import {
  Shield,
  ArrowBigLeft,
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
import { Button } from "@/components/ui/button"
import {
  ToggleField,
} from '@/components/ui/Fields'
import { toasts } from "@/lib/toasts"


// API
import {
  usePermissionQuery,
  usePermissionsQuery,
} from "@/store/permissions/permission.api"

import {
  useRolQuery,
  useAddPermissionRolMutation,
  useRemovePermissionRolMutation,
} from "@/store/roles/roles.api"

// Types
import { Permission } from "@/types/Permission"
import { useEffect } from "react";

interface PermissionsProps {
  rolId: string;
}

export default function Permissions({ rolId }: PermissionsProps) {
  const router = useRouter();

  // API hooks
  const { data: atentsData, refetch: refetchAtents } = usePermissionsQuery({ search: "" });
  const [addPermission, addPermissionResult] = useAddPermissionRolMutation();
  const [removePermission, removePermissionResult] = useRemovePermissionRolMutation();

  useEffect(() => {
    console.info(rolId)
  }, [rolId])

  const { data: rolData, refetch: refetchRol } = useRolQuery({
    id: rolId,
  });

  useEffect(() => {
    if (addPermissionResult.isSuccess) {
      toasts.success(
        "Exito",
        "Permiso agregado exitosamente."
      );

      refetchRol();
    }

    if (addPermissionResult.error) {
      toasts.error(
        "Error",
        "No se podido agregar el permiso al rol."
      );
    }
  }, [addPermissionResult]);

  useEffect(() => {
    if (removePermissionResult.isSuccess) {
      toasts.success(
        "Exito",
        "Permiso removido exitosamente."
      );

      refetchRol();
    }

    if (removePermissionResult.error) {
      toasts.error(
        "Error",
        "No se podido remover el permiso."
      );
    }
  }, [removePermissionResult]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de permisos</h2>
          <p className="text-muted-foreground text-sm">
            Aquí puedes asignar o quitar permisos al rol seleccionado.
          </p>
        </div>
        <Button onClick={() => router.back()} className="gap-2">
          <ArrowBigLeft className="h-4 w-4" />
          Rol
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Shield className="h-5 w-5" />
            Lista de permisos
          </CardTitle>
          <CardDescription>
            Gestiona los permisos del rol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permiso</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolData && atentsData && atentsData.map((permission: Permission, index: number) => (
                <TableRow key={index+1}>
                  <TableCell className="font-bold">
                    {permission.action}
                  </TableCell>
                  <TableCell className="w-auto whitespace">
                      {permission.subject}
                  </TableCell>
                  <TableCell>
                    <ToggleField
                      label='Eliminar'
                      checked={rolData.permissions.some((item: Permission) => item.id === permission.id)}
                      onChange={(e) => {
                        console.log(e.target.checked)
                        if (e.target.checked) {
                          addPermission({
                            rolId,
                            permissionId: permission.id
                          });
                        } else if (!e.target.checked) {
                          removePermission({
                            rolId,
                            permissionId: permission.id
                          });
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}