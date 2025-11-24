"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, User, Mail, Phone, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { toasts } from "@/lib/toasts"

// Importar los hooks de Redux Query
import { 
  useGetPublicConfigQuery,
  useCreatePublicSessionMutation 
} from "@/store/public-chat/public-chat.api";

interface PublicChatFormProps {
  agentId: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

export default function PublicChatForm({ agentId }: PublicChatFormProps) {
  const router = useRouter();
  
  // Usar Redux Query hooks
  const { 
    data: configData, 
    isLoading: isLoadingConfig, 
    error: configError 
  } = useGetPublicConfigQuery(agentId);
  
  const [createSession, { 
    isLoading: isCreatingSession, 
    error: sessionError 
  }] = useCreatePublicSessionMutation();
  
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: ""
  });

  // Manejar errores
  useEffect(() => {
    if (configError) {
      toasts.error("Error", "No se pudo cargar la configuración del chat");
    }
    
    if (sessionError) {
      toasts.error("Error", "No se pudo iniciar la sesión de chat");
    }
  }, [configError, sessionError]);

  const handleStartChat = async () => {
    if (!configData) return;

    // Validar campos requeridos
    if (configData.requireUserData) {
      for (const field of configData.requiredFields) {
        if (!userData[field as keyof UserData]) {
          toasts.error("Error", `El campo ${field} es requerido`);
          return;
        }
      }
    }

    try {
      // Usar la mutation de Redux Query
      const sessionData = await createSession({
        configId: configData.id,
        name: userData.name,
      }).unwrap();

      // Redirigir al chat
      router.push(`/public/agents/chat/session/${sessionData.sessionId}`);
      
    } catch (error) {
      // El error ya se maneja en el useEffect
      console.error("Error creating session:", error);
    }
  };

  if (isLoadingConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!configData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-gray-600">Chat no disponible</p>
        </div>
      </div>
    );
  }

  const isLoading = isCreatingSession;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">{configData.agent.name}</CardTitle>
            <CardDescription className="mt-2">
              {configData.agent.description || "Inicia una conversación con nuestro agente"}
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Seguro
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Rápido
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nombre {configData.requiredFields.includes('name') && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Tu nombre completo"
              required={configData.requiredFields.includes('name')}
            />
          </div>

          {/* Campo Email */}
          {configData.requiredFields.includes('email') && (
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
                required
              />
            </div>
          )}

          {/* Campo Teléfono */}
          {configData.requiredFields.includes('phone') && (
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 234 567 8900"
                required
              />
            </div>
          )}

          <Button 
            onClick={handleStartChat}
            disabled={isLoading || (configData.requireUserData && !userData.name)}
            className="w-full gap-2"
            size="lg"
          >
            <MessageSquare className="h-4 w-4" />
            {isLoading ? "Iniciando chat..." : "Iniciar Chat"}
          </Button>

          {configData.customWelcomeMessage && (
            <div className="text-xs text-gray-500 text-center border-t pt-3">
              <p>{configData.customWelcomeMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}