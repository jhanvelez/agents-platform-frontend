import { useId } from 'react'

import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { ExclamationCircleIcon } from '@heroicons/react/16/solid'

import { Label } from "./Fields"

interface Option {
  value: number | string;
  label: string;
}

export function Select({
  label,
  span,
  error,
  textError,
  options,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'select'>, 'id'> & {
  label: string,
  span?: string,
  error: boolean,
  textError: string,
  options: Option[]
}) {
  let id = useId()
  return (
    <>
      <div className={className}>
        <div className="flex justify-between">
          {label && <Label id={id}>{label}</Label>}

          {span &&
            <span id={`span-${id}`} className="text-sm/6 text-gray-500">
              {span}
            </span>
          }
        </div>
        <div className="grid grid-cols-1">
          <select
            id={id}
            {...props}
            className="col-start-1 row-start-1 w-full rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 -outline-offset-1 outline-gray-200 focus-visible:outline-1 focus-visible:-outline-offset-1 sm:text-sm/6"
          >
            <option defaultValue={0}>
              -- Seleccione un valor --
            </option>
            {options.map(option => {
              return (
                <option key={option.value} value={option.value}>{option.label}</option>
              )
            })}
          </select>

          {error && (
            <ExclamationCircleIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
            />
          )}
        </div>

        {error && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {textError}
          </p>
        )}
      </div>
    </>
  )
}
