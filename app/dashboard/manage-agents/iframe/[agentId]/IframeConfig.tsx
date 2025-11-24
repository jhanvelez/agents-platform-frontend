"use client";

import { useEffect, useState } from "react";
import { Copy, Eye, Settings, RefreshCw, Globe, Code, Shield, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toasts } from "@/lib/toasts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import {
  useGetPrivateConfigQuery,
  useCreatePublicConfigMutation,
  useUpdatePublicConfigMutation,
  useTogglePublicConfigMutation,
  useRegenerateSlugMutation,
} from "@/store/public-chat/private-public-chat.api";

interface IframeConfigProps {
  agentId: string;
}

export default function IframeConfig({ agentId }: IframeConfigProps) {
  const { data: configData, isLoading, refetch: refetchConfig } = useGetPrivateConfigQuery(agentId);
  const [createConfig, { isLoading: isCreating }] = useCreatePublicConfigMutation();
  const [updateConfig, { isLoading: isUpdating }] = useUpdatePublicConfigMutation();
  const [toggleConfig, { isLoading: isToggling }] = useTogglePublicConfigMutation();
  const [regenerateSlug, { isLoading: isRegenerating }] = useRegenerateSlugMutation();

  const [config, setConfig] = useState({
    isActive: false,
    requireUserData: false,
    requiredFields: ['name'],
    customWelcomeMessage: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    sessionTimeout: 30,
    maxMessagesPerSession: 100,
    enableRating: true,
    allowedDomains: [] as string[],
  });

  const [newDomain, setNewDomain] = useState('');
  const [hasConfig, setHasConfig] = useState(false);

  // Cargar datos reales de la API
  useEffect(() => {
    if (configData) {
      setConfig(configData);
      setHasConfig(true);
    }
  }, [configData]);

  const handleSaveConfig = async () => {
    try {
      if (hasConfig) {
        // Actualizar configuración existente
        await updateConfig({ 
          id: configData.id, 
          ...config 
        }).unwrap();
        toasts.success("Configuración actualizada", "Los cambios se guardaron correctamente.");
      } else {
        // Crear nueva configuración
        await createConfig({ 
          agentId, 
          ...config 
        }).unwrap();
        setHasConfig(true);
        toasts.success("Configuración creada", "El chat público ha sido configurado correctamente.");
      }
      refetchConfig();
    } catch (error) {
      toasts.error("Error", "No se pudieron guardar los cambios.");
    }
  };

  const handleToggleActive = async () => {
    try {
      await toggleConfig(configData.id).unwrap();
      toasts.success("Estado cambiado", "El estado del chat público ha sido actualizado.");
      refetchConfig();
    } catch (error) {
      toasts.error("Error", "No se pudo cambiar el estado.");
    }
  };

  const handleRegenerateSlug = async () => {
    try {
      await regenerateSlug(agentId).unwrap();
      toasts.success("Slug regenerado", "El enlace público ha sido regenerado.");
      refetchConfig();
    } catch (error) {
      toasts.error("Error", "No se pudo regenerar el slug.");
    }
  };

  const handleAddDomain = () => {
    if (newDomain && !config.allowedDomains.includes(newDomain)) {
      const updatedDomains = [...config.allowedDomains, newDomain];
      setConfig(prev => ({ ...prev, allowedDomains: updatedDomains }));
      setNewDomain('');
    }
  };

  const handleRemoveDomain = (domain: string) => {
    const updatedDomains = config.allowedDomains.filter(d => d !== domain);
    setConfig(prev => ({ ...prev, allowedDomains: updatedDomains }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toasts.success("Copiado", "Enlace copiado al portapapeles.");
  };

  const publicUrl = configData?.publicSlug 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://ia.bybinary.co'}/public/agents/chat/new/${configData.publicSlug}`
    : '';

  const embedCode = configData?.publicSlug 
    ? `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0" style="border: none; border-radius: 8px;"></iframe>`
    : '';

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <p>Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Chat Público</h1>
          <p className="text-muted-foreground">
            Configura el chat público para integrarlo en tu sitio web
          </p>
        </div>
        
        {configData && (
          <div className="flex items-center gap-4">
            <Badge variant={configData.isActive ? "default" : "secondary"}>
              {configData.isActive ? "Activo" : "Inactivo"}
            </Badge>
            <Button 
              onClick={handleToggleActive} 
              variant="outline"
              disabled={isToggling}
            >
              {configData.isActive ? "Desactivar" : "Activar"}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="embed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="embed" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Código Embed
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        {/* TAB: Código Embed */}
        <TabsContent value="embed" className="space-y-4">
          {!configData ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Primero debes crear la configuración del chat público
                </p>
                <Button onClick={handleSaveConfig} disabled={isCreating}>
                  Crear Configuración
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Enlace Público</CardTitle>
                  <CardDescription>
                    Comparte este enlace para acceder al chat público
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input value={publicUrl} readOnly />
                    <Button onClick={() => copyToClipboard(publicUrl)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </a>
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleRegenerateSlug} 
                    variant="outline"
                    disabled={isRegenerating}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerar Enlace
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Código de Integración (Iframe)</CardTitle>
                  <CardDescription>
                    Copia y pega este código en tu sitio web
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Textarea value={embedCode} readOnly className="font-mono text-sm" rows={4} />
                    <Button onClick={() => copyToClipboard(embedCode)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* TAB: Configuración */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Personaliza el comportamiento del chat público
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-user-data">Requerir datos del usuario</Label>
                  <p className="text-sm text-muted-foreground">
                    Los usuarios deben ingresar su nombre antes de chatear
                  </p>
                </div>
                <Switch
                  id="require-user-data"
                  checked={config.requireUserData}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, requireUserData: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Color Primario</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => 
                      setConfig(prev => ({ ...prev, primaryColor: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-color">Color Secundario</Label>
                  <Input
                    id="secondary-color"
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => 
                      setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="welcome-message">Mensaje de Bienvenida Personalizado</Label>
                <Textarea
                  id="welcome-message"
                  value={config.customWelcomeMessage}
                  onChange={(e) => 
                    setConfig(prev => ({ ...prev, customWelcomeMessage: e.target.value }))
                  }
                  placeholder="Escribe un mensaje de bienvenida personalizado..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-timeout">Tiempo de sesión (minutos)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={config.sessionTimeout}
                    onChange={(e) => 
                      setConfig(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="max-messages">Máximo de mensajes por sesión</Label>
                  <Input
                    id="max-messages"
                    type="number"
                    value={config.maxMessagesPerSession}
                    onChange={(e) => 
                      setConfig(prev => ({ ...prev, maxMessagesPerSession: parseInt(e.target.value) || 100 }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-rating">Habilitar calificación</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir a los usuarios calificar el chat
                  </p>
                </div>
                <Switch
                  id="enable-rating"
                  checked={config.enableRating}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, enableRating: checked }))
                  }
                />
              </div>

              <Button 
                onClick={handleSaveConfig} 
                disabled={isCreating || isUpdating}
              >
                {hasConfig ? "Actualizar Configuración" : "Crear Configuración"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Seguridad */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dominios Permitidos</CardTitle>
              <CardDescription>
                Restringe el chat público solo a estos dominios (deja vacío para permitir todos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="ejemplo.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                />
                <Button onClick={handleAddDomain}>
                  <Globe className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>

              {config.allowedDomains.length > 0 && (
                <div className="space-y-2">
                  <Label>Dominios permitidos:</Label>
                  {config.allowedDomains.map((domain) => (
                    <div key={domain} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{domain}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDomain(domain)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}