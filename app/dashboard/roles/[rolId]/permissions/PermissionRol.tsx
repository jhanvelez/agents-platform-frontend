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
  usePermissionsQuery,
} from "@/store/permissions/permission.api"

import {
  useRolQuery,
  useAddPermissionRolMutation,
  useRemovePermissionRolMutation,
} from "@/store/roles/roles.api"

// Types
import { Permission } from "@/types/Permission"
import { useEffect, useMemo } from "react";

// UI Accordion
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

interface PermissionsProps {
  rolId: string;
}

export default function Permissions({ rolId }: PermissionsProps) {
  const router = useRouter();

  // API hooks
  const { data: atentsData } = usePermissionsQuery({ search: "" });
  const [addPermission, addPermissionResult] = useAddPermissionRolMutation();
  const [removePermission, removePermissionResult] = useRemovePermissionRolMutation();

  const { data: rolData, refetch: refetchRol } = useRolQuery({
    id: rolId,
  });

  useEffect(() => {
    if (addPermissionResult.isSuccess) {
      toasts.success("Éxito", "Permiso agregado exitosamente.");
      refetchRol();
    }
    if (addPermissionResult.error) {
      toasts.error("Error", "No se pudo agregar el permiso al rol.");
    }
  }, [addPermissionResult]);

  useEffect(() => {
    if (removePermissionResult.isSuccess) {
      toasts.success("Éxito", "Permiso removido exitosamente.");
      refetchRol();
    }
    if (removePermissionResult.error) {
      toasts.error("Error", "No se pudo remover el permiso.");
    }
  }, [removePermissionResult]);

  // 🔑 Agrupamos permisos por prefijo (entity)
  const groupedByEntity = useMemo(() => {
    if (!atentsData) return {};
    return atentsData.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
      const [entity] = permission.action.split(".");
      if (!acc[entity]) acc[entity] = [];
      acc[entity].push(permission);
      return acc;
    }, {});
  }, [atentsData]);

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
            Gestiona los permisos del rol agrupados por entidad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {Object.entries(groupedByEntity).map(([entity, permissions], idx) => (
              <AccordionItem key={entity} value={`item-${idx}`}>
                <AccordionTrigger className="capitalize font-semibold text-lg">
                  {entity}
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Acción</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions && permissions.map((permission: Permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-bold">
                            {permission.action.split(".")[1]}
                          </TableCell>
                          <TableCell>{permission.subject}</TableCell>
                          <TableCell>
                            <ToggleField
                              label="Asignar"
                              checked={rolData?.permissions.some(
                                (item: Permission) => item.id === permission.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  addPermission({ rolId, permissionId: permission.id });
                                } else {
                                  removePermission({ rolId, permissionId: permission.id });
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
