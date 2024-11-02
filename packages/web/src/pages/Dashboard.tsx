import React, { useCallback, useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { apiClient } from '../util/apiClient';
import Empty from '../assets/empty.png';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import UpsertBuildingForm, {
  ErrorsType,
} from '../components/UpsertBuildingForm';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [buildings, setBuildings] = useState<Array<Record<string, any>>>([]);
  const [count, setCount] = useState(0);
  const [modals, setModals] = useState({
    create: false,
  });

  const fetchBuildings = useCallback(async (controller?: AbortController) => {
    try {
      setIsLoading(true);

      const { data } = await apiClient.get('buildings?pageSize=1000', {
        signal: controller?.signal,
      });

      setBuildings(data.data);
      setCount(data.metadata.count);
      setIsLoading(false);
    } catch {}
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchBuildings(controller);

    return () => {
      return controller.abort();
    };
  }, [fetchBuildings]);

  const renderMain = () => {
    if (isLoading)
      return (
        <div className="flex items-center justify-center gap-5 py-20 sm:py-10">
          <Spinner color="primary" isLoading size="medium" />
          <p className="text-neutral-400">Loading buildings...</p>
        </div>
      );

    if (buildings.length === 0)
      return (
        <div className="flex flex-col items-center gap-4 py-20 sm:py-10">
          <img src={Empty} className="w-20" />
          <p className="text-neutral-400">No buildings found</p>
        </div>
      );

    return (
      <div className="flex flex-wrap gap-3 p-5 max-h-full overflow-x-hidden overflow-y-auto">
        {buildings.map((b) => (
          <Link
            key={b.id}
            className="flex items-center justify-between w-full sm:flex-1 sm:min-w-48 sm:max-w-60 p-4 shadow rounded hover:scale-105 hover:shadow-lg transition-all border"
            to={`/buildings/${b.id}`}
          >
            {b.name}
            <i className="fa-solid fa-chevron-right text-sm text-neutral-300" />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5 w-full flex flex-col gap-5 sm:gap-10 h-full overflow-hidden">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-4xl font-semibold">Dashboard</h1>
      </header>
      <main className="bg-white shadow w-full rounded-lg flex flex-col max-h-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end p-5">
          <label className="mr-auto">
            Buildings:{' '}
            <span className="text-primary-fade font-semibold">{count}</span>
          </label>
          <button
            onClick={() => {
              fetchBuildings();
            }}
            disabled={isLoading}
            className="w-full sm:w-fit flex gap-3 items-center group justify-center bg-white border border-primary-fade text-primary-fade px-5 py-2 rounded"
          >
            <i className="fa-solid fa-rotate-right group-hover:rotate-[360deg] duration-500 transition-all" />
            REFRESH
          </button>
          <button
            onClick={() => {
              setModals((prev) => ({ ...prev, create: true }));
            }}
            className="w-full sm:w-fit flex gap-3 items-center group justify-center bg-primary-fade border border-primary-fade text-white px-5 py-2 rounded"
          >
            <i className="fa-solid fa-plus group-hover:rotate-180 duration-500 transition-all" />
            CREATE
          </button>
        </div>
        {renderMain()}
      </main>
      <Modal
        onClose={() => {
          setModals((prev) => ({ ...prev, create: false }));
        }}
        isOpen={modals.create}
      >
        <UpsertBuildingForm
          onCancel={() => {
            setModals((prev) => ({ ...prev, create: false }));
          }}
          onSubmit={async (form, setIsLoading, setErrors) => {
            const updatedErrors: ErrorsType = {
              name: '',
            };

            try {
              setIsLoading(true);

              await apiClient.post('buildings', form);

              fetchBuildings();
              setModals((prev) => ({ ...prev, create: false }));
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
    </div>
  );
}
