import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Star } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ProductTableRow = ({ product, onDeleteClick }) => {
  return (
    <tr
      style={{
        borderBottom: '1px solid var(--border-color)',
        transition: 'background 0.2s ease',
      }}
      className="table-row-hover"
    >
      {/* Product info with image */}
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=80';
            }}
          />
          <div>
            <Link
              to={`/products/${product.id}`}
              style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.925rem', display: 'block' }}
            >
              {product.name}
            </Link>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Brand: {product.brand || 'Generic'}
            </span>
          </div>
        </div>
      </td>

      {/* SKU */}
      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: '#94a3b8' }}>
        {product.sku}
      </td>

      {/* Category */}
      <td style={{ padding: '14px 16px' }}>
        <Badge category={product.category} />
      </td>

      {/* Price */}
      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem' }}>
        ${Number(product.price || 0).toFixed(2)}
      </td>

      {/* Stock & Status */}
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product.stock} units</span>
          <Badge status={product.status || (product.stock > 0 ? 'In Stock' : 'Out of Stock')} />
        </div>
      </td>

      {/* Rating */}
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span>{product.rating || '4.5'}</span>
        </div>
      </td>

      {/* Actions */}
      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
          <Link
            to={`/products/${product.id}`}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px' }}
            title="View Details"
          >
            <Eye size={15} />
          </Link>
          <Link
            to={`/products/edit/${product.id}`}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px' }}
            title="Edit"
          >
            <Edit3 size={15} />
          </Link>
          <button
            onClick={() => onDeleteClick(product)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', color: '#f87171' }}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};
