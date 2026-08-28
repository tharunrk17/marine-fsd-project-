import { useEffect, useState } from 'react';
import { Activity, BarChart3, Droplets, LogOut, Menu, Recycle, ShieldAlert, Waves, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

const links = [
  { to: '/', label: 'Overview', icon: Activity },
  { to: '/reports', label: 'Pollution Reports', icon: ShieldAlert },
  { to: '/water-quality', label: 'Water Quality', icon: Droplets },
  { to: '/cleanup', label: 'Cleanup Activities', icon: Recycle },
  { to: '/indicators', label: 'Environmental Indicators', icon: BarChart3 }
];

export default function AppLayout() {
  const [user, setUser] = useState(null); const [open, setOpen] = useState(false); const navigate = useNavigate();
  useEffect(() => { api.get('/auth/me').then(r => setUser(r.data)); }, []);
  const logout = () => { localStorage.removeItem('marine_token'); navigate('/login'); };
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Waves size={22}/></div><div><strong>MarineWatch</strong><span>Pollution Monitor</span></div><button className="icon-btn mobile-only" onClick={() => setOpen(false)}><X size={18}/></button></div>
      <nav>{links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="user-card"><div className="avatar">{user?.name?.slice(0,1) || 'U'}</div><div><strong>{user?.name || 'User'}</strong><span>{user?.role || 'student'}</span></div></div><button className="logout" onClick={logout}><LogOut size={17}/> Sign out</button></div>
    </aside>
    {open && <div className="backdrop" onClick={() => setOpen(false)} />}
    <main className="main"><header className="topbar"><button className="icon-btn mobile-only" onClick={() => setOpen(true)}><Menu size={20}/></button><div className="top-title"><span>Marine ecosystem intelligence</span><h1>Evidence-based coastal action</h1></div><div className="top-pill"><span className="dot"/> Live monitoring</div></header><div className="page"><Outlet /></div></main>
  </div>;
}
