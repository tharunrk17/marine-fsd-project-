import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles.css';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import WaterQuality from './pages/WaterQuality.jsx';
import Cleanup from './pages/Cleanup.jsx';
import Indicators from './pages/Indicators.jsx';
import AppLayout from './components/AppLayout.jsx';
import api from './lib/api.js';

function Protected({ children }) {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);
  useEffect(() => { api.get('/auth/me').then(() => setOk(true)).catch(() => localStorage.removeItem('marine_token')).finally(() => setChecking(false)); }, []);
  if (checking) return <div className="center-screen"><div className="spinner"/></div>;
  return ok ? children : <Navigate to="/login" replace />;
}

function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<Protected><AppLayout /></Protected>}>
      <Route index element={<Navigate to="/" replace />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/water-quality" element={<WaterQuality />} />
      <Route path="/cleanup" element={<Cleanup />} />
      <Route path="/indicators" element={<Indicators />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
