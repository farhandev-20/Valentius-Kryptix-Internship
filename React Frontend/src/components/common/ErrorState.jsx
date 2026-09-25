import React from 'react';
import { AlertOctagon, RefreshCw, Terminal, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiBaseUrl } from '../../api/apiClient';

export const ErrorState = ({ error, onRetry, title = 'API Connection Error' }) => {
  const currentUrl = getApiBaseUrl();

  return (
    <div
      className="glass-card"
      style={{
        padding: '36px 28px',
        maxWidth: '650px',
        margin: '40px auto',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        background: 'rgba(239, 68, 68, 0.04)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div
          style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertOctagon size={32} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f87171' }}>
              {title}
            </h3>
            {error?.status && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                STATUS: {error.status}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px', lineHeight: 1.5 }}>
            {error?.message || 'Unable to fetch data from the REST API endpoint. Please check if your backend server is running.'}
          </p>

          {/* Diagnostic Box */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              color: '#94a3b8',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', marginBottom: '6px' }}>
              <Terminal size={14} />
              <span>Target API Endpoint:</span>
            </div>
            <code style={{ color: '#38bdf8' }}>{currentUrl}/products</code>
            <div style={{ marginTop: '8px', fontSize: '0.775rem', color: '#64748b' }}>
              💡 Tip: Make sure your backend server is running on port 5000 (run <code style={{ color: '#a5b4fc' }}>npm run server</code> or <code style={{ color: '#a5b4fc' }}>npm run start:all</code>)
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {onRetry && (
              <button onClick={onRetry} className="btn btn-primary btn-sm">
                <RefreshCw size={15} />
                Try Again
              </button>
            )}

            <Link to="/api-settings" className="btn btn-secondary btn-sm">
              <Settings size={15} />
              Configure API URL / Ping Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
