import React from 'react';
import { Layers } from 'lucide-react';
import { getApiBaseUrl } from '../../api/apiClient';

export const Footer = () => {
  const currentBaseUrl = getApiBaseUrl();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        padding: '28px 20px',
        backgroundColor: 'rgba(11, 15, 25, 0.6)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="#818cf8" />
          <span>
            <strong>StockPilot</strong> • Valentius Kryptix Internship React Frontend
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#94a3b8' }}>
            Connected API: <code style={{ color: '#38bdf8' }}>{currentBaseUrl}</code>
          </span>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <span style={{ fontSize: '0.8rem', color: '#10b981' }}>
            ✔ 100% Client-Side Validated
          </span>
        </div>
      </div>
    </footer>
  );
};
