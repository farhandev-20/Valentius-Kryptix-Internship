import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import { Layout } from './components/layout/Layout';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CreateProductPage } from './pages/CreateProductPage';
import { EditProductPage } from './pages/EditProductPage';
import { ApiSettingsPage } from './pages/ApiSettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ProductProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ProductListPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="products/new" element={<CreateProductPage />} />
              <Route path="products/edit/:id" element={<EditProductPage />} />
              <Route path="api-settings" element={<ApiSettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ProductProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
