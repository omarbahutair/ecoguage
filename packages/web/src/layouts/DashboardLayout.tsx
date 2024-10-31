import React, { useState } from 'react';
import { Outlet } from 'react-router';
import SideBar from '../components/SideBar';
import Logo from '../components/Logo';
import ExtenderButton from '../components/ExtenderButton';

export default function DashboardLayout() {
  const [isExtended, setIsExtended] = useState(false);

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col">
      <header className="flex items-center justify-between lg:justify-start">
        <ExtenderButton
          isExtended={isExtended}
          onClick={() => {
            setIsExtended((prev) => !prev);
          }}
          className="hidden lg:flex"
        />
        <Logo className="w-20 p-3" />
        <ExtenderButton
          isExtended={isExtended}
          onClick={() => {
            setIsExtended((prev) => !prev);
          }}
          className="lg:hidden"
        />
      </header>
      <main className="flex-1 flex w-full relative">
        <div
          className={`absolute lg:relative w-full lg:max-w-80 h-full p-2 overflow-auto transition-all duration-500 ${isExtended ? 'backdrop-blur-sm' : 'lg:-translate-x-full lg:max-w-0 lg:overflow-hidden opacity-0'}`}
        >
          <div
            className={`w-full lg:h-full transition-all duration-500 ${isExtended ? '' : '-translate-x-[110%] lg:-translate-x-0'}`}
          >
            <SideBar
              className={`bg-primary w-full h-full max-w-xl m-auto rounded-2xl`}
            />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
