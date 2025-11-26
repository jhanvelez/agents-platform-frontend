"use client";

import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, BuildingOfficeIcon } from '@heroicons/react/20/solid'
import { useUser } from "@/hooks/useUser";
import { useAbility } from "@/providers/AbilityProvider";

export function Header() {
  const user = useUser();
  const router = useRouter();
  const ability = useAbility();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Título */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full flex items-center justify-center">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              <span className="font-light capitalize">{user.tenant}</span>
            </h1>
          </div>

          {/* Área de navegación o perfil */}
          <Menu as="div" className="relative inline-block">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
              {user.firstName}{" "}{user.lastName}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="px-4 py-3">
                <p className="text-sm">Iniciado sesión como</p>
                <p className="truncate text-sm font-medium text-gray-900">
                  {user.email}
                </p>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Soporte
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Licencia
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    onClick={async () => {
                      localStorage.clear();
                      ability.update([]);
                      await router.push("/");
                      location.reload();
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