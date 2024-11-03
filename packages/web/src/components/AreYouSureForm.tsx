import React, { useState } from 'react';
import Spinner from './Spinner';

interface AreYouSureFormProps {
  onConfirm?: (
    setIsLoading: (isLoading: boolean) => void,
  ) => Promise<void> | void;
  onCancel?: () => void;
  title?: string;
  confirmText?: string;
}

export default function AreYouSureForm({
  onConfirm,
  onCancel,
  confirmText,
  title,
}: AreYouSureFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm?.(setIsLoading);
      }}
    >
      <header>
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <footer className="flex flex-col gap-1 sm:flex-row">
        <button
          disabled={isLoading}
          type="button"
          onClick={onCancel}
          className="w-full text-center px-5 py-3 border border-primary-fade rounded text-primary-fade"
        >
          CANCEL
        </button>
        <button
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 text-center px-5 py-3 bg-primary-fade border border-primary-fade rounded text-white"
        >
          <Spinner color="white" isLoading={isLoading} size="medium" />
          {confirmText}
        </button>
      </footer>
    </form>
  );
}
