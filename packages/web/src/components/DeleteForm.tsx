import React, { useCallback } from 'react';
import { apiClient } from '../util/apiClient';
import AreYouSureForm from './AreYouSureForm';

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
  const onDelete = useCallback(
    async (setIsLoading: (isLoading: boolean) => void) => {
      try {
        setIsLoading(true);

        await apiClient.delete(deletePath);
        onSucess?.();
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return (
    <AreYouSureForm
      confirmText="DELETE"
      onCancel={onCancel}
      onConfirm={onDelete}
      title={title}
    />
  );
}
