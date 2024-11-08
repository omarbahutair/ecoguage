import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { store } from './store';
import { refreshAuth } from './store/auth-slice';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Building from './pages/Building';
import Trash from './pages/Trash';
import Overview from './pages/Overview';

export default function App() {
  useEffect(() => {
    store.dispatch(refreshAuth());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<DashboardLayout />}>
          <Route element={<Dashboard />} path="dashboard" />
          <Route element={<Building />} path="buildings/:id" />
          <Route element={<Trash />} path="trash" />
          <Route element={<Overview />} path="overview" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
