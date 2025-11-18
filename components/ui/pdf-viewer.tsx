'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, ExternalLink, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PdfViewerProps {
  fileUrl: string
  title: string
  description?: string
}

export function PdfViewer({ fileUrl, title, description }: PdfViewerProps) {
  const [scale, setScale] = useState<number>(1.0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.0))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  // Función para descargar el PDF
  const downloadPdf = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = `${title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fileUrl, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadPdf}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar
            </Button>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage <= 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Página
                </span>
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value)
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page)
                    }
                  }}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                  min="1"
                  max={totalPages}
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  de {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 2.0}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Visor de PDF con iframe */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 min-h-[600px] flex items-center justify-center">
        <div 
          className="bg-white dark:bg-gray-700 shadow-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          <iframe
            ref={iframeRef}
            src={`${fileUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-[600px] border-0"
            title={`PDF Viewer - ${title}`}
            onLoad={() => {
              // Intentar detectar el número total de páginas
              // Nota: Esto puede no funcionar en todos los navegadores por políticas de seguridad
              try {
                const iframe = iframeRef.current
                if (iframe?.contentDocument) {
                  // Esta es una aproximación, puede necesitar ajustes
                  console.log('PDF loaded successfully')
                }
              } catch (error) {
                console.log('Cannot access iframe content due to CORS')
              }
            }}
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Usa los controles para navegar y hacer zoom</span>
          <span>Formato: PDF</span>
        </div>
      </div>
    </div>
  )
}