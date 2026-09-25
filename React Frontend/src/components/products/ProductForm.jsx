import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  AlertCircle, 
  Image as ImageIcon, 
  Tag, 
  Check, 
  Sparkles,
  DollarSign,
  Package,
  Layers,
  RotateCcw
} from 'lucide-react';
import { Badge } from '../common/Badge';

const PRESET_CATEGORIES = [
  'Audio & Sound',
  'Computing',
  'Accessories',
  'Displays & Monitors',
  'Wearables',
  'Gaming',
  'Smart Home',
  'Photography',
  'General',
];

const PRESET_IMAGES = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80' },
  { label: 'Mouse', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80' },
  { label: 'Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80' },
  { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
  { label: 'Gaming Console', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80' },
];

export const ProductForm = ({ initialData = null, onSubmit, isEditing = false, isSubmitting = false }) => {
  const navigate = useNavigate();

  const defaultValues = {
    name: '',
    sku: '',
    category: 'Audio & Sound',
    brand: '',
    price: '',
    cost: '',
    stock: '10',
    minStockAlert: '5',
    rating: '4.5',
    status: 'In Stock',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    tags: 'Premium, Wireless',
    warranty: '1 Year Manufacturer',
  };

  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        category: initialData.category || 'Audio & Sound',
        brand: initialData.brand || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        cost: initialData.cost !== undefined ? String(initialData.cost) : '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '0',
        minStockAlert: initialData.minStockAlert !== undefined ? String(initialData.minStockAlert) : '5',
        rating: initialData.rating !== undefined ? String(initialData.rating) : '4.5',
        status: initialData.status || 'In Stock',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || defaultValues.imageUrl,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
        warranty: initialData.specs?.warranty || '1 Year Manufacturer',
      });
    }
  }, [initialData]);

  // Client-Side Validation Rules
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          error = 'Product title is required.';
        } else if (value.trim().length < 3) {
          error = 'Title must be at least 3 characters.';
        } else if (value.trim().length > 100) {
          error = 'Title cannot exceed 100 characters.';
        }
        break;

      case 'sku':
        if (!value || !value.trim()) {
          error = 'SKU is required.';
        } else if (value.trim().length < 3) {
          error = 'SKU must be at least 3 characters.';
        } else if (!/^[A-Za-z0-9-_]+$/.test(value.trim())) {
          error = 'SKU can only contain letters, numbers, hyphens, and underscores.';
        }
        break;

      case 'brand':
        if (!value || !value.trim()) {
          error = 'Brand name is required.';
        } else if (value.trim().length < 2) {
          error = 'Brand must be at least 2 characters.';
        }
        break;

      case 'price':
        if (value === '' || value === null) {
          error = 'Price is required.';
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = 'Price must be a valid positive number greater than $0.00.';
        }
        break;

      case 'stock':
        if (value === '' || value === null) {
          error = 'Stock quantity is required.';
        } else if (isNaN(Number(value)) || Number(value) < 0 || !Number.isInteger(Number(value))) {
          error = 'Stock must be a non-negative whole number (0, 1, 2...).';
        }
        break;

      case 'cost':
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
          error = 'Cost must be a valid non-negative number.';
        }
        break;

      case 'description':
        if (!value || !value.trim()) {
          error = 'Product description is required.';
        } else if (value.trim().length < 10) {
          error = 'Description must be at least 10 characters long.';
        }
        break;

      case 'imageUrl':
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
          error = 'Image URL must begin with http:// or https://';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Instant validation if already touched
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);

    if (!validateAll()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      brand: formData.brand.trim(),
      price: parseFloat(formData.price),
      cost: formData.cost ? parseFloat(formData.cost) : parseFloat(formData.price) * 0.65,
      stock: parseInt(formData.stock, 10),
      minStockAlert: parseInt(formData.minStockAlert, 10) || 5,
      rating: parseFloat(formData.rating) || 4.5,
      status: parseInt(formData.stock, 10) === 0 ? 'Out of Stock' : (parseInt(formData.stock, 10) <= 5 ? 'Low Stock' : 'In Stock'),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Product'],
      specs: {
        warranty: formData.warranty.trim() || '1 Year Standard',
      },
    };

    onSubmit(payload);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px' }}>
      {/* Left: Interactive Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="glass-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isEditing ? 'Edit Product Details' : 'Product Information'}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span className="required-star">*</span> Required fields
            </span>
          </div>

          {/* Section 1: Basic Info */}
          <div style={{ marginBottom: '20px' }}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                <span>Product Title <span className="required-star">*</span></span>
                <span className="form-hint">{formData.name.length}/100</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'has-error' : ''}`}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.name && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* SKU and Brand (2 cols) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="sku">
                  <span>SKU / Product Code <span className="required-star">*</span></span>
                </label>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  className={`form-input ${errors.sku ? 'has-error' : ''}`}
                  placeholder="e.g. AUD-SNY-0101"
                  value={formData.sku}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                />
                {errors.sku && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.sku}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="brand">
                  <span>Brand <span className="required-star">*</span></span>
                </label>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  className={`form-input ${errors.brand ? 'has-error' : ''}`}
                  placeholder="e.g. Sony, Apple, Logitech"
                  value={formData.brand}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.brand && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.brand}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                <span>Category <span className="required-star">*</span></span>
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Price */}
              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  <span>Retail Price ($) <span className="required-star">*</span></span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-input ${errors.price ? 'has-error' : ''}`}
                    style={{ paddingLeft: '28px' }}
                    placeholder="299.99"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.price && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.price}</span>
                  </div>
                )}
              </div>

              {/* Stock Quantity */}
              <div className="form-group">
                <label className="form-label" htmlFor="stock">
                  <span>Stock Quantity <span className="required-star">*</span></span>
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  className={`form-input ${errors.stock ? 'has-error' : ''}`}
                  placeholder="25"
                  value={formData.stock}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.stock && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.stock}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cost & Alert Threshold (2 cols) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="cost">
                  <span>Cost Price ($)</span>
                </label>
                <input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.cost ? 'has-error' : ''}`}
                  placeholder="Optional cost basis"
                  value={formData.cost}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.cost && (
                  <div className="form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.cost}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="minStockAlert">
                  <span>Low Stock Alert Limit</span>
                </label>
                <input
                  id="minStockAlert"
                  name="minStockAlert"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="5"
                  value={formData.minStockAlert}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media & Details */}
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
              marginBottom: '20px',
            }}
          >
            {/* Image URL */}
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">
                <span>Product Image URL</span>
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                className={`form-input ${errors.imageUrl ? 'has-error' : ''}`}
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.imageUrl && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.imageUrl}</span>
                </div>
              )}

              {/* Quick Image Presets */}
              <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presets:</span>
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: preset.url }))}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.725rem' }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label" htmlFor="tags">
                <span>Tags (comma separated)</span>
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="form-input"
                placeholder="Wireless, Bluetooth, Premium"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="description">
                <span>Description <span className="required-star">*</span></span>
                <span className="form-hint">{formData.description.length} chars</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className={`form-textarea ${errors.description ? 'has-error' : ''}`}
                placeholder="Provide a comprehensive description of features, specs, and highlights..."
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.description && (
                <div className="form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Saving to API...' : isEditing ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Right: Live Preview Card */}
      <div>
        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: 'var(--text-secondary)' }}>
            <Sparkles size={16} color="#818cf8" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Product Card Preview
            </span>
          </div>

          <div
            className="glass-card"
            style={{
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <div style={{ position: 'relative', height: '220px', backgroundColor: '#0f172a' }}>
              <img
                src={formData.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
                alt="Live Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <Badge category={formData.category} />
                <Badge status={Number(formData.stock) === 0 ? 'Out of Stock' : Number(formData.stock) <= 5 ? 'Low Stock' : 'In Stock'} />
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {formData.brand || 'BRAND'}
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  {formData.sku || 'SKU-0000'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formData.name || 'Product Title Preview'}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {formData.description || 'Description will appear here as you type in the form...'}
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {formData.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.725rem',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#cbd5e1',
                      }}
                    >
                      #{t}
                    </span>
                  ))}
              </div>

              <div
                style={{
                  marginTop: '10px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>
                    ${formData.price ? Number(formData.price).toFixed(2) : '0.00'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inventory</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: Number(formData.stock) <= 5 ? '#f59e0b' : '#10b981' }}>
                    {formData.stock || 0} in stock
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
