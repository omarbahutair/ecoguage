import React, { useState } from 'react';
import Input from './Input';
import Spinner from './Spinner';

export interface FormType {
  name: string;
}

export interface ErrorsType {
  name: string;
}

interface CreateBuildingFormProps {
  onCancel: () => void;
  onSubmit: (
    form: FormType,
    setIsLoading: (isLoading: boolean) => void,
    setErrors: (errors: ErrorsType) => void,
  ) => Promise<void> | void;
  defaultForm?: FormType;
}

export default function UpsertBuildingForm({
  onCancel,
  onSubmit,
  defaultForm,
}: CreateBuildingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormType>(
    defaultForm ?? {
      name: '',
    },
  );
  const [errors, setErrors] = useState<ErrorsType>({
    name: '',
  });

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, setIsLoading, setErrors);
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
