import React, { useCallback, useEffect, useState } from 'react';
import Spinner from './Spinner';
import { apiClient } from '../util/apiClient';
import Table from './Table';

interface ReadingsViewerProps {
  buildings: string[];
}

export default function ReadingsViewer({ buildings }: ReadingsViewerProps) {
  const [readings, setReadings] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    <div>
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
            render() {
              return (
                <div className="flex items-center gap-1">
                  <button className="bg-primary-fade text-white w-8 aspect-square flex items-center justify-center rounded">
                    <i className="fa-regular fa-edit" />
                  </button>
                  <button className="bg-red-600 text-white w-8 aspect-square flex items-center justify-center rounded">
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
    </div>
  );
}
