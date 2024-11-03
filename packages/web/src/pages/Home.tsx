import React from 'react';
import BackPanel from '../assets/back-panel.jpg';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: `url(${BackPanel})`,
      }}
      className="h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center"
    >
      <main className="text-center flex flex-col gap-12 max-w-screen-xl items-center">
        <Logo />
        <h1 className="text-2xl font-bold text-primary md:text-5xl">
          Track Your Energy, Empower Your Future
        </h1>
        <p className="text-sm text-neutral-400">
          EcoGauge helps you monitor and manage your electricity usage in
          real-time, giving you the insights you need to reduce costs, conserve
          energy, and make sustainable choices. Discover smarter energy habits
          and keep your power consumption in check, all in one intuitive
          platform.
        </p>
        <div className="grid grid-cols-2 gap-5">
          <Link
            to="/login"
            className="bg-white text-primary shadow px-5 py-2 rounded-xl hover:-translate-y-1 transition-transform"
          >
            LOGIN
          </Link>
          <Link
            to="/register"
            className="bg-primary text-white px-5 py-2 rounded-xl hover:-translate-y-1 transition-transform"
          >
            GET STARTED
          </Link>
        </div>
      </main>
    </div>
  );
}
