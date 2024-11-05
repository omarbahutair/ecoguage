import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Spinner from '../components/Spinner';
import { apiClient } from '../util/apiClient';
import LinkSequence from '../components/LinkSequence';
import Modal from '../components/Modal';
import DeleteForm from '../components/DeleteForm';
import ReadingsViewer from '../components/ReadingsViewer';
import UpsertReadingForm, {
  ErrorsType as ReadingErrorsType,
} from '../components/UpsertReadingForm';
import { MessageState } from '../components/Message';
import UpsertBuildingForm, {
  ErrorsType,
} from '../components/UpsertBuildingForm';

export default function Building() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [building, setBuilding] = useState<Record<string, any> | null>(null);
  const [modals, setModals] = useState({
    edit: false,
    delete: false,
    createReading: false,
  });

  // to avoid ReadingsViewer rerendering every rerender
  const [buildingsProp, setBuildingsProp] = useState(id ? [id] : []);

  const fetchBuilding = useCallback(
    async (controller?: AbortController) => {
      try {
        setIsLoading(true);

        const { data } = await apiClient.get(`buildings/${id}`, {
          signal: controller?.signal,
        });

        setBuilding(data);
        setIsLoading(false);
      } catch (error: any) {
        if (error.response?.status) setIsLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchBuilding(controller);

    return () => {
      controller.abort();
    };
  }, [fetchBuilding]);

  if (isLoading)
    return (
      <div className="w-full h-full max-h-96 flex items-center justify-center gap-3">
        <Spinner color="primary" isLoading size="medium" />
        <p className="text-neutral-400">Loading building data...</p>
      </div>
    );

  if (!building)
    return (
      <div className="w-full h-full max-h-96 flex flex-col items-center justify-center gap-10">
        <h1 className="text-8xl font-semibold">404 :(</h1>
        <p className="text-neutral-400 text-lg">Building not found</p>
      </div>
    );

  return (
    <div className="overflow-auto w-full p-2">
      <div className="bg-white shadow w-full p-4 sm:p-8 rounded-lg flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="bg-primary-fade text-white w-8 aspect-square flex items-center justify-center rounded-full group"
          >
            <i className="fa-solid fa-arrow-left group-hover:animate-slide-left" />
          </button>
          <LinkSequence
            sequence={[
              {
                label: 'Buildings',
                to: '/dashboard',
              },
              {
                label: building.name,
                to: `/buildings/${id}`,
              },
            ]}
          />
        </div>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{building.name}</h1>
            <p className="text-sm text-neutral-400">
              Created at {new Date(building.createdAt).toDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row">
            <button
              onClick={() => {
                setModals((prev) => ({ ...prev, edit: true }));
              }}
              className="bg-primary-fade text-white py-3 px-5 rounded flex gap-3 items-center justify-center"
            >
              <i className="fa-regular fa-edit" />
              EDIT BUILDING
            </button>
            <button
              onClick={() => {
                setModals((prev) => ({ ...prev, delete: true }));
              }}
              className="text-red-600 border border-red-600 bg-white py-3 px-5 flex gap-3 items-center justify-center rounded"
            >
              <i className="fa-solid fa-trash" />
              DELETE
            </button>
          </div>
        </header>
        <main className="flex-1 flex flex-col gap-4">
          <button
            onClick={() => {
              setModals((prev) => ({ ...prev, createReading: true }));
            }}
            className="bg-primary-fade text-white py-3 px-5 w-full flex gap-3 items-center justify-center rounded sm:w-fit sm:ml-auto"
          >
            <i className="fa-solid fa-plus" />
            ADD READING
          </button>
          <ReadingsViewer buildings={buildingsProp} />
        </main>
        <Modal
          onClose={() => {
            setModals((prev) => ({ ...prev, edit: false }));
          }}
          isOpen={modals.edit}
        >
          <UpsertBuildingForm
            title="EDIT BUILDING"
            defaultForm={{
              name: building.name,
            }}
            onCancel={() => {
              setModals((prev) => ({ ...prev, edit: false }));
            }}
            onSubmit={async (form, setIsLoading, setErrors) => {
              const updatedErrors: ErrorsType = {
                name: '',
              };

              try {
                setIsLoading(true);

                await apiClient.put(`buildings/${id}`, form);

                fetchBuilding();
                setModals((prev) => ({ ...prev, edit: false }));
              } catch (error: any) {
                switch (error.response?.status) {
                  case 422:
                    updatedErrors.name =
                      error.response.data.validationErrors.name?.[0];
                    break;
                }
              } finally {
                setErrors(updatedErrors);
                setIsLoading(false);
              }
            }}
          />
        </Modal>
        <Modal
          onClose={() => {
            setModals((prev) => ({ ...prev, delete: false }));
          }}
          isOpen={modals.delete}
        >
          <DeleteForm
            title={`Delete ${building.name}?`}
            deletePath={`/buildings/${id}`}
            onCancel={() => {
              setModals((prev) => ({ ...prev, delete: false }));
            }}
            onSucess={() => {
              navigate('/dashboard');
            }}
          />
        </Modal>
        <Modal
          onClose={() => {
            setModals((prev) => ({ ...prev, createReading: false }));
          }}
          isOpen={modals.createReading}
        >
          <UpsertReadingForm
            title="CREATE READING"
            onCancel={() => {
              setModals((prev) => ({ ...prev, createReading: false }));
            }}
            onSubmit={async (form, setIsLoading, setErrors, setMessage) => {
              const updatedErrors: ReadingErrorsType = {};
              let updatedMessage: MessageState = {
                content: '',
                type: null,
              };

              try {
                setIsLoading(true);

                await apiClient.post('readings', { ...form, building: id });

                setModals((prev) => ({ ...prev, createReading: false }));
                setBuildingsProp((prev) => [...prev]);
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
        </Modal>
      </div>
    </div>
  );
}
