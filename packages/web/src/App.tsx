import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { store } from './store';
import { refreshAuth } from './store/auth-slice';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
