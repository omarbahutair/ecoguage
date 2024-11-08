import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { primary, primaryFade } from '../colors';
import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import Dropdown from './Dropdown';

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

interface EnergyChartProps {
  readings: Array<Record<string, any>>;
}

export default function EnergyChart({ readings }: EnergyChartProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const years = useMemo(() => {
    const start = 2020;
    const end = new Date().getFullYear();

    const result: number[] = [];

    for (let i = start; i <= end; i += 1) {
      result.push(i);
    }

    return result;
  }, []);
  const energyCostData = useMemo(() => {
    const filteredData = readings.filter((r) => r.year === year);

    let result: (number | undefined)[] = [];

    for (let month = 1; month <= 12; month += 1) {
      const monthData = filteredData.filter((d) => d.month === month);

      if (monthData.length === 0) {
        result.push(undefined);
        continue;
      }

      result.push(monthData.reduce((a, c) => a + c.energyCost, 0));
    }

    return result;
  }, [readings, year]);
  const energyUsageData = useMemo(() => {
    const filteredData = readings.filter((r) => r.year === year);

    let result: (number | undefined)[] = [];

    for (let month = 1; month <= 12; month += 1) {
      const monthData = filteredData.filter((d) => d.month === month);

      if (monthData.length === 0) {
        result.push(undefined);
        continue;
      }

      result.push(monthData.reduce((a, c) => a + c.energyUsage, 0));
    }

    return result;
  }, [readings, year]);

  return (
    <div className="flex flex-col gap-4">
      <Dropdown
        options={years.map((y) => ({ label: y.toString(), value: y }))}
        onSelect={setYear}
        placeholder="Select a Year"
        className="w-full sm:w-40 self-end"
        value={year}
      />
      <Line
        options={{
          responsive: true,
          spanGaps: true,
        }}
        data={{
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          datasets: [
            {
              data: energyUsageData,
              borderColor: primaryFade,
              label: 'Energy Usage',
              pointBackgroundColor: primaryFade,
              backgroundColor: primaryFade,
            },
            {
              data: energyCostData,
              borderColor: primary,
              label: 'Energy Cost',
              pointBackgroundColor: primary,
              backgroundColor: primary,
            },
          ],
        }}
      />
    </div>
  );
}
