import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Menu, X, Briefcase, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Briefcase size={22} /> Hire<span>AI</span>
      </Link>

      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <Link to="/jobs">Browse Jobs</Link>
        {user?.role === 'employer' && <Link to="/post-job">Post a Job</Link>}

        {!user ? (
          <>
            <Link to="/login"><button className="nav-btn nav-btn-outline">Login</button></Link>
            <Link to="/register"><button className="nav-btn nav-btn-primary">Register</button></Link>
          </>
        ) : (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropOpen(!dropOpen)}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 10px', borderRadius: 8, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: 14 }}>
                {user.first_name?.[0] || user.username[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text2)' }}>{user.first_name || user.username}</span>
            </button>
            {dropOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', border: '1px solid var(--border)', borderRadius: 12, minWidth: 200, boxShadow: 'var(--shadow-md)', zIndex: 200, overflow: 'hidden' }}
                onMouseLeave={() => setDropOpen(false)}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.first_name} {user.last_name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{user.email}</div>
                </div>
                {[
                  { icon: <LayoutDashboard size={15} />, label: 'Dashboard', to: '/dashboard' },
                  { icon: <User size={15} />, label: 'Profile', to: '/profile' },
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setDropOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: 'var(--text2)', fontSize: '0.875rem', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    {item.icon} {item.label}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid var(--border)' }}>
                  <button onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: 'var(--danger)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
