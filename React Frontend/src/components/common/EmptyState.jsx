import React from 'react';
import { PackageOpen, Plus, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = 'No Products Found',
  description = 'No products match your current search or filter criteria. Try adjusting your query or add a new item.',
  onReset,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: '520px',
        margin: '40px auto',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#818cf8',
          marginBottom: '20px',
        }}
      >
        <PackageOpen size={36} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '24px', lineHeight: 1.5 }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {onReset && (
          <button onClick={onReset} className="btn btn-secondary btn-sm">
            <RotateCcw size={15} />
            Reset Filters
          </button>
        )}
        <Link to="/products/new" className="btn btn-primary btn-sm">
          <Plus size={15} />
          Create New Product
        </Link>
      </div>
    </div>
  );
};
