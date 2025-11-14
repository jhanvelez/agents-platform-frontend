"use client";

import { useEffect } from "react";
import { Sparkle } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ToggleField,
} from '@/components/ui/Fields'
import { Badge } from "@/components/ui/badge"

// Api
import {
  useAgentUsersQuery,
  useHasAccessUserAgentMutation,
  useRemoveAccessUserAgentMutation
} from "@/store/manage-agents/manage-agents.api";

// Type
import { UserAgent } from "@/types/User"
import { Rol } from "@/types/Rol"

// Lib
import { toasts } from "@/lib/toasts"

interface Document {
  id: string;
  fileName: string;
  mimeType: string;
  driveUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsAgentProps {
  agentId: string;
}

export default function DocumentsAgent({ agentId }: DocumentsAgentProps) {

  const { data: usersData, refetch: refetchAgentUsers } = useAgentUsersQuery({
    agentId
  });
  const [hasAccessUser, hasAccessUserResult] = useHasAccessUserAgentMutation();
  const [removeAccessUser, removeAccessUserResult] = useRemoveAccessUserAgentMutation();

  useEffect(() => {
    if (hasAccessUserResult.isSuccess) {
      toasts.success(
        "Exito",
        "El cambio se ha realizado exitosamente."
      );
      refetchAgentUsers();
    }

    if (hasAccessUserResult.error) {
      toasts.error(
        "Error",
        "El cambio no se ha podido realizar."
      );
    }
  }, [hasAccessUserResult]);

  useEffect(() => {
    if (removeAccessUserResult.isSuccess) {
      toasts.success(
        "Exito",
        "El cambio se ha realizado exitosamente."
      );
      refetchAgentUsers();
    }

    if (removeAccessUserResult.error) {
      toasts.error(
        "Error",
        "El cambio no se ha podido realizar."
      );
    }
  }, [removeAccessUserResult]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
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
                <TableHead>Roles</TableHead>
                <TableHead>Permitir acceso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData && usersData.map((user: UserAgent, index: number) => (
                <TableRow key={index+1}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell className="font-medium">{user.firstName}{" "}{user.lastName}</TableCell>
                  <TableCell>
                    {user.roles.map((rol: Rol, index: number) => {
                      return (
                        <Badge key={`${index}-${user.id}`} variant="outline">{rol.name}</Badge>
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <div className="pt-1">
                        <ToggleField
                          label="Estado"
                          checked={user.hasAccess}
                          onChange={(e) => {
                            if (user.hasAccess) {
                              removeAccessUser({
                                userId: user.id,
                                agentId
                              }) 
                            }else{
                              hasAccessUser({
                                userId: user.id,
                                agentId
                              });
                            }
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
    </div>
  );
}
