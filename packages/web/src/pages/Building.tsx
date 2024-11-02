import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Spinner from '../components/Spinner';
import { apiClient } from '../util/apiClient';
import LinkSequence from '../components/LinkSequence';

export default function Building() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [building, setBuilding] = useState<Record<string, any> | null>(null);

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
        if (error.response.status) setIsLoading(false);
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
          <button className="bg-primary-fade text-white py-3 px-5 rounded flex gap-3 items-center justify-center">
            <i className="fa-regular fa-edit" />
            EDIT BUILDING
          </button>
          <button className="text-red-600 border border-red-600 bg-white py-3 px-5 flex gap-3 items-center justify-center rounded">
            <i className="fa-solid fa-trash" />
            DELETE
          </button>
        </div>
      </header>
    </div>
  );
}