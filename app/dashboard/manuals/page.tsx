'use client'

import { useMemo } from 'react'
import { RefreshCw, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PdfViewer } from '@/components/ui/pdf-viewer'
import { toasts } from '@/lib/toasts'
import { useActiveManualsUrlsQuery } from '@/store/manuals/manuals.api'

interface ManualInfo {
  USER_MANUAL: {
    url: string | null
    label: string
    description: string
  }
  USAGE_MANUAL: {
    url: string | null
    label: string
    description: string
  }
}

export default function ManualsPage() {
  const { data: activeUrls, refetch, isLoading, error } = useActiveManualsUrlsQuery({})


    const manualInfo: ManualInfo = useMemo(() => {
      if (!activeUrls) return {
        USER_MANUAL: {
          url: null,
          label: 'Manual de Usuario',
          description: 'No se encontró el manual de usuario.'
        },
        USAGE_MANUAL: {
          url: null,
          label: 'Manual de Uso',
          description: 'No se encontró el manual de uso.'
        }
      };

      return {
        USER_MANUAL: {
          url: activeUrls?.USERMANUAL || null,
          label: 'Manual de Usuario',
          description: 'Guía completa para usuarios del sistema con instrucciones detalladas sobre todas las funcionalidades disponibles.'
        },
        USAGE_MANUAL: {
          url: activeUrls?.USAGEMANUAL || null,
          label: 'Manual de Uso',
          description: 'Documentación técnica y procedimientos avanzados para el uso eficiente de la plataforma.'
        }
      }
    }, [activeUrls]);

  const handleRefresh = () => {
    refetch()
    toasts.success('Actualizado', 'Manuales actualizados correctamente')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error al cargar manuales
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No se pudieron cargar los manuales. Por favor, intenta nuevamente.
          </p>
          <Button onClick={handleRefresh}>
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Manuales del Sistema
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Documentación completa y actualizada de la plataforma
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>

        {/* Manuales */}
        <div className="space-y-8">
          {Object.entries(manualInfo).map(([key, manual]) => (
            <div key={key} className="space-y-4">
              {/* Información del manual */}
              <div className="flex items-center justify-between">
                <div></div>
                
                {!manual.url && (
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">No disponible</span>
                  </div>
                )}
              </div>

              {/* Visor de PDF o estado vacío */}
              {manual.url ? (
                <PdfViewer
                  fileUrl={manual.url}
                  title={manual.label}
                  description={manual.description}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Manual no disponible
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    El {manual.label.toLowerCase()} no ha sido cargado aún.
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Contacta al administrador del sistema para solicitar este documento.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer informativo */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              ¿Necesitas ayuda adicional?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Si tienes preguntas específicas o necesitas asistencia técnica, no dudes en contactar al equipo de soporte.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📧 soporte@bybinary.com.co</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}