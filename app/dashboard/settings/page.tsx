import { User } from "lucide-react"

export default function Settings() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
      <p className="text-muted-foreground">Ajustes generales del sistema</p>
      <div className="text-center py-12">
        <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">Próximamente</p>
        <p className="text-muted-foreground">Esta funcionalidad estará disponible pronto</p>
      </div>
    </div>
  );
}