import React, { useCallback, useState, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
  error?: string;
  label?: string;
}

export default function Input({
  setValue,
  value,
  className,
  error,
  label,
  placeholder,
  type = 'text',
  ...rest
}: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getType = useCallback(() => {
    if (type === 'password') {
      return isVisible ? 'text' : 'password';
    }

    return type;
  }, [type, isVisible]);

  return (
    <div className={`${className ?? ''} flex flex-col gap-1`}>
      {label && (
        <label tabIndex={-1} className="text-primary-fade font-semibold">
          {label}
        </label>
      )}
      <div className="flex rounded-lg shadow border border-transparent focus:border-primary bg-white">
        <input
          className="px-5 py-3 outline-none w-full"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          type={getType()}
          {...rest}
        />
        {type === 'password' ? (
          <button
            tabIndex={-1}
            type="button"
            className="w-12"
            onClick={() => {
              setIsVisible((prev) => !prev);
            }}
          >
            <i className={`fa-solid fa-eye${isVisible ? '-slash' : ''}`} />
          </button>
        ) : null}
      </div>
      <p tabIndex={-1} className="text-sm text-red-500">
        {error}
      </p>
    </div>
  );
}
