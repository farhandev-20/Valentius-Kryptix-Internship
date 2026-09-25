import React from 'react';

export const Badge = ({ status, category, children }) => {
  if (status) {
    let badgeClass = 'badge-in-stock';
    let label = status;

    if (status.toLowerCase().includes('out')) {
      badgeClass = 'badge-out-of-stock';
    } else if (status.toLowerCase().includes('low')) {
      badgeClass = 'badge-low-stock';
    }

    return (
      <span className={`badge ${badgeClass}`}>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            display: 'inline-block',
          }}
        />
        {label}
      </span>
    );
  }

  if (category) {
    return <span className="badge badge-category">{category}</span>;
  }

  return <span className="badge badge-category">{children}</span>;
};
