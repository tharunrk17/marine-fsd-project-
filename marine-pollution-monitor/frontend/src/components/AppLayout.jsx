import { useState } from 'react';
import { Activity, BarChart3, Droplets, LogOut, Menu, Recycle, ShieldAlert, Waves, X, User } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Overview Dashboard', icon: Activity },
  { to: '/reports', label: 'Pollution Reports & Map', icon: ShieldAlert },
  { to: '/water-quality', label: 'Water Quality Telemetry', icon: Droplets },
  { to: '/cleanup', label: 'Cleanup Tracking', icon: Recycle },
  { to: '/indicators', label: 'Environmental Targets', icon: BarChart3 }
];

const roleBadges = {
  admin: { label: 'Admin (Full Access)', color: 'badge-admin' },
  officer: { label: 'Environmental Officer', color: 'badge-officer' },
  ngo: { label: 'NGO Coordinator', color: 'badge-ngo' },
  citizen: { label: 'Citizen Volunteer', color: 'badge-citizen' }
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRoleInfo = roleBadges[user?.role] || { label: user?.role || 'User', color: 'badge-citizen' };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Waves size={22} />
          </div>
          <div>
            <strong>MarineWatch</strong>
            <span>Pollution Monitor</span>
          </div>
          <button className="icon-btn mobile-only" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">
              {user?.name?.slice(0, 1).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <strong>{user?.name || 'Authorized User'}</strong>
              <span className={`role-badge ${currentRoleInfo.color}`}>{currentRoleInfo.label}</span>
            </div>
          </div>
          <button className="logout" onClick={handleLogout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-only" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="top-title">
            <span>Marine Pollution Monitoring and Cleanup Tracking System</span>
            <h1>Coastal Operations Center</h1>
          </div>
          <div className="top-pill">
            <span className="dot" />
            <span>Role: <strong>{user?.role?.toUpperCase()}</strong></span>
          </div>
        </header>

        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
