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
import { toasts } from "@/lib/toasts"


// API
import {
  usePermissionQuery,
  usePermissionsQuery,
} from "@/store/permissions/permission.api"

// Types
import { Permission } from "@/types/Permission"


export default function Permisos() {
  const router = useRouter();

  // API hooks
  const { data: atentsData, refetch: refetchAtents } = usePermissionsQuery({ search: "" });

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
                <TableHead>#</TableHead>
                <TableHead>Permiso</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atentsData && atentsData.map((permission: Permission, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">
                    {permission.action}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <p>
                      {permission.subject}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-indigo-500 dark:has-checked:bg-indigo-500">
                      <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5" />
                      <input
                        name="setting"
                        type="checkbox"
                        aria-label="Use setting"
                        className="absolute inset-0 appearance-none focus:outline-hidden"
                      />
                    </div>
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