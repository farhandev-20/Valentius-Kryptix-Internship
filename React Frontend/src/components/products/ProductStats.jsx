import React from 'react';
import { Package, DollarSign, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const ProductStats = () => {
  const { stats } = useProducts();

  const statItems = [
    {
      label: 'Total Products',
      value: stats.totalCount,
      icon: <Package size={22} color="#6366f1" />,
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.25)',
      desc: 'Active inventory items',
    },
    {
      label: 'Total Valuation',
      value: `$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign size={22} color="#10b981" />,
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      desc: 'Current stock value',
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockCount,
      icon: <AlertTriangle size={22} color="#f59e0b" />,
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      desc: 'Needs replenishment soon',
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStockCount,
      icon: <XCircle size={22} color="#ef4444" />,
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.25)',
      desc: 'Zero inventory available',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      {statItems.map((item, idx) => (
        <div
          key={idx}
          className="glass-card"
          style={{
            padding: '18px 20px',
            border: `1px solid ${item.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: item.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {item.label}
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0' }}>
              {item.value}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {item.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
