import React, { useCallback, useEffect, useState } from 'react';
import Spinner from './Spinner';
import { apiClient } from '../util/apiClient';
import Table from './Table';
import Modal from './Modal';
import UpsertReadingForm, { ErrorsType, FormType } from './UpsertReadingForm';
import { MessageState } from './Message';

interface ReadingsViewerProps {
  buildings: string[];
}

export default function ReadingsViewer({ buildings }: ReadingsViewerProps) {
  const [readings, setReadings] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modals, setModals] = useState({
    edit: false,
    delete: false,
  });
  const [selectedReading, setSelectedReading] = useState<Record<
    string,
    any
  > | null>(null);

  const fetchReadings = useCallback(
    async (controller?: AbortController) => {
      try {
        setIsLoading(true);

        const { data } = await apiClient.get('readings', {
          params: {
            buildings,
          },
          signal: controller?.signal,
        });

        setReadings(data);
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    [buildings],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchReadings(controller);

    return () => {
      controller.abort();
    };
  }, [fetchReadings]);

  if (isLoading)
    return (
      <div className="py-32 flex items-center justify-center gap-4">
        <Spinner color="primary" isLoading size="medium" />
        <p className="text-neutral-400">Loading readings data...</p>
      </div>
    );

  if (readings.length === 0)
    return (
      <div className="flex flex-col items-center gap-5 py-32">
        <p className="text-neutral-400">No data found :(</p>
      </div>
    );

  return (
    <>
      <Table
        columns={[
          {
            label: 'Time (MM/YY)',
            render(doc) {
              let monthString: string = doc.month.toString();
              let yearString: string = doc.year.toString();

              if (doc.month < 10) monthString = `0${monthString}`;

              return `${monthString}/${yearString.substring(2)}`;
            },
          },
          {
            label: 'Energy Usage',
            render(doc) {
              return `${doc.energyUsage} kWh`;
            },
          },
          {
            label: 'Energy Cost',
            render(doc) {
              return `${doc.energyCost} AED`;
            },
          },
          {
            label: 'Actions',
            render(doc) {
              return (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedReading(doc);
                      setModals((prev) => ({ ...prev, edit: true }));
                    }}
                    className="bg-primary-fade text-white w-8 aspect-square flex items-center justify-center rounded"
                  >
                    <i className="fa-regular fa-edit" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReading(doc);
                      setModals((prev) => ({ ...prev, delete: true }));
                    }}
                    className="bg-red-600 text-white w-8 aspect-square flex items-center justify-center rounded"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              );
            },
          },
        ]}
        data={readings}
        keyField="id"
      />
      <Modal
        isOpen={modals.edit}
        onClose={() => {
          setSelectedReading(null);
          setModals((prev) => ({ ...prev, edit: false }));
        }}
      >
        {selectedReading && (
          <UpsertReadingForm
            title="EDIT READING"
            defaultForm={selectedReading as FormType}
            onCancel={() => {
              setModals((prev) => ({ ...prev, edit: false }));
            }}
            onSubmit={async (form, setIsLoading, setErrors, setMessage) => {
              const updatedErrors: ErrorsType = {};
              let updatedMessage: MessageState = {
                content: '',
                type: null,
              };

              try {
                setIsLoading(true);

                await apiClient.put(`readings/${selectedReading.id}`, form);

                setModals((prev) => ({ ...prev, edit: false }));
                fetchReadings();
              } catch (error: any) {
                switch (error.response?.status) {
                  case 422:
                    updatedErrors.energyCost =
                      error.response.data.validationErrors.energyCost?.[0];
                    updatedErrors.energyUsage =
                      error.response.data.validationErrors.energyUsage?.[0];
                    updatedErrors.month =
                      error.response.data.validationErrors.month?.[0];
                    updatedErrors.year =
                      error.response.data.validationErrors.year?.[0];
                    break;
                  default:
                    updatedMessage = {
                      type: 'error',
                      content: error.response?.data?.message ?? error.message,
                    };
                }
              } finally {
                setIsLoading(false);
                setMessage(updatedMessage);
                setErrors(updatedErrors);
              }
            }}
          />
        )}
      </Modal>
    </>
  );
}
