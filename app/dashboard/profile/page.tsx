'use client'

import { RefreshCw } from "lucide-react"
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/users/userSlice";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

  const { data: userData, isError } = useUserQuery({ search: "" });

  function mapPermissions(apiPermissions: { action: string; subject: string }[]) {
    return apiPermissions.map((p) => {
      const [subject, action] = p.action.split(".");
      const formattedSubject = subject.charAt(0) + subject.slice(1);

      return `${action}:${formattedSubject}`;
    });
  }

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
      toasts.success(
        "Exito",
        "Contraseña cambiada con exito."
      );
    }

    if (resetPasswordResult.isError) {
      toasts.error(
        "Error",
        "No se pudo cambiar la contraseña."
      );
    }
  }, [resetPasswordResult]);

  const [updateInfo, updateInfoResult] = useUpdateInfoMutation();

  useEffect(() => {
    if (updateInfoResult.isSuccess) {
      toasts.success(
        "Exito",
        "Información actualizada correctamente"
      );

    }

    if (updateInfoResult.isError) {
      if ((updateInfoResult.error as any)?.data?.message) {
        toasts.error(
          "error",
          (updateInfoResult.error as any)?.data?.message
        )
        return;
      }
    }
  }, [updateInfoResult]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
            <p className="text-muted-foreground text-sm">
              Edite tu perfil, y todos sus datos personales.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => {
              console.log('OK')
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Refrescar perfil
          </Button>
        </div>

        <div className="justify-center">
          <main>
            {/* Settings forms */}
            <div className="divide-y divide-gray-200 dark:divide-white/10">
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Información personal</h2>
                  <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                    Utilice una dirección permanente donde pueda recibir correo.
                  </p>
                </div>

                <Formik
                  enableReinitialize
                  initialValues={user ?? userBasicInitialValues}
                  validationSchema={userBasicValidationSchema}
                  onSubmit={(values, formikHelopers) => {
                    updateInfo(values);
                    formikHelopers.resetForm();
                  }}
                >
                  {({ handleSubmit, errors, handleChange, values }) => {
                    return (
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                          <div className="col-span-full flex items-center gap-x-8">
                            <img
                              alt=""
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              className="size-24 flex-none rounded-lg bg-gray-100 object-cover outline -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10"
                            />
                            <div>
                              <Button
                                onClick={(() => {
                                  console.log('ok')
                                })}
                              >
                                Camiar imagen
                              </Button>
                              <p className="mt-2 text-xs/5 text-gray-500 dark:text-gray-400">JPG, GIF or PNG. 1MB max.</p>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <Input
                              id="documentId"
                              name="documentId"
                              type="number"
                              label="N` de documento"
                              span="Obligatorio"
                              value={values.documentId}
                              onChange={handleChange}
                              error={!!errors.documentId}
                              textError={errors.documentId}
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <Input
                              id="phoneNumber"
                              name="phoneNumber"
                              type="number"
                              label="Telefono"
                              span="Opcional"
                              value={values.phoneNumber}
                              onChange={handleChange}
                              error={!!errors.phoneNumber}
                              textError={errors.phoneNumber}
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <Input
                              id="firstName"
                              name="firstName"
                              type="text"
                              label="Nombres(s)"
                              span="Obligatorio"
                              autoComplete="off"
                              onChange={handleChange}
                              value={values.firstName}
                              error={!!errors.firstName}
                              textError={errors.firstName}
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <Input
                              id="lastName"
                              name="lastName"
                              type="text"
                              label="Apellidos"
                              span="Obligatorio"
                              onChange={handleChange}
                              value={values.lastName}
                              error={!!errors.lastName}
                              textError={errors.lastName}
                            />
                          </div>

                          <div className="col-span-full">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              label="Correo eléctronico"
                              span="Obligatorio"
                              onChange={handleChange}
                              value={values.email}
                              error={!!errors.email}
                              textError={errors.email}
                            />
                          </div>
                        </div>

                        <div className="mt-8 flex">
                          <Button
                            onClick={(() => {
                              console.log(errors)
                              handleSubmit();
                            })}
                          >
                            Guardar cambios
                          </Button>
                        </div>
                      </div>
                    );
                  }}
                </Formik>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Cambiar contraseña</h2>
                  <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                    Actualiza la contraseña asociada a tu cuenta.
                  </p>
                </div>

                <Formik
                  enableReinitialize
                  initialValues={passwordChangeInitialValues}
                  validationSchema={passwordChangeValidationSchema}
                  onSubmit={(values, formikHelopers) => {
                    resetPassword({
                      currentPassword: values.currentPassword,
                      newPassword: values.newPassword,
                    });

                    formikHelopers.resetForm();
                  }}
                >
                  {({ handleSubmit, errors, handleChange, values }) => {
                    return (
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                          <div className="col-span-full">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              label="Contraseña actual"
                              span="Obligatorio"
                              value={values.currentPassword}
                              onChange={handleChange}
                              error={!!errors.currentPassword}
                              textError={errors.currentPassword}
                            />
                          </div>

                          <div className="col-span-full">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              label="Contraseña nueva"
                              span="Obligatorio"
                              value={values.newPassword}
                              onChange={handleChange}
                              error={!!errors.newPassword}
                              textError={errors.newPassword}
                            />
                          </div>

                          <div className="col-span-full">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              label="Repetir contraseña nueva"
                              span="Obligatorio"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              error={!!errors.confirmPassword}
                              textError={errors.confirmPassword}
                            />
                          </div>
                        </div>

                        <div className="mt-8 flex">
                          <Button
                            onClick={() => {
                              handleSubmit();
                            }}
                          >
                            Actualizar contraseña
                          </Button>
                        </div>
                      </div>
                    );
                  }}
                </Formik>
              </div>

              {/*
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Log out other sessions</h2>
                  <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                    Please enter your password to confirm you would like to log out of your other sessions across all of
                    your devices.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="logout-password"
                        className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                      >
                        Your password
                      </label>
                      <div className="mt-2">
                        <input
                          id="logout-password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                    >
                      Log out other sessions
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Delete account</h2>
                  <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                    No longer want to use our service? You can delete your account here. This action is not reversible.
                    All information related to this account will be deleted permanently.
                  </p>
                </div>

                <form className="flex items-start md:col-span-2">
                  <button
                    type="submit"
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 dark:bg-red-500 dark:shadow-none dark:hover:bg-red-400"
                  >
                    Yes, delete my account
                  </button>
                </form>
              </div>
              */}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
