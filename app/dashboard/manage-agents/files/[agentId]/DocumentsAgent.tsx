"use client";

import { useEffect, useState } from "react";
import { Upload, FileText, Trash } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toasts } from "@/lib/toasts"

// Api
import {
  useUploadFileAgentMutation,
  useGetFilesAgentQuery,
  useDeleteFileAgentMutation,
} from "@/store/manage-agents/manage-agents.api";
import { Formik } from "formik";

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

  const { data: filesData, refetch: refetchFiles } = useGetFilesAgentQuery(agentId);

  const [uploadFileAgent, uploadFileAgentResponse] = useUploadFileAgentMutation();

  useEffect(() => {
    if (uploadFileAgentResponse.isSuccess) {
      toasts.success(
        "Exito",
        "El documento se cargo correctamente."
      );

      refetchFiles();
      setSelectedFile(null);
    }

    if (uploadFileAgentResponse.error) {
      toasts.error(
        "Error",
        "No se pudo cargar el documento, intentalo de nuevo."
      );
    }
  }, [uploadFileAgentResponse]);


  const [deleteFileAgent, deleteFileAgentResponse] = useDeleteFileAgentMutation();

  useEffect(() => {
    if (deleteFileAgentResponse.isSuccess) {
      toasts.success(
        "Exito",
        "El documento se elimino correctamente."
      );

      refetchFiles();
    }

    if (deleteFileAgentResponse.error) {
      toasts.error(
        "Error",
        "No se pudo eliminar el documento, intentalo de nuevo."
      );
    }
  }, [deleteFileAgentResponse]);


  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (filesData)
      setDocuments(filesData)
  }, [filesData])

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <CardHeader>
        <CardTitle>Gestión de Documentos</CardTitle>
        <CardDescription>Sube, consulta y administra tus documentos</CardDescription>
      </CardHeader>

      <Formik
        initialValues={{ file: null }}
        onSubmit={(values, { resetForm }) => {
          if (values.file) {
            uploadFileAgent({ agentId, file: values.file });
            resetForm();
          }
        }}
      >
        {({ setFieldValue, handleSubmit }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Card className="m-4 p-4">
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue("file", file);
                      setSelectedFile(file);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={!selectedFile}
                  isLoading={uploadFileAgentResponse.isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" /> Subir
                </Button>
              </div>
            </Card>
          </form>
        )}
      </Formik>

      {/* Document List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No hay documentos cargados...</p>
          ) : (
            Object.entries(documents).map(([year, months]) => (
              <div key={year} className="mb-6">
                <h2 className="text-lg font-bold mb-3">{year}</h2>
                {Object.entries(months).map(([month, docs]) => (
                  <div key={month} className="mb-4">
                    <h3 className="text-md font-semibold text-slate-600 mb-2">
                      Mes {month}
                    </h3>

                    <div className="space-y-2">
                      {docs.map((doc: any) => (
                        <Card
                          key={doc.id}
                          className="p-4 flex justify-between items-center bg-gray-50 "
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-primary" />
                            <div>
                              <p className="font-medium">{doc.fileName}</p>
                              <p className="text-xs text-slate-500">
                                {doc.mimeType} • {doc.createdAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={doc.driveUrl} target="_blank">Ver</a>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                deleteFileAgent({
                                  agentId: agentId,
                                  fileId: doc.id,
                                })
                              }
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
