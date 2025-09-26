import React, { useState } from 'react'
import Select from 'react-select'
import { ExclamationCircleIcon } from '@heroicons/react/16/solid'

interface Option {
  value: string
  label: string
}

interface PropsSelectSearch {
  colourOptions: Option[]
  isDisabled?: boolean
  isLoading?: boolean
  onChange: (value: Option | null) => void
  name: string
  value?: string;
  error?: boolean
  textError?: string
}

export default function SelectSearch({
  colourOptions,
  isDisabled,
  isLoading,
  onChange,
  name,
  value,
  error,
  textError,
}: PropsSelectSearch) {
  const [isClearable] = useState(true)
  const [isSearchable] = useState(true)
  const [isRtl] = useState(false)

  const handleChange = (value: Option | null) => {
    onChange(value)
  }

  return (
    <div className="w-full">
      <div className="relative">
        <Select
          classNamePrefix="select"
          defaultValue={colourOptions.filter(option => option.value == value)[0]}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isClearable={isClearable}
          isRtl={isRtl}
          isSearchable={isSearchable}
          name={name}
          options={colourOptions}
          onChange={handleChange}
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: error
                ? '#f87171' // rojo-400
                : state.isFocused
                  ? '#3b82f6' // azul-500
                  : base.borderColor,
              boxShadow: error
                ? '0 0 0 1px #ef4444' // rojo-500
                : state.isFocused
                  ? '0 0 0 1px #3b82f6'
                  : base.boxShadow,
              '&:hover': {
                borderColor: error ? '#ef4444' : '#3b82f6',
              },
            }),
          }}
        />

        {error && (
          <ExclamationCircleIcon
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-3 h-5 w-5 text-red-500"
          />
        )}
      </div>

      {error && textError && (
        <p className="mt-1 text-sm text-red-600">{textError}</p>
      )}
    </div>
  )
}
