
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
  useForgotPasswordMutation,
} from "@/store/auth/auth.api"

// Schema
import {
  forgotPasswordInitialValues,
  forgotPasswordValidationSchema,
} from "@/shared/schemas/auth.schema"

import { toasts } from '@/lib/toasts'

export default function LoginPage() {
  const router = useRouter();

  const [forgotPassword, forgotPasswordResponse] = useForgotPasswordMutation({});

  useEffect(() => {
    if (forgotPasswordResponse.isSuccess) {
      toasts.success(
        "Exito",
        "Se ha enviado el correo de recuperación"
      );

      // router.back();
    }

    if (forgotPasswordResponse.isError) {
      toasts.error(
        "error",
        "Ha ocurrido un error, intenta de nuevo"
      )
    }
  }, [forgotPasswordResponse]);

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
            initialValues={forgotPasswordInitialValues}
            validationSchema={forgotPasswordValidationSchema}
            onSubmit={(values, formikHelopers) => {
              forgotPassword(values);
              formikHelopers.resetForm();
            }}
          >
            {({ handleSubmit, errors, handleChange, values, isSubmitting }) => {
              return (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Correo electrónico</Label>
                    <Input
                      id="username"
                      type="text"
                      name="email"
                      placeholder="Ingresa tu usuario"
                      value={values.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button type="submit" onClick={() => {
                    handleSubmit();
                  }} className="w-full" disabled={!errors || isSubmitting}>
                    {isSubmitting ? "Enviandoo email..." : "Enviar email de recuperación"}
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