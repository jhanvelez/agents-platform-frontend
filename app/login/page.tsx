
"use client";

import { useRouter } from "next/navigation";

import { Formik } from "formik"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image";
import { Eye, EyeOff, Bot } from "lucide-react"
import { useDispatch } from 'react-redux'

// Logo
import Logo from "@/public/logo.png";

import {
  useLogInMutation
} from "@/store/auth/auth.api"

import {
  authInitialValues,
  authValidationSchema,
} from "@/shared/schemas/auth.schema"

import { toasts } from '@/lib/toasts'

import {
  setUser,
  setAccessToken,
} from '@/store/auth/auth.slice'

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)

  const [login, respoonseLogin] = useLogInMutation({})

    useEffect(() => {
    if (respoonseLogin.isSuccess) {
      toasts.success(
        "Exito",
        "Bienvenido a la aplicacion"
      )

      localStorage.setItem("accessToken", respoonseLogin.data.access_token)

      dispatch(setUser({ user: respoonseLogin.data.user }));
      dispatch(setAccessToken({ accessToken: respoonseLogin.data.access_token }));

      router.push('/dashboard')
    }

    if (respoonseLogin.isError) {
      toasts.error(
        "error",
        "Usuario o contraseña incorrectos"
      )
    }
  }, [respoonseLogin]);

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
          <CardDescription>Ingresa tus credenciales para acceder a la plataforma de agentes de ByBinary</CardDescription>
        </CardHeader>
        <CardContent>

      <Formik
        enableReinitialize
        initialValues={authInitialValues}
        validationSchema={authValidationSchema}
        onSubmit={(values, formikHelopers) => {
          login(values);
          formikHelopers.resetForm();
        }}
      >
        {({ handleSubmit, errors, handleChange, values, isSubmitting }) => {
          return (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
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
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={values.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent hover:text-primary hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!errors}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" onClick={() => {
                handleSubmit();
              }} className="w-full" disabled={!errors || isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
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