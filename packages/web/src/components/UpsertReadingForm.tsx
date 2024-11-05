import React, { useState } from 'react';
import Input from './Input';
import Spinner from './Spinner';
import Message, { MessageState } from './Message';

interface FormType {
  year: number;
  month: number;
  energyUsage: number;
  energyCost: number;
}

export interface ErrorsType {
  year?: string;
  month?: string;
  energyUsage?: string;
  energyCost?: string;
}

interface UpsertBuildingFormProps {
  defaultForm?: FormType;
  title: string;
  onSubmit: (
    form: FormType,
    setIsLoading: (isLoading: boolean) => void,
    setErrors: (errors: ErrorsType) => void,
    setMessage: (message: MessageState) => void,
  ) => Promise<void> | void;
  onCancel: () => void;
}

export default function UpsertReadingForm({
  onSubmit,
  onCancel,
  title,
  defaultForm,
}: UpsertBuildingFormProps) {
  const [form, setForm] = useState<FormType>(
    defaultForm ?? {
      energyCost: 0,
      energyUsage: 0,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
  );
  const [errors, setErrors] = useState<ErrorsType>({});
  const [message, setMessage] = useState<MessageState>({
    content: '',
    type: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit(form, setIsLoading, setErrors, setMessage);
      }}
      className="flex flex-col gap-10 max-w-lg"
    >
      <header>
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>
      <Message message={message} />
      <main className="flex flex-col gap-3">
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
          <Input
            type="number"
            value={form.month.toString()}
            setValue={(value) =>
              setForm((prev) => ({ ...prev, month: parseInt(value) }))
            }
            onBlur={() => {
              setForm((prev) => {
                if (prev.month > 12) prev.month = 12;
                else if (prev.month < 1) prev.month = 1;

                return {
                  ...prev,
                  month: isNaN(prev.month)
                    ? new Date().getMonth() + 1
                    : prev.month,
                };
              });
            }}
            step={1}
            min={1}
            max={12}
            label="Month"
            error={errors.month}
          />
          <Input
            type="number"
            value={form.year.toString()}
            setValue={(value) =>
              setForm((prev) => ({ ...prev, year: parseInt(value) }))
            }
            onBlur={() => {
              setForm((prev) => {
                if (prev.year > new Date().getFullYear())
                  prev.year = new Date().getFullYear();
                else if (prev.year < 2020) prev.year = 2020;

                return { ...prev };
              });
            }}
            step={1}
            min={2020}
            max={new Date().getFullYear()}
            label="Year"
            error={errors.year}
          />
        </div>
        <Input
          type="number"
          value={form.energyUsage.toString()}
          setValue={(value) =>
            setForm((prev) => ({ ...prev, energyUsage: parseInt(value) }))
          }
          onBlur={() => {
            setForm((prev) => ({
              ...prev,
              energyUsage: 0,
            }));
          }}
          label="Energy Usage (kWh)"
          error={errors.energyUsage}
        />
        <Input
          type="number"
          value={form.energyCost.toString()}
          setValue={(value) =>
            setForm((prev) => ({ ...prev, energyCost: parseInt(value) }))
          }
          onBlur={() => {
            setForm((prev) => ({
              ...prev,
              energyCost: 0,
            }));
          }}
          label="Energy Cost (AED)"
          error={errors.energyCost}
        />
      </main>
      <footer className="flex flex-col sm:flex-row gap-1">
        <button
          disabled={isLoading}
          onClick={onCancel}
          className="w-full border border-primary-fade text-primary-fade rounded py-2 px-5"
        >
          CANCEL
        </button>
        <button
          disabled={isLoading}
          className="w-full border border-primary-fade text-white bg-primary-fade rounded py-2 px-5 flex gap-3 items-center justify-center"
        >
          <Spinner isLoading={isLoading} color="white" size="medium" />
          SAVE
        </button>
      </footer>
    </form>
  );
}
