import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, Edit3, Trash2, Plus, Minus, Tag } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useProducts } from '../../context/ProductContext';

export const ProductCard = ({ product, onDeleteClick }) => {
  const { adjustStock } = useProducts();

  const handleStockInc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    adjustStock(product.id, 1);
  };

  const handleStockDec = (e) => {
    e.preventDefault();
    e.stopPropagation();
    adjustStock(product.id, -1);
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Top Image & Badges */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80';
          }}
        />

        {/* Floating status & category */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{ pointerEvents: 'auto' }}>
            <Badge category={product.category} />
          </span>
          <span style={{ pointerEvents: 'auto' }}>
            <Badge status={product.status || (product.stock > 0 ? 'In Stock' : 'Out of Stock')} />
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '10px',
        }}
      >
        {/* Brand & SKU */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {product.brand || 'Generic'}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-surface)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {product.sku}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product.id}`}
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '2.7em',
          }}
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {product.rating || '4.5'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 5.0</span>
        </div>

        {/* Stock Level Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Stock:</span>
            <span style={{ fontWeight: 600, color: product.stock <= 5 ? '#f59e0b' : '#10b981' }}>
              {product.stock} units
            </span>
          </div>
          <div
            style={{
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, (product.stock / 50) * 100))}%`,
                backgroundColor: product.stock === 0 ? '#ef4444' : product.stock <= 5 ? '#f59e0b' : '#10b981',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        {/* Price & Actions Row */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
              ${Number(product.price || 0).toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              to={`/products/${product.id}`}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px' }}
              title="View Product Details"
            >
              <Eye size={15} />
            </Link>

            <Link
              to={`/products/edit/${product.id}`}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px' }}
              title="Edit Product"
            >
              <Edit3 size={15} />
            </Link>

            <button
              onClick={() => onDeleteClick(product)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px', color: '#f87171' }}
              title="Delete Product"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
