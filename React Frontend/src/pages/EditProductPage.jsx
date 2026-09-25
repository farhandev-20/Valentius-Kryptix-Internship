import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, ArrowLeft } from 'lucide-react';
import { ProductForm } from '../components/products/ProductForm';
import { SkeletonDetail } from '../components/common/SkeletonCard';
import { ErrorState } from '../components/common/ErrorState';
import { productsApi } from '../api/apiClient';
import { useProducts } from '../context/ProductContext';

export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct } = useProducts();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getById(id);
      setInitialData(data);
    } catch (err) {
      setError({
        message: err.message || `Product with ID '${id}' could not be fetched for editing.`,
        status: err.status || '404',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      const updated = await updateProduct(id, productData);
      navigate(`/products/${updated.id}`);
    } catch (err) {
      console.error('Failed to update product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <SkeletonDetail />
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <ErrorState error={error} onRetry={fetchProduct} title="Product Not Found" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate(`/products/${id}`)}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Product Details</span>
        </button>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Edit Product: {initialData.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Update fields and submit changes directly to your REST API.
        </p>
      </div>

      {/* Form Component */}
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isEditing={true}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
