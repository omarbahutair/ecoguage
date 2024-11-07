import React, { useEffect, useState } from 'react';

interface IOption {
  value: any;
  label: string;
}

interface DropdownProps {
  options: IOption[];
  value?: any;
  onSelect: (value: any, option: IOption) => void;
  placeholder?: string;
  className?: string;
}

export default function Dropdown({
  options,
  value,
  onSelect,
  placeholder,
  className,
}: DropdownProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onClickOutside = () => {
      setIsVisible(false);
    };

    window.addEventListener('click', onClickOutside);

    return () => {
      window.removeEventListener('click', onClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <button
        className="p-3 hover:bg-neutral-50 w-full rounded border border-primary-fade"
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible((prev) => !prev);
        }}
      >
        {options.find((o) => o.value === value)?.value ?? placeholder}
      </button>
      <div
        className={`${isVisible ? 'animate-fade-in' : 'animate-fade-out'} absolute flex flex-col shadow bg-white w-full rounded top-full translate-y-2`}
      >
        {options.map((o) => (
          <button
            key={o.value}
            className="p-3 hover:bg-neutral-50"
            onClick={() => {
              onSelect(o.value, o);
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
