import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read products
const readProductsFromFile = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

// Helper function to write products
const writeProductsToFile = (products) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
};

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  const products = readProductsFromFile();
  res.json({
    status: 'ok',
    message: 'Kryptix REST API Server is running smoothly',
    timestamp: new Date().toISOString(),
    totalProducts: products.length,
    version: '1.0.0'
  });
});

// 2. GET all products (with optional search, filter by category, status, and sorting)
app.get('/api/products', (req, res) => {
  try {
    let products = readProductsFromFile();
    const { search, category, status, sortBy, order = 'asc' } = req.query;

    // Search query
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      products = products.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== 'All') {
      products = products.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    // Status filter
    if (status && status !== 'All') {
      products = products.filter((p) => p.status?.toLowerCase() === status.toLowerCase());
    }

    // Sorting
    if (sortBy) {
      products.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB?.toLowerCase() || '';
          return order === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }

        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
        return order === 'desc' ? valB - valA : valA - valB;
      });
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// 3. GET product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProductsFromFile();
    const product = products.find((p) => String(p.id) === String(req.params.id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' was not found.`
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// 4. POST create new product
app.post('/api/products', (req, res) => {
  try {
    const { name, sku, category, price, stock, brand, description, imageUrl, tags, specs } = req.body;

    // Server-side validation
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Product title must be at least 3 characters long.' });
    }
    if (!sku || sku.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'A valid SKU code is required.' });
    }
    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
    }
    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ success: false, message: 'Stock must be a non-negative number.' });
    }

    const products = readProductsFromFile();

    // Check duplicate SKU
    const existingSku = products.find(
      (p) => p.sku?.trim().toUpperCase() === sku.trim().toUpperCase()
    );
    if (existingSku) {
      return res.status(400).json({ success: false, message: `A product with SKU '${sku}' already exists.` });
    }

    const parsedStock = parseInt(stock, 10);
    const parsedPrice = parseFloat(price);
    const parsedCost = req.body.cost ? parseFloat(req.body.cost) : (parsedPrice * 0.65);
    const minAlert = req.body.minStockAlert ? parseInt(req.body.minStockAlert, 10) : 5;

    let computedStatus = 'In Stock';
    if (parsedStock === 0) computedStatus = 'Out of Stock';
    else if (parsedStock <= minAlert) computedStatus = 'Low Stock';

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category: category || 'General',
      brand: brand?.trim() || 'Generic',
      price: parsedPrice,
      cost: parsedCost,
      stock: parsedStock,
      minStockAlert: minAlert,
      rating: req.body.rating ? parseFloat(req.body.rating) : 4.5,
      status: req.body.status || computedStatus,
      description: description?.trim() || 'No description provided.',
      imageUrl: imageUrl?.trim() || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : ['New']),
      specs: specs || {
        warranty: '1 Year Standard',
        origin: 'International'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    writeProductsToFile(products);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// 5. PUT update existing product
app.put('/api/products/:id', (req, res) => {
  try {
    const products = readProductsFromFile();
    const index = products.findIndex((p) => String(p.id) === String(req.params.id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' was not found.`
      });
    }

    const { name, sku, category, price, stock, brand, description, imageUrl, tags, specs, status } = req.body;

    if (name && name.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Product title must be at least 3 characters.' });
    }
    if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
      return res.status(400).json({ success: false, message: 'Price must be greater than 0.' });
    }
    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative.' });
    }

    const current = products[index];
    const updatedStock = stock !== undefined ? parseInt(stock, 10) : current.stock;
    const minAlert = req.body.minStockAlert !== undefined ? parseInt(req.body.minStockAlert, 10) : current.minStockAlert;

    let computedStatus = status || current.status;
    if (stock !== undefined) {
      if (updatedStock === 0) computedStatus = 'Out of Stock';
      else if (updatedStock <= minAlert) computedStatus = 'Low Stock';
      else computedStatus = 'In Stock';
    }

    const updatedProduct = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      sku: sku !== undefined ? sku.trim().toUpperCase() : current.sku,
      category: category !== undefined ? category : current.category,
      brand: brand !== undefined ? brand.trim() : current.brand,
      price: price !== undefined ? parseFloat(price) : current.price,
      cost: req.body.cost !== undefined ? parseFloat(req.body.cost) : current.cost,
      stock: updatedStock,
      minStockAlert: minAlert,
      rating: req.body.rating !== undefined ? parseFloat(req.body.rating) : current.rating,
      status: computedStatus,
      description: description !== undefined ? description.trim() : current.description,
      imageUrl: imageUrl !== undefined ? imageUrl.trim() : current.imageUrl,
      tags: Array.isArray(tags) ? tags : (tags !== undefined ? tags.split(',').map((t) => t.trim()) : current.tags),
      specs: specs !== undefined ? specs : current.specs,
      updatedAt: new Date().toISOString()
    };

    products[index] = updatedProduct;
    writeProductsToFile(products);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// 6. DELETE product
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readProductsFromFile();
    const index = products.findIndex((p) => String(p.id) === String(req.params.id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' was not found.`
      });
    }

    const deleted = products.splice(index, 1)[0];
    writeProductsToFile(products);

    res.json({
      success: true,
      message: `Product '${deleted.name}' deleted successfully.`,
      data: deleted
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` 🚀 Kryptix REST API Server running on port ${PORT}`);
  console.log(` 📡 Base URL: http://localhost:${PORT}/api/products`);
  console.log(` ❤️  Health:   http://localhost:${PORT}/api/health`);
  console.log(`=============================================`);
});
