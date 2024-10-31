import React, { useState } from 'react';
import { Outlet } from 'react-router';
import SideBar from '../components/SideBar';
import Logo from '../components/Logo';
import ExtenderButton from '../components/ExtenderButton';

export default function DashboardLayout() {
  const [isExtended, setIsExtended] = useState(false);

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col">
      <header className="flex items-center justify-between">
        <Logo className="w-20 p-3" />
        <ExtenderButton
          isExtended={isExtended}
          onClick={() => {
            setIsExtended((prev) => !prev);
          }}
        />
      </header>
      <main className="flex-1 flex w-full relative">
        <div
          className={`absolute w-full h-full p-2 overflow-auto transition-all duration-500 ${isExtended ? 'backdrop-blur-sm' : ''}`}
        >
          <SideBar
            className={`bg-primary w-full rounded-2xl  transition-all duration-500 ${isExtended ? '' : '-translate-x-[110%]'}`}
          />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
