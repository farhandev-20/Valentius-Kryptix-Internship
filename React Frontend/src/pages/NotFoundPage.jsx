import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      className="glass-card"
      style={{
        maxWidth: '540px',
        margin: '60px auto',
        padding: '50px 28px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#818cf8',
          marginBottom: '20px',
        }}
      >
        <Compass size={40} />
      </div>

      <span style={{ fontSize: '3.5rem', fontWeight: 800, color: '#818cf8', lineHeight: 1 }}>
        404
      </span>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '12px 0 8px' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
        The route you are trying to access does not exist or has been moved.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary btn-sm">
          <Home size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    </div>
  );
};
