"use client";

import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Bot } from "lucide-react";

export function Header() {
  const router = useRouter();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Título */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center text-white font-bold text-sm bg-black rounded-sm">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="text-xl">
                  <Bot className="w-full h-full text-neon" />
                </div>
              </div>
            </div>

            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              Sustent<span className="font-thin">IA</span>tec
            </h1>
          </div>

          {/* Área de navegación o perfil */}
          <Menu as="div" className="relative inline-block">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
              Cuenta
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="px-4 py-3">
                <p className="text-sm">Signed in as</p>
                <p className="truncate text-sm font-medium text-gray-900">tom@example.com</p>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Account settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Support
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    License
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    onClick={async () => {
                      localStorage.clear();
                      await router.push("/");
                    }}
                  >
                    Cerrar sesión
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </header>
  );
}