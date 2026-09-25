import React from 'react';

export const SkeletonCard = () => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Image Skeleton */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: '180px',
          borderRadius: 'var(--radius-md)',
        }}
      />
      {/* Badge & Category Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '999px' }} />
        <div className="skeleton" style={{ width: '60px', height: '22px', borderRadius: '999px' }} />
      </div>
      {/* Title Skeleton */}
      <div className="skeleton" style={{ width: '90%', height: '20px' }} />
      <div className="skeleton" style={{ width: '70%', height: '16px' }} />
      {/* Price & Action Skeleton */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="skeleton" style={{ width: '75px', height: '28px' }} />
        <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  );
};

export const SkeletonDetail = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
      {/* Image Skeleton */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: '420px',
          borderRadius: 'var(--radius-lg)',
        }}
      />
      {/* Details Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="skeleton" style={{ width: '100px', height: '26px', borderRadius: '999px' }} />
          <div className="skeleton" style={{ width: '90px', height: '26px', borderRadius: '999px' }} />
        </div>
        <div className="skeleton" style={{ width: '100%', height: '36px' }} />
        <div className="skeleton" style={{ width: '60%', height: '24px' }} />
        <div className="skeleton" style={{ width: '120px', height: '40px' }} />
        <div className="skeleton" style={{ width: '100%', height: '80px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    </div>
  );
};
