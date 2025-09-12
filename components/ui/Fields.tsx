import { useId } from 'react'
import clsx from 'clsx'
import { ExclamationCircleIcon } from '@heroicons/react/16/solid'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-blue-500 sm:text-sm'

export function Label({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700"
    >
      {children}
    </label>
  )
}

export function TextField({
  label,
  span,
  type = 'text',
  error,
  textError,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'input'>, 'id'> & {
  label: string,
  span?: string,
  error: boolean,
  textError: string,
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
          <input
            id={id}
            type={type}
            {...props}
            
            className={`
              ${formClasses}
              col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-7 pl-3 -outline-offset-1 focus:outline-1 focus:-outline-offset-1 sm:pr-3 sm:text-sm/6
              ${error ? `outline-red-300 placeholder:text-red-300 focus:outline-red-600` : ``}
            `}
          />
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

export function SelectField({
  label,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'select'>, 'id'> & { label: string }) {
  let id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
    </div>
  )
}


export function ToggleField({
  label,
  type = 'text',
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'input'>, 'id'> & { label: string }) {
  let id = useId()

  return (
    <div className="relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 transition-colors duration-200 ease-in-out">
      <input
        id={id}
        {...props}
        name="setting"
        type="checkbox"
        className={`peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none rounded-full opacity-0 ${formClasses}`}
      />
      <div className="pointer-events-none absolute inset-0 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-primary" />
      <span className="pointer-events-none relative z-20 size-5 rounded-full bg-white shadow ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out peer-checked:translate-x-5" />
    </div>
  )
}