'use client'

import { useState, useEffect } from "react"
import { FileText, Download, Upload, RefreshCw, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Formik } from "formik"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toasts } from '@/lib/toasts'

// Importamos el API
import {
  useManualsQuery,
  useCreateManualMutation,
  useActivateManualMutation,
  useDeleteManualMutation,
  useActiveManualsUrlsQuery,
} from "@/store/manuals/manuals.api"

// Types para los manuales
interface Manual {
  id: string
  type: string
  name: string
  fileName: string
  fileUrl: string
  isActive: boolean
  version: string
  description?: string
  createdAt: string
  updatedAt: string
  uploadedBy: string
}

interface ManualTypeConfig {
  type: string
  label: string
  description: string
  allowedFormats: string[]
  maxSize: number
}

const MANUAL_TYPES: ManualTypeConfig[] = [
  {
    type: "USER_MANUAL",
    label: "Manual de Usuario",
    description: "Documentación para los usuarios del sistema",
    allowedFormats: [".pdf", ".doc", ".docx"],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  {
    type: "USAGE_MANUAL",
    label: "Manual de Uso",
    description: "Guía de uso y procedimientos del sistema",
    allowedFormats: [".pdf", ".doc", ".docx"],
    maxSize: 10 * 1024 * 1024, // 10MB
  }
]

export default function Settings() {
  // Queries
  const { data: manualsData, refetch: refetchManuals, isLoading: manualsLoading } = useManualsQuery({})
  const { data: activeUrls, refetch: refetchActiveUrls } = useActiveManualsUrlsQuery({})
  
  // Mutations
  const [createManual, { isLoading: createLoading }] = useCreateManualMutation()
  const [activateManual, { isLoading: activateLoading }] = useActivateManualMutation()
  const [deleteManual, { isLoading: deleteLoading }] = useDeleteManualMutation()

  const manuals: Manual[] = manualsData || []
  const loading = manualsLoading || createLoading || activateLoading || deleteLoading

  const getActiveManual = (type: string) => {
    return manuals.find(manual => manual.type === type && manual.isActive)
  }

  const handleFileUpload = async (type: string, file: File, formData: any) => {
    try {
      const manualData = {
        type,
        name: formData.name || file.name.replace(/\.[^/.]+$/, ""),
        version: formData.version || "1.0.0",
        description: formData.description,
      }

      await createManual({ manualData, file }).unwrap()
      toasts.success("Éxito", "Manual cargado y activado correctamente")
      refetchManuals()
      refetchActiveUrls()
    } catch (error: any) {
      console.error('Error uploading manual:', error)
      toasts.error("Error", error?.data?.message || "No se pudo cargar el manual")
    }
  }

  const handleSetActive = async (manualId: string) => {
    try {
      await activateManual({ id: manualId }).unwrap()
      toasts.success("Éxito", "Manual activado correctamente")
      refetchManuals()
      refetchActiveUrls()
    } catch (error: any) {
      toasts.error("Error", error?.data?.message || "No se pudo activar el manual")
    }
  }

  const handleDeleteManual = async (manualId: string) => {
    try {
      await deleteManual({ id: manualId }).unwrap()
      toasts.success("Éxito", "Manual eliminado correctamente")
      refetchManuals()
      refetchActiveUrls()
    } catch (error: any) {
      toasts.error("Error", error?.data?.message || "No se pudo eliminar el manual")
    }
  }

  const handleRefresh = () => {
    refetchManuals()
    refetchActiveUrls()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Manuales</h2>
          <p className="text-muted-foreground text-sm">
            Administre los manuales del sistema - Solo puede haber uno activo por tipo
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <div className="space-y-8">
        {MANUAL_TYPES.map((manualType) => {
          const activeManual = getActiveManual(manualType.type)
          const manualTypeManuals = manuals.filter(manual => manual.type === manualType.type)
          
          return (
            <div key={manualType.type} className="divide-y divide-gray-200 dark:divide-white/10 border border-gray-200 dark:border-white/10 rounded-lg">
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                    {manualType.label}
                  </h2>
                  <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                    {manualType.description}
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Formatos permitidos: {manualType.allowedFormats.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tamaño máximo: {manualType.maxSize / (1024 * 1024)}MB
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  {/* Estado actual del manual */}
                  <div className="mb-6 p-4 border border-gray-200 dark:border-white/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Manual actual
                          </h3>
                          {activeManual ? (
                            <div className="flex items-center space-x-2 mt-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600 dark:text-green-400">
                                Activo - v{activeManual.version}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 mt-1">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600 dark:text-red-400">
                                No hay manual activo
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {activeManual && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => window.open(activeManual.fileUrl, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                            Descargar
                          </Button>
                        </div>
                      )}
                    </div>

                    {activeManual && (
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Nombre:</span>
                          <p className="font-medium">{activeManual.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Versión:</span>
                          <p className="font-medium">v{activeManual.version}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Subido:</span>
                          <p className="font-medium">
                            {new Date(activeManual.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Archivo:</span>
                          <p className="font-medium">{activeManual.fileName}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500 dark:text-gray-400">Descripción:</span>
                          <p className="font-medium">{activeManual.description || 'Sin descripción'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lista de manuales anteriores */}
                  {manualTypeManuals.length > 1 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Versiones anteriores
                      </h4>
                      <div className="space-y-2">
                        {manualTypeManuals
                          .filter(manual => !manual.isActive)
                          .map(manual => (
                            <div key={manual.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-white/10 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">{manual.name}</p>
                                  <p className="text-xs text-gray-500">v{manual.version} - {new Date(manual.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSetActive(manual.id)}
                                  disabled={loading}
                                >
                                  Activar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteManual(manual.id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  {/* Formulario de carga */}
                  <Formik
                    initialValues={{
                      name: '',
                      version: '',
                      description: '',
                      file: null as File | null
                    }}
                    onSubmit={async (values, { resetForm }) => {
                      if (!values.file) {
                        toasts.error("Error", "Debe seleccionar un archivo")
                        return
                      }
                      await handleFileUpload(manualType.type, values.file, values)
                      resetForm()
                    }}
                  >
                    {({ handleSubmit, setFieldValue, values, isSubmitting }) => (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            label="Nombre del manual"
                            span="Opcional"
                            value={values.name}
                            onChange={(e) => setFieldValue('name', e.target.value)}
                            placeholder="Ej: Manual de Usuario v2.0"
                          />
                          
                          <Input
                            id="version"
                            name="version"
                            type="text"
                            label="Versión"
                            span="Opcional"
                            value={values.version}
                            onChange={(e) => setFieldValue('version', e.target.value)}
                            placeholder="Ej: 1.0.0"
                          />
                        </div>

                        <div>
                          <Input
                            id="description"
                            name="description"
                            type="text"
                            label="Descripción"
                            span="Opcional"
                            value={values.description}
                            onChange={(e) => setFieldValue('description', e.target.value)}
                            placeholder="Breve descripción del contenido..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Archivo del manual
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Click para subir</span> o arrastra el archivo
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {manualType.allowedFormats.join(', ')} (MAX. {manualType.maxSize / (1024 * 1024)}MB)
                                </p>
                              </div>
                              <input
                                id="file"
                                name="file"
                                type="file"
                                className="hidden"
                                accept={manualType.allowedFormats.join(',')}
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    if (file.size > manualType.maxSize) {
                                      toasts.error("Error", `El archivo es demasiado grande. Máximo: ${manualType.maxSize / (1024 * 1024)}MB`)
                                      return
                                    }
                                    setFieldValue('file', file)
                                    if (!values.name) {
                                      setFieldValue('name', file.name.replace(/\.[^/.]+$/, ""))
                                    }
                                    if (!values.version) {
                                      // Intentar extraer versión del nombre del archivo
                                      const versionMatch = file.name.match(/(\d+\.\d+\.\d+)|(\d+\.\d+)/)
                                      if (versionMatch) {
                                        setFieldValue('version', versionMatch[0])
                                      }
                                    }
                                  }
                                }}
                              />
                            </label>
                          </div>
                          {values.file && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                              Archivo seleccionado: {values.file.name}
                            </p>
                          )}
                        </div>

                        <Button
                          onClick={() => handleSubmit()}
                          disabled={!values.file || loading}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {loading ? 'Subiendo...' : 'Subir Manual'}
                        </Button>
                      </div>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}