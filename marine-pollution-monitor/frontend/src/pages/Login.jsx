import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor, Eye, EyeOff, ShieldCheck, UserCheck, ShieldAlert, Users, Compass } from 'lucide-react';
import api from '../lib/api.js';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@marine.local');
  const [password, setPassword] = useState('Admin@123');
  const [role, setRole] = useState('citizen');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsRegister(false);
    setError('');
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        const r = await api.post('/auth/register', { name, email, password, role });
        login(r.data.token, r.data.user);
      } else {
        const r = await api.post('/auth/login', { email, password });
        login(r.data.token, r.data.user);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="visual-badge">
          <Compass size={16} /> Marine Ecosystem Intelligence System
        </div>
        <div className="visual-copy">
          <h1>Track pollution.<br /><em>Protect oceans.</em></h1>
          <p>
            A unified full-stack platform connecting citizen incident reports, continuous water-quality telemetry, and NGO cleanup tracking on an evidence-based dashboard.
          </p>
        </div>
        <div className="visual-stats">
          <div>
            <strong>MERN</strong>
            <span>Stack Architecture</span>
          </div>
          <div>
            <strong>Leaflet</strong>
            <span>Interactive Maps</span>
          </div>
          <div>
            <strong>RBAC</strong>
            <span>4 Distinct Roles</span>
          </div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-brand">
          <div className="brand-mark">
            <Anchor size={22} />
          </div>
          <div>
            <strong>MarineWatch</strong>
            <span>Pollution Monitor & Cleanup Tracking</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-tabs">
            <button
              type="button"
              className={`tab-btn ${!isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(false); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab-btn ${isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(true); setError(''); }}
            >
              Register Account
            </button>
          </div>

          <div className="login-head">
            <h2>{isRegister ? 'Create an account' : 'Welcome back'}</h2>
            <p>{isRegister ? 'Choose your role and join the coastal network.' : 'Sign in to access the coastal operations console.'}</p>
          </div>

          {error && <div className="alert">{error}</div>}

          <form onSubmit={submit}>
            {isRegister && (
              <>
                <label>
                  Full Name
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Dr. Priya Sen"
                    required
                  />
                </label>
                <label>
                  System Role
                  <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="citizen">Citizen (Report & Volunteer)</option>
                    <option value="ngo">NGO Coordinator (Organize Cleanups)</option>
                    <option value="officer">Environmental Officer (Inspect & Test)</option>
                  </select>
                </label>
              </>
            )}

            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@marine.local"
                required
              />
            </label>

            <label>
              Password
              <div className="password">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <button className="primary full" disabled={loading}>
              {loading ? 'Processing…' : isRegister ? 'Register & Enter' : 'Sign in'}
            </button>
          </form>

          {/* Quick Demo Switcher for Viva Presentations */}
          <div className="demo-section">
            <span className="demo-label">1-Click Demo Accounts for Viva Panel:</span>
            <div className="demo-roles-grid">
              <button
                type="button"
                className="demo-chip chip-admin"
                onClick={() => handleQuickLogin('admin@marine.local', 'Admin@123')}
              >
                <ShieldCheck size={14} /> Admin
              </button>
              <button
                type="button"
                className="demo-chip chip-officer"
                onClick={() => handleQuickLogin('officer@marine.local', 'Officer@123')}
              >
                <ShieldAlert size={14} /> Officer
              </button>
              <button
                type="button"
                className="demo-chip chip-ngo"
                onClick={() => handleQuickLogin('ngo@marine.local', 'Ngo@123')}
              >
                <Users size={14} /> NGO
              </button>
              <button
                type="button"
                className="demo-chip chip-citizen"
                onClick={() => handleQuickLogin('citizen@marine.local', 'Citizen@123')}
              >
                <UserCheck size={14} /> Citizen
              </button>
            </div>
          </div>
        </div>

        <div className="login-footer">
          College Final Year Project · MERN Stack + Leaflet + Recharts · Marine Conservation
        </div>
      </div>
    </div>
  );
}
