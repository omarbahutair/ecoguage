import React from 'react';
import ReadingsViewer from '../components/ReadingsViewer';

export default function Overview() {
  return (
    <div className="overflow-auto w-full p-2">
      <div className="bg-white shadow w-full p-4 sm:p-8 rounded-lg flex flex-col gap-8 sm:gap-10 max-w-screen-md m-auto">
        <header>
          <h1 className="text-2xl font-semibold">Overview</h1>
        </header>
        <main>
          <ReadingsViewer showBuildingName />
        </main>
      </div>
    </div>
  );
}
