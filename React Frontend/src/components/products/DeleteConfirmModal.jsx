import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';

export const DeleteConfirmModal = ({ isOpen, onClose, product, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!product) return;
    setDeleting(true);
    try {
      await onConfirm(product.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Product Confirmation" maxWidth="460px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.975rem', marginBottom: '4px' }}>
              Are you sure you want to delete this product?
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              This action will send a <code style={{ color: '#f87171' }}>DELETE /api/products/{product.id}</code> request to your REST API and cannot be undone.
            </p>
          </div>
        </div>

        {/* Product summary pill */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=80';
            }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SKU: {product.sku} • ${product.price}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button onClick={onClose} disabled={deleting} className="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting} className="btn btn-danger btn-sm">
            <Trash2 size={15} />
            <span>{deleting ? 'Deleting...' : 'Delete Permanently'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
