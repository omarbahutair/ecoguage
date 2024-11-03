import React, { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../util/apiClient';
import Spinner from '../components/Spinner';
import Empty from '../assets/empty.png';
import Table from '../components/Table';
import DeletedBuildingActions from '../components/DeletedBuildingActions';

export default function Trash() {
  const [isLoading, setIsLoading] = useState(true);
  const [buildings, setBuildings] = useState<Array<Record<string, any>>>([]);

  const fetchDeletedBuildings = useCallback(
    async (controller?: AbortController) => {
      try {
        setIsLoading(true);

        const { data } = await apiClient.get(
          'manage-deleted-buildings?pageSize=1000',
          {
            signal: controller?.signal,
          },
        );

        setBuildings(data.data);
        setIsLoading(false);
      } catch {}
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchDeletedBuildings(controller);

    return () => {
      return controller.abort();
    };
  }, [fetchDeletedBuildings]);

  const renderMain = () => {
    if (isLoading)
      return (
        <div className="flex items-center justify-center gap-5 py-20 sm:py-10">
          <Spinner color="primary" isLoading size="medium" />
          <p className="text-neutral-400">Loading deleted buildings...</p>
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
        <Table
          keyField="id"
          data={buildings}
          columns={[
            {
              label: 'Name',
              field: 'name',
            },
            {
              label: 'Deleted at',
              render(doc) {
                return <p>{new Date(doc.deletedAt).toDateString()}</p>;
              },
            },
            {
              label: 'Actions',
              render(building) {
                return (
                  <DeletedBuildingActions
                    building={building}
                    onDeleteSucess={() => {
                      setBuildings((prev) =>
                        prev.filter((b) => b.id !== building.id),
                      );
                    }}
                    onRestoreSuccess={() => {
                      setBuildings((prev) =>
                        prev.filter((b) => b.id !== building.id),
                      );
                    }}
                  />
                );
              },
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div className="p-5 w-full flex flex-col gap-5 sm:gap-10 h-full overflow-hidden">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-4xl font-semibold">Trash</h1>
      </header>
      <main className="bg-white shadow w-full rounded-lg flex flex-col max-h-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end p-5">
          <label className="mr-auto">
            Buildings:{' '}
            <span className="text-primary-fade font-semibold">
              {buildings.length}
            </span>
          </label>
          <button
            onClick={() => {
              fetchDeletedBuildings();
            }}
            disabled={isLoading}
            className="w-full sm:w-fit flex gap-3 items-center group justify-center bg-white border border-primary-fade text-primary-fade px-5 py-2 rounded"
          >
            <i className="fa-solid fa-rotate-right group-hover:rotate-[360deg] duration-500 transition-all" />
            REFRESH
          </button>
        </div>
        {renderMain()}
      </main>
    </div>
  );
}
