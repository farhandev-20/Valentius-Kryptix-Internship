import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { productsApi } from '../api/apiClient';
import { useToast } from './ToastContext';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Last successful fetch timestamp
  const [lastFetched, setLastFetched] = useState(null);

  /**
   * Fetch products from REST API
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll({
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        sortBy: sortBy,
        order: sortOrder,
      });
      setProducts(data);
      setLastFetched(new Date());
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError({
        message: err.message || 'Failed to connect to REST API server.',
        status: err.status || 'Offline',
        isTimeout: err.isTimeout,
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Initial fetch and fetch whenever filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 200); // Small debounce for search
    return () => clearTimeout(handler);
  }, [fetchProducts]);

  /**
   * Get single product by ID
   */
  const getProductById = useCallback(async (id) => {
    try {
      const product = await productsApi.getById(id);
      return product;
    } catch (err) {
      console.error(`Error fetching product ${id}:`, err);
      throw err;
    }
  }, []);

  /**
   * Create a new product
   */
  const addProduct = useCallback(async (productData) => {
    try {
      const newProduct = await productsApi.create(productData);
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Product "${newProduct.name}" created successfully!`, 'success');
      return newProduct;
    } catch (err) {
      const msg = err.data?.message || err.message || 'Failed to create product';
      showToast(msg, 'error');
      throw err;
    }
  }, [showToast]);

  /**
   * Update existing product
   */
  const updateProduct = useCallback(async (id, productData) => {
    try {
      const updated = await productsApi.update(id, productData);
      setProducts((prev) => prev.map((p) => (String(p.id) === String(id) ? updated : p)));
      showToast(`Product "${updated.name}" updated successfully!`, 'success');
      return updated;
    } catch (err) {
      const msg = err.data?.message || err.message || 'Failed to update product';
      showToast(msg, 'error');
      throw err;
    }
  }, [showToast]);

  /**
   * Delete product
   */
  const deleteProduct = useCallback(async (id) => {
    try {
      await productsApi.delete(id);
      const target = products.find((p) => String(p.id) === String(id));
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      showToast(`Product "${target?.name || id}" removed successfully.`, 'success');
      return true;
    } catch (err) {
      const msg = err.data?.message || err.message || 'Failed to delete product';
      showToast(msg, 'error');
      throw err;
    }
  }, [products, showToast]);

  /**
   * Quick adjust stock
   */
  const adjustStock = useCallback(async (id, delta) => {
    const target = products.find((p) => String(p.id) === String(id));
    if (!target) return;
    const newStock = Math.max(0, (target.stock || 0) + delta);
    return updateProduct(id, { ...target, stock: newStock });
  }, [products, updateProduct]);

  /**
   * Computed Dashboard Statistics
   */
  const stats = useMemo(() => {
    const totalCount = products.length;
    const totalValue = products.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0);
    const lowStockCount = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= (p.minStockAlert || 5)).length;
    const outOfStockCount = products.filter((p) => (p.stock || 0) === 0).length;
    const avgPrice = totalCount > 0 ? (products.reduce((acc, p) => acc + (p.price || 0), 0) / totalCount) : 0;

    return {
      totalCount,
      totalValue,
      lowStockCount,
      outOfStockCount,
      avgPrice,
    };
  }, [products]);

  // Available unique categories
  const categories = useMemo(() => {
    const base = ['All', 'Audio & Sound', 'Computing', 'Accessories', 'Displays & Monitors', 'Wearables', 'Gaming'];
    const dynamic = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...base, ...dynamic]));
  }, [products]);

  const value = {
    products,
    loading,
    error,
    stats,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    viewMode,
    setViewMode,
    lastFetched,
    fetchProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
