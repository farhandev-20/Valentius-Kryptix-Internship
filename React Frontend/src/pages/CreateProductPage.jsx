import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { ProductForm } from '../components/products/ProductForm';
import { useProducts } from '../context/ProductContext';

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      const created = await addProduct(productData);
      navigate(`/products/${created.id}`);
    } catch (err) {
      console.error('Failed to create product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '14px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Create New Product
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Add a new inventory item to your REST API backend database.
        </p>
      </div>

      {/* Form Component */}
      <ProductForm
        onSubmit={handleSubmit}
        isEditing={false}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
