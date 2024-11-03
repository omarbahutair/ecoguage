import React, { useState } from 'react';
import { Outlet } from 'react-router';
import SideBar from '../components/SideBar';
import Logo from '../components/Logo';
import ExtenderButton from '../components/ExtenderButton';

export default function DashboardLayout() {
  const [isExtended, setIsExtended] = useState(false);

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col">
      <header className="flex items-center justify-between lg:justify-start gap-5 px-4 py-2 z-[60] shadow">
        <ExtenderButton
          isExtended={isExtended}
          onClick={() => {
            setIsExtended((prev) => !prev);
          }}
          className="hidden lg:flex"
        />
        <div className="flex items-center gap-3">
          <Logo className="w-8" />
          <h1 className="text-2xl font-semibold text-primary-fade">ECOGUAGE</h1>
        </div>
        <ExtenderButton
          isExtended={isExtended}
          onClick={() => {
            setIsExtended((prev) => !prev);
          }}
          className="lg:hidden"
        />
      </header>
      <main className="flex-1 flex w-full relative overflow-hidden bg-neutral-50">
        <div
          className={`absolute lg:relative w-full lg:max-w-80 h-full p-2 overflow-auto transition-all duration-500 ${isExtended ? 'backdrop-blur-sm bg-white bg-opacity-50 z-50' : 'lg:-translate-x-full lg:!max-w-0 lg:overflow-hidden opacity-0 -z-50'}`}
        >
          <div
            className={`w-full lg:h-full transition-all duration-500 ${isExtended ? '' : '-translate-x-[110%] lg:-translate-x-0'}`}
          >
            <SideBar
              onLinkClick={() => {
                if (window.innerWidth < 1024) {
                  setIsExtended(false);
                }
              }}
              className={`bg-primary-fade w-full h-full max-w-xl m-auto rounded-lg`}
            />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
