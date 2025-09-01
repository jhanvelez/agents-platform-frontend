import React, { useEffect, useState } from 'react';
import Select, { OptionProps } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface PropsSelectSearch {
  colourOptions: Option[],
  isDisabled?: boolean;
  isLoading?: boolean;
  onChange: (value: Option) => void;
  name: string,
}

export default ({
  colourOptions,
  isDisabled,
  isLoading,
  onChange,
  name
}: PropsSelectSearch) => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isRtl, setIsRtl] = useState(false);

  const handleChange = (value: any) => {
    onChange(value);
  }

  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={colourOptions[0]}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name={name}
        options={colourOptions}
        onChange={handleChange}
      />
    </>
  );
};