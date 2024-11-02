import React, { useCallback, useState } from 'react';
import Input from './Input';
import Spinner from './Spinner';
import { apiClient } from '../util/apiClient';

interface CreateBuildingFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function CreateBuildingForm({
  onCancel,
  onSuccess,
}: CreateBuildingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
  });
  const [errors, setErrors] = useState({
    name: '',
  });

  const onSubmit = useCallback(async () => {
    const updatedErrors: typeof errors = {
      name: '',
    };

    try {
      setIsLoading(true);

      const { data } = await apiClient.post('buildings', form);

      setForm(data);
      onSuccess();
    } catch (error: any) {
      switch (error.response?.status) {
        case 422:
          updatedErrors.name = error.response.data.validationErrors.name?.[0];
          break;
      }
    } finally {
      setErrors(updatedErrors);
      setIsLoading(false);
    }
  }, [form]);

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <header className="text-lg font-semibold">CREATE BUILDING</header>
      <main>
        <Input
          label="Name"
          placeholder="Name"
          value={form.name}
          setValue={(name) => {
            setForm((prev) => ({ ...prev, name }));
          }}
          error={errors.name}
        />
      </main>
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
          CREATE
        </button>
      </footer>
    </form>
  );
}
