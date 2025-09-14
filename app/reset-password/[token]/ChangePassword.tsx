
"use client";

import { useRouter } from "next/navigation";

import Image from "next/image"
import { Formik } from "formik"
import { useEffect } from "react"
import { useDispatch } from 'react-redux'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Logo
import Logo from "@/public/logo.png";

// API
import {
  useResetPasswordMutation,
} from "@/store/auth/auth.api"

// Schema
import {
  resetPasswordInitialValues,
  resetPasswordValidationSchema,
} from "@/shared/schemas/auth.schema"

import { toasts } from '@/lib/toasts'


interface ChangePasswordProps {
  token: string;
}

export default function ChangePassword({ token }: ChangePasswordProps) {
  const router = useRouter();

  const [resetPassword, resetPasswordResponse] = useResetPasswordMutation({});

  useEffect(() => {
    if (resetPasswordResponse.isSuccess) {
      toasts.success(
        "Exito",
        "Se ha enviado el correo de recuperación"
      );

      // router.back();
    }

    if (resetPasswordResponse.isError) {
      toasts.error(
        "error",
        "Ha ocurrido un error, intenta de nuevo"
      )
    }
  }, [resetPasswordResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex justify-center mb-4">
              <Image
                src={Logo}
                alt="Logo"
                className="w-28"
              />
            </div>
            {/*<Bot className="h-12 w-12 text-primary" />*/}
          </div>
          <CardTitle className="text-2xl">Agentes IA ByBinary</CardTitle>
          <CardDescription>Ingresa tu correo electrónico par recuperar su contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            enableReinitialize
            initialValues={resetPasswordInitialValues}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={(values, formikHelopers) => {
              resetPassword({
                token: token,
                password: values.password,
              });
              formikHelopers.resetForm();
            }}
          >
            {({ handleSubmit, errors, handleChange, values, isSubmitting }) => {
              return (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="********"
                      value={values.password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contrseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="********"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button type="submit" onClick={() => {
                    handleSubmit();
                  }} className="w-full" disabled={!errors || isSubmitting}>
                    {isSubmitting ? "Cambiando contrasenña..." : "Cambiar contraseña"}
                  </Button>
                </form>
              );
            }}
          </Formik>

        </CardContent>
      </Card>
    </div>
  );
}