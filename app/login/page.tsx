
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

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// Logo
import Logo from "@/public/logo.png";

// API
import {
  useLogInMutation,
  useGoogleLogInMutation,
} from "@/store/auth/auth.api"
import {
  useStoreUserMutation,
} from "@/store/users/users.api";

// Schema
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

  const [login, respoonseLogin] = useLogInMutation({});
  const [storeUser, storeUserResult] = useStoreUserMutation();

  const [googleLogin, googleLoginResponse] = useGoogleLogInMutation();

  const loginWithGoogle = (token: string) => {
    googleLogin(token);
  };

  useEffect(() => {
    if (googleLoginResponse.isSuccess) {
      toasts.success(
        "Exito",
        "Bienvenido a la aplicacion"
      )

      localStorage.setItem("accessToken", googleLoginResponse.data.access_token)

      dispatch(setUser({ user: googleLoginResponse.data.user }));
      dispatch(setAccessToken({ accessToken: googleLoginResponse.data.access_token }));

      router.push('/dashboard')
    }
  }, [googleLoginResponse])

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

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-2 text-sm text-muted-foreground">o</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                const token = credentialResponse.credential;

                // Opcional: decodificar datos básicos
                const userInfo: any = jwtDecode(token);

                window.location.href = "https://ia.bybinary.co:3001/auth/google"

                storeUser({
                  firstName: userInfo.given_name,
                  lastName: userInfo.family_name,
                  documentType: "CC",
                  documentId: "1",
                  phoneNumber: "",
                  email: userInfo.email,
                  password: userInfo.aud,
                  serviceStartSate: "",
                  isEmailConfirmed: false,
                  roles: [],
                });
                // Enviar token al backend
                // loginWithGoogle(token);
              }
            }}
            onError={() => {
              toasts.error("Error", "No se pudo iniciar sesión con Google");
            }}
          />

        </CardContent>
      </Card>
    </div>
  );
}