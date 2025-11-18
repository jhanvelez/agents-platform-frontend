'use client'

import { RefreshCw, User, Mail, Phone, IdCard, Shield, Key, Camera, Save, CheckCircle, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/users/userSlice";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useUser } from "@/hooks/useUser";

import {
  userBasicInitialValues,
  userBasicValidationSchema,
  passwordChangeInitialValues,
  passwordChangeValidationSchema,
} from "@/shared/schemas/user.schema"

import {
  useUpdateInfoMutation,
  useUserResetPasswordMutation,
} from "@/store/users/users.api"
import { useUserQuery } from "@/store/users/users.api";

import { toasts } from '@/lib/toasts'

export default function Profile() {
  const user = useUser();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('personal');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: userData, isError, refetch } = useUserQuery({ search: "" });

  function mapPermissions(apiPermissions: { action: string; subject: string }[]) {
    return apiPermissions.map((p) => {
      const [subject, action] = p.action.split(".");
      const formattedSubject = subject.charAt(0) + subject.slice(1);
      return `${action}:${formattedSubject}`;
    });
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toasts.success("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      toasts.error("Error", "No se pudo actualizar el perfil");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (userData) {
      dispatch(
        setUser({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          documentId: userData.documentId,
          phoneNumber: userData.phoneNumber,
          tenant: userData.tenant,
          permissions: mapPermissions(userData.roles[0]?.permissions || []),
          role: userData.roles[0]?.name || "viewer",
        })
      );
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [userData, isError, dispatch]);

  const [resetPassword, resetPasswordResult] = useUserResetPasswordMutation();

  useEffect(() => {
    if (resetPasswordResult.isSuccess) {
      toasts.success("Éxito", "Contraseña cambiada con éxito");
    }

    if (resetPasswordResult.isError) {
      toasts.error("Error", "No se pudo cambiar la contraseña");
    }
  }, [resetPasswordResult]);

  const [updateInfo, updateInfoResult] = useUpdateInfoMutation();

  useEffect(() => {
    if (updateInfoResult.isSuccess) {
      toasts.success("Éxito", "Información actualizada correctamente");
    }

    if (updateInfoResult.isError) {
      if ((updateInfoResult.error as any)?.data?.message) {
        toasts.error("Error", (updateInfoResult.error as any)?.data?.message);
      }
    }
  }, [updateInfoResult]);

  // Navegación lateral
  const navigationItems = [
    { id: 'personal', label: 'Información Personal', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Mi Perfil
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Gestiona tu información personal y configuración de seguridad
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navegación Lateral */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Navegación</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Contenido Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Información Personal */}
            {activeSection === 'personal' && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-blue-500" />
                    <div>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>
                        Actualiza tu información personal y datos de contacto
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Formik
                    enableReinitialize
                    initialValues={user ?? userBasicInitialValues}
                    validationSchema={userBasicValidationSchema}
                    onSubmit={(values, formikHelpers) => {
                      updateInfo(values);
                      formikHelpers.resetForm();
                    }}
                  >
                    {({ handleSubmit, errors, handleChange, values, dirty }) => (
                      <div className="space-y-6">
                        {/* Avatar y Foto de Perfil */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                alt="Foto de perfil"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                className="size-24 rounded-lg bg-gray-100 object-cover shadow-md border-2 border-white dark:border-gray-700"
                              />
                              <button className="absolute -bottom-2 -right-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors">
                                <Camera className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Foto de perfil
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              JPG, PNG o GIF. Tamaño máximo 1MB.
                            </p>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Camera className="h-4 w-4" />
                              Cambiar imagen
                            </Button>
                          </div>
                        </div>

                        {/* Información del Usuario */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            label="Nombres"
                            span="Obligatorio"
                            autoComplete="given-name"
                            onChange={handleChange}
                            value={values.firstName}
                            error={!!errors.firstName}
                            textError={errors.firstName}
                          />

                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            label="Apellidos"
                            span="Obligatorio"
                            autoComplete="family-name"
                            onChange={handleChange}
                            value={values.lastName}
                            error={!!errors.lastName}
                            textError={errors.lastName}
                          />

                          <Input
                            id="documentId"
                            name="documentId"
                            type="number"
                            label="Número de documento"
                            span="Obligatorio"
                            onChange={handleChange}
                            value={values.documentId}
                            error={!!errors.documentId}
                            textError={errors.documentId}
                          />

                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            label="Teléfono"
                            span="Opcional"
                            autoComplete="tel"
                            onChange={handleChange}
                            value={values.phoneNumber}
                            error={!!errors.phoneNumber}
                            textError={errors.phoneNumber}
                          />

                          <div className="md:col-span-2">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              label="Correo electrónico"
                              span="Obligatorio"

                              autoComplete="email"
                              onChange={handleChange}
                              value={values.email}
                              error={!!errors.email}
                              textError={errors.email}
                            />
                          </div>
                        </div>

                        {/* Información Adicional */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div>
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Rol del sistema
                            </span>
                            <div className="mt-1">
                              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
                                {user?.role || 'Usuario'}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Organización
                            </span>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                              {user?.tenant || 'No especificada'}
                            </p>
                          </div>
                        </div>

                        {/* Botón de Guardar */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            {dirty ? (
                              <>
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                Tienes cambios sin guardar
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Todos los cambios guardados
                              </>
                            )}
                          </div>
                          <Button
                            onClick={() => handleSubmit()}
                            disabled={!dirty || updateInfoResult.isLoading}
                            className="gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {updateInfoResult.isLoading ? 'Guardando...' : 'Guardar Cambios'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            )}

            {/* Seguridad */}
            {activeSection === 'security' && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-500" />
                    <div>
                      <CardTitle>Seguridad y Contraseña</CardTitle>
                      <CardDescription>
                        Actualiza tu contraseña y configuración de seguridad
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Formik
                    enableReinitialize
                    initialValues={passwordChangeInitialValues}
                    validationSchema={passwordChangeValidationSchema}
                    onSubmit={(values, formikHelpers) => {
                      resetPassword({
                        currentPassword: values.currentPassword,
                        newPassword: values.newPassword,
                      });
                      formikHelpers.resetForm();
                    }}
                  >
                    {({ handleSubmit, errors, handleChange, values, dirty }) => (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            label="Contraseña actual"
                            span="Obligatorio"
                            onChange={handleChange}
                            value={values.currentPassword}
                            error={!!errors.currentPassword}
                            textError={errors.currentPassword}
                          />

                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            label="Contraseña nueva"
                            span="Obligatorio"
                            onChange={handleChange}
                            value={values.newPassword}
                            error={!!errors.newPassword}
                            textError={errors.newPassword}
                          />

                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Repetir contraseña nueva"
                            span="Obligatorio"
                            onChange={handleChange}
                            value={values.confirmPassword}
                            error={!!errors.confirmPassword}
                            textError={errors.confirmPassword}
                          />
                        </div>

                        {/* Consejos de Seguridad */}
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Consejos de seguridad
                          </h4>
                          <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                            <li>• Usa al menos 8 caracteres</li>
                            <li>• Incluye mayúsculas, minúsculas y números</li>
                            <li>• Evita contraseñas comunes o personales</li>
                            <li>• No reutilices contraseñas antiguas</li>
                          </ul>
                        </div>

                        {/* Botón de Actualizar */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            {dirty ? (
                              <>
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                Listo para actualizar contraseña
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Completa el formulario para cambiar contraseña
                              </>
                            )}
                          </div>
                          <Button
                            onClick={() => handleSubmit()}
                            disabled={!dirty || resetPasswordResult.isLoading}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                          >
                            <Key className="h-4 w-4" />
                            {resetPasswordResult.isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Formik>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}