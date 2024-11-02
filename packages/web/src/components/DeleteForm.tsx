import React, { useCallback, useState } from 'react';
import Spinner from './Spinner';
import { apiClient } from '../util/apiClient';

interface DeleteFormProps {
  title: string;
  deletePath: string;
  onSucess?: () => void;
  onCancel?: () => void;
}

export default function DeleteForm({
  deletePath,
  title,
  onCancel,
  onSucess,
}: DeleteFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(async () => {
    try {
      setIsLoading(true);

      await apiClient.delete(deletePath);
      onSucess?.();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(e) => {
        e.preventDefault();
        onDelete();
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
          DELETE
        </button>
      </footer>
    </form>
  );
}
