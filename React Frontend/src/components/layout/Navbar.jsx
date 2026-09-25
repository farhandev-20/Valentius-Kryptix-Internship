import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Box, Plus, Activity, Sun, Moon, Sparkles, Layers, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { productsApi } from '../../api/apiClient';

export const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Periodic health check for the API pulse indicator
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        await productsApi.checkHealth();
        if (isMounted) setApiOnline(true);
      } catch {
        if (isMounted) setApiOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <div className="brand-badge">
            <Layers size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              StockPilot <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', border: '1px solid rgba(129, 140, 248, 0.3)', padding: '1px 6px', borderRadius: '4px' }}>REST HUB</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Box size={16} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/products/new"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </NavLink>

          <NavLink
            to="/api-settings"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Activity size={16} />
            <span>API Status</span>
          </NavLink>
        </nav>

        {/* Actions (Right Side) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* API Live Status Pill */}
          <Link
            to="/api-settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: apiOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: apiOnline ? '#34d399' : '#f87171',
              border: `1px solid ${apiOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
            title={apiOnline ? 'REST API connected and responsive' : 'REST API is disconnected / unreachable'}
          >
            {apiOnline ? <span className="pulse-live" /> : <WifiOff size={12} />}
            <span>{apiOnline ? 'API Online' : 'API Offline'}</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            style={{ padding: '8px', borderRadius: '50%' }}
            aria-label="Toggle dark/light theme"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
          </button>

          {/* Primary CTA */}
          <Link to="/products/new" className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>New Item</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
