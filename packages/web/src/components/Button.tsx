import React, { useCallback } from 'react';
import Spinner from './Spinner';

interface ButtonProps {
  type: 'primary';
  size: 'medium';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function Button({
  type,
  size,
  isLoading,
  children,
}: ButtonProps) {
  const getSizeClassName = useCallback(() => {
    switch (size) {
      case 'medium':
        return 'text-base px-5 py-3 gap-3';
    }
  }, [size]);

  const getColorClassName = useCallback(() => {
    switch (type) {
      case 'primary':
        return 'text-white bg-primary';
    }
  }, [type]);

  return (
    <button
      className={`w-full rounded-lg flex items-center justify-center ${getSizeClassName()} ${getColorClassName()}`}
    >
      <Spinner isLoading={isLoading ?? false} color="white" size="medium" />
      {children}
    </button>
  );
}
