import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Spinner from '../components/Spinner';
import { apiClient } from '../util/apiClient';
import LinkSequence from '../components/LinkSequence';
import Modal from '../components/Modal';
import UpsertBuildingForm, {
  ErrorsType,
} from '../components/UpsertBuildingForm';
import DeleteForm from '../components/DeleteForm';

export default function Building() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [building, setBuilding] = useState<Record<string, any> | null>(null);
  const [modals, setModals] = useState({
    edit: false,
    delete: false,
  });

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
      <div>
        <p>Building not found</p>
      </div>
    );

  return (
    <div className="bg-white shadow w-full m-2 p-4 sm:p-8 rounded-lg flex flex-col gap-10">
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
    </div>
  );
}
