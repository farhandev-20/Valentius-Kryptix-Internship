import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, RefreshCw } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductStats } from '../components/products/ProductStats';
import { ProductFilterBar } from '../components/products/ProductFilterBar';
import { ProductCard } from '../components/products/ProductCard';
import { ProductTableRow } from '../components/products/ProductTableRow';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';

export const ProductListPage = () => {
  const {
    products,
    loading,
    error,
    viewMode,
    fetchProducts,
    deleteProduct,
    setSearchQuery,
    setSelectedCategory,
    setSelectedStatus,
  } = useProducts();

  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Product Inventory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage, filter, and inspect your real-time REST API product catalog.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/products/new" className="btn btn-primary">
            <Plus size={16} />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <ProductStats />

      {/* Search & Filter Bar */}
      <ProductFilterBar />

      {/* Content Rendering based on Loading / Error / Empty states */}
      {loading ? (
        viewMode === 'grid' ? (
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Loading catalog data from REST API...</p>
          </div>
        )
      ) : error ? (
        <ErrorState error={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : viewMode === 'grid' ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div
          className="glass-card"
          style={{
            overflowX: 'auto',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-muted)',
                }}
              >
                <th style={{ padding: '14px 16px' }}>Product</th>
                <th style={{ padding: '14px 16px' }}>SKU</th>
                <th style={{ padding: '14px 16px' }}>Category</th>
                <th style={{ padding: '14px 16px' }}>Price</th>
                <th style={{ padding: '14px 16px' }}>Stock</th>
                <th style={{ padding: '14px 16px' }}>Rating</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={productToDelete}
        onConfirm={deleteProduct}
      />
    </div>
  );
};
