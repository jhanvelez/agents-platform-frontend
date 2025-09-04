'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { classNames } from "@/shared/utils/classnames";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw } from "lucide-react"

const navigation = [
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: false },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
  { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: true },
]
const teams = [
  { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
  { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
  { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
]

export default function Profile() {
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

        <div className="xl:pl-72">
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
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        label="Nombres(s)"
                        span="Obligatorio"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        label="Apellidos"
                        span="Obligatorio"
                      />
                    </div>

                    <div className="col-span-full">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="email"
                        label="Correo eléctronico"
                        span="Obligatorio"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="number"
                        label="Telefono"
                        span="Obligatorio"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <Button
                      onClick={(() => {
                        console.log('ok')
                      })}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Cambiar contraseña</h2>
                  <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-400">
                    Actualiza la contraseña asociada a tu cuenta.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="password"
                        label="Contraseña actual"
                        span="Obligatorio"
                      />
                    </div>

                    <div className="col-span-full">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="password"
                        label="Contraseña nueva"
                        span="Obligatorio"
                      />
                    </div>

                    <div className="col-span-full">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="password"
                        label="Repetir contraseña nueva"
                        span="Obligatorio"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <Button
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
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
