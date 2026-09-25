import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Star, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  Copy, 
  Check, 
  Plus, 
  Minus,
  Code2,
  Package,
  DollarSign
} from 'lucide-react';
import { productsApi } from '../api/apiClient';
import { Badge } from '../components/common/Badge';
import { SkeletonDetail } from '../components/common/SkeletonCard';
import { ErrorState } from '../components/common/ErrorState';
import { Modal } from '../components/common/Modal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteProduct, adjustStock } = useProducts();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getById(id);
      setProduct(data);
    } catch (err) {
      console.error('Error fetching detail:', err);
      setError({
        message: err.message || `Product with ID '${id}' could not be loaded from the REST API.`,
        status: err.status || '404',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleCopySku = () => {
    if (!product?.sku) return;
    navigator.clipboard.writeText(product.sku);
    setIsCopied(true);
    showToast(`SKU '${product.sku}' copied to clipboard!`, 'info');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAdjustStock = async (delta) => {
    if (!product) return;
    try {
      const newStock = Math.max(0, (product.stock || 0) + delta);
      const updated = await productsApi.update(product.id, { ...product, stock: newStock });
      setProduct(updated);
      showToast(`Stock updated to ${newStock} units`, 'success');
    } catch (err) {
      showToast('Failed to update stock', 'error');
    }
  };

  const handleDeleteSuccess = async (deletedId) => {
    await deleteProduct(deletedId);
    navigate('/');
  };

  if (loading) {
    return (
      <div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>
        <SkeletonDetail />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>
        <ErrorState error={error} onRetry={fetchProduct} title="Failed to Load Product" />
      </div>
    );
  }

  const profitMargin = product.cost && product.price
    ? (((product.price - product.cost) / product.price) * 100).toFixed(1)
    : null;

  return (
    <div>
      {/* Top Action Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <button onClick={() => navigate('/')} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Inventory</span>
        </button>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* JSON API Inspector Button */}
          <button
            onClick={() => setIsApiModalOpen(true)}
            className="btn btn-secondary btn-sm"
            title="Inspect REST API JSON response"
          >
            <Code2 size={15} />
            <span>View REST JSON</span>
          </button>

          {/* Edit Button */}
          <Link to={`/products/edit/${product.id}`} className="btn btn-primary btn-sm">
            <Edit3 size={15} />
            <span>Edit Product</span>
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px',
        }}
      >
        {/* Left Column: Image Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            className="glass-card"
            style={{
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#0f172a',
              border: '1px solid var(--border-color)',
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: '100%',
                height: '420px',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="glass-card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: '100%', marginBottom: '4px' }}>
                Product Tags:
              </span>
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Card */}
          <div className="glass-card" style={{ padding: '24px 28px' }}>
            {/* Category & Status Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <Badge category={product.category} />
              <Badge status={product.status || (product.stock > 0 ? 'In Stock' : 'Out of Stock')} />
            </div>

            {/* Brand & SKU */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {product.brand || 'Generic'}
              </span>
              <span style={{ color: 'var(--border-color)' }}>•</span>
              <button
                onClick={handleCopySku}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Click to copy SKU"
              >
                <span>{product.sku}</span>
                {isCopied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
              </button>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '14px' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating || 4.5) ? '#fbbf24' : 'none'}
                    color="#fbbf24"
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.rating || '4.5'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>(Verified Catalog Item)</span>
            </div>

            {/* Pricing Section */}
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Unit Price</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#38bdf8' }}>
                  ${Number(product.price || 0).toFixed(2)}
                </div>
              </div>

              {product.cost && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Cost Basis</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    ${Number(product.cost).toFixed(2)}
                  </div>
                </div>
              )}

              {profitMargin && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Margin</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
                    +{profitMargin}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Controls Card */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={18} color="#818cf8" />
              <span>Real-Time Inventory Management</span>
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Available Stock:</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: product.stock <= 5 ? '#f59e0b' : '#10b981' }}>
                {product.stock} units
              </span>
            </div>

            {/* Quick stock +/- buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quick Adjust:</span>
              <button
                onClick={() => handleAdjustStock(-1)}
                disabled={product.stock <= 0}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px' }}
                title="Decrease stock by 1"
              >
                <Minus size={14} /> 1
              </button>
              <button
                onClick={() => handleAdjustStock(-5)}
                disabled={product.stock < 5}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px' }}
                title="Decrease stock by 5"
              >
                <Minus size={14} /> 5
              </button>
              <button
                onClick={() => handleAdjustStock(1)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px' }}
                title="Increase stock by 1"
              >
                <Plus size={14} /> 1
              </button>
              <button
                onClick={() => handleAdjustStock(10)}
                className="btn btn-secondary btn-sm"
                style={{ padding: '6px 12px' }}
                title="Increase stock by 10"
              >
                <Plus size={14} /> 10
              </button>
            </div>
          </div>

          {/* Description Card */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
              Product Overview
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              {product.description}
            </p>
          </div>

          {/* Specifications Card */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="glass-card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                <span>Technical Specifications</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {Object.entries(product.specs).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', display: 'block' }}>
                      {k.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata timestamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 4px' }}>
            <span>ID: <code style={{ color: '#94a3b8' }}>{product.id}</code></span>
            <span>Last Updated: {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={product}
        onConfirm={handleDeleteSuccess}
      />

      {/* REST API Raw Payload Inspector Modal */}
      <Modal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        title="REST API JSON Response Inspector"
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Endpoint: <code style={{ color: '#38bdf8' }}>GET /api/products/{product.id}</code>
            </span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>200 OK</span>
          </div>

          <pre
            style={{
              padding: '16px',
              backgroundColor: '#090d16',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.825rem',
              overflowX: 'auto',
              maxHeight: '360px',
            }}
          >
            {JSON.stringify({ success: true, data: product }, null, 2)}
          </pre>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsApiModalOpen(false)} className="btn btn-secondary btn-sm">
              Close Inspector
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
