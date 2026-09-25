# 🚀 StockPilot Hub — React Frontend REST API Client
> **Valentius Kryptix Internship Assignment — React Frontend Milestone (150 pts)**  
> Built with **React 19**, **Vite**, **React Router v6**, **Lucide Icons**, and modern CSS.

---

## 📌 Project Overview
StockPilot Hub is an enterprise-grade, responsive product & inventory management frontend application that interacts with a REST API backend. It provides full CRUD operations, live client-side validation, visual loading skeletons, error resilience, and interactive API diagnostics.

---

## ✨ Features & Requirements Fulfilled

### 1. 🛣️ React Router Multi-Page Architecture (At least 3 distinct routes)
- **`/` (Catalog Dashboard)**: Grid & Table views, live KPI statistics, debounced search, category filter, stock status filter, sorting (Name, Price, Stock, Rating, Date), pagination, and delete confirmation modal.
- **`/products/:id` (Product Detail View)**: Detailed overview, high-resolution imagery, SKU copier, price/cost margin calculation, inventory level gauge, quick stock increments, specs table, and a **Raw REST API JSON Inspector Modal**.
- **`/products/new` (Add New Product)**: Multi-section creation form with live side-by-side card preview and client-side validation.
- **`/products/edit/:id` (Edit Product Form)**: Pre-populates API data and validates modifications before submitting `PUT` requests.
- **`/api-settings` (REST API Health & Diagnostics)**: Ping backend server, view response latency (ms), configure custom API base URLs on the fly.
- **`*` (404 Not Found Page)**: User-friendly error navigation fallback.

### 2. 📡 Real REST API Integration
- No hardcoded mock arrays in the final state — fetches all data dynamically via `GET`, `POST`, `PUT`, and `DELETE` requests.
- Includes a standalone **Express REST API server** (`server/index.js`) with pre-seeded realistic data stored in `server/data/products.json`.
- Configurable base URL: Can be pointed to **any backend** (Spring Boot `http://localhost:8080/api`, Node/Express `http://localhost:5000/api`, Python FastAPI/Django, etc.) via `.env` or the in-app API Settings page.

### 3. 🛡️ Visible Loading & Error Handling (Zero Blank Screens)
- **Loading UI**: Animated shimmer skeleton loaders for cards and detail views, plus spinners on submit buttons.
- **Error UI**: If the backend is stopped or returns an error, the app gracefully presents an informative diagnostic banner with the HTTP status, target endpoint, a **"Try Again"** button, and troubleshooting steps.
- **Toast Alerts**: Non-intrusive notification toasts for create, update, delete, and validation failures.

### 4. ✍️ Client-Side Form Validation
- Real-time inline field validation:
  - **Product Title**: Required, 3 to 100 characters.
  - **SKU Code**: Required, minimum 3 characters, alphanumeric format.
  - **Brand**: Required, minimum 2 characters.
  - **Price**: Required, positive decimal number (`> $0.00`).
  - **Stock Quantity**: Required, non-negative whole integer (`>= 0`).
  - **Category**: Required selection.
  - **Description**: Required, minimum 10 characters.
  - **Image URL**: Format validation with preset photo picker.
- Instant visual feedback: Red borders, error icons, descriptive error messages, and disabled submit states.

### 5. 🧠 State Management
- Built with React's Context API & Custom Hooks (`useProducts`, `useToast`):
  - Centralized cache, optimistic updates, active filter criteria, and search state.

### 6. 📱 Responsive Layout & Aesthetics
- Mobile-first, tablet, and desktop responsive layout.
- Glassmorphism design system, dark/light theme toggle, custom SVG icons, and smooth micro-animations.

---

## 🛠️ Tech Stack
- **Frontend Framework**: React 19 + Vite
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System with CSS Custom Properties & Glassmorphism
- **Backend Companion**: Express.js + CORS + File-based persistent JSON DB

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (bundled with Node.js)

---

### Step 1: Install Dependencies
```bash
npm install
```

---

### Step 2: Run Both Backend & Frontend Concurrently (Recommended)
```bash
npm run start:all
```
- **React Frontend**: `http://localhost:5173`
- **Express REST API**: `http://localhost:5000/api/products`
- **API Health Check**: `http://localhost:5000/api/health`

---

### Step 3: Run Services Individually (Alternative)

**To run only the Backend REST API Server:**
```bash
npm run server
```

**To run only the Vite React Frontend:**
```bash
npm run dev
```

---

## 🔌 Connecting to Your WA-2 Backend / Custom REST API

If you built your own REST API in a previous task (e.g. Spring Boot running on `http://localhost:8080`), you can point StockPilot to it in two ways:

### Option A: Via Environment File (`.env`)
Edit `.env` in the root folder:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Option B: In-App API Settings Page
1. Open the app in your browser (`http://localhost:5173`).
2. Click **API Status** in the top navigation bar (or visit `/api-settings`).
3. Enter your backend URL (e.g. `http://localhost:8080/api`) and click **Save & Connect**.
4. Click **Ping REST API** to test connectivity and view real-time latency.

---

## 🧪 Testing Error Handling (Milestone Requirement)

To verify the graceful error handling:
1. Start both frontend and backend using `npm run start:all`.
2. Open `http://localhost:5173` in your browser to see the loaded products.
3. Stop the backend server by pressing `Ctrl + C` in the backend terminal.
4. Refresh the frontend page.
5. **Observed Behavior**: The page will not crash or go blank. Instead, an informative error panel appears with diagnostic information, HTTP status, and a **"Try Again"** button.
6. Restart the backend server (`npm run server`) and click **"Try Again"** — the data will immediately recover!

---

## 📚 REST API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server health check & status |
| `GET` | `/api/products` | Fetch all products (supports `?search=&category=&sortBy=`) |
| `GET` | `/api/products/:id` | Fetch single product by ID |
| `POST` | `/api/products` | Create a new product (with validation) |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE`| `/api/products/:id` | Delete product by ID |

---

## 📁 Project Directory Structure
```
React Frontend/
├── .env                  # REST API base URL configuration
├── .env.example          # Example environment file
├── index.html            # Entry HTML with fonts and SEO meta tags
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite config with dev API proxy
├── server/
│   ├── index.js          # Express REST API Server
│   └── data/
│       └── products.json # JSON database storage
└── src/
    ├── main.jsx          # App root mount
    ├── App.jsx           # React Router route definitions
    ├── index.css         # Modern design system & theme tokens
    ├── api/
    │   └── apiClient.js  # REST API fetch client & timeout handling
    ├── context/
    │   ├── ProductContext.jsx # Products CRUD state & search filters
    │   └── ToastContext.jsx   # Slide-in toast alerts
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── Layout.jsx
    │   ├── common/
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── SkeletonCard.jsx
    │   │   ├── ErrorState.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── Modal.jsx
    │   │   └── Badge.jsx
    │   └── products/
    │       ├── ProductCard.jsx
    │       ├── ProductTableRow.jsx
    │       ├── ProductStats.jsx
    │       ├── ProductFilterBar.jsx
    │       ├── ProductForm.jsx
    │       └── DeleteConfirmModal.jsx
    └── pages/
        ├── ProductListPage.jsx
        ├── ProductDetailPage.jsx
        ├── CreateProductPage.jsx
        ├── EditProductPage.jsx
        ├── ApiSettingsPage.jsx
        └── NotFoundPage.jsx
```

---

## 🏆 Submission Checklist
- [x] At least 3 distinct routes using React Router (`/`, `/products/:id`, `/products/new`, `/products/edit/:id`, `/api-settings`)
- [x] Fetches real data from REST API (no hardcoded arrays in final view)
- [x] Loading state (shimmer skeleton loaders & spinners)
- [x] Error state (graceful error banners, retry button, connection ping)
- [x] Client-side form validation before API submission
- [x] State management via React Context & custom hooks
- [x] Responsive layout (mobile + desktop)
- [x] Complete README documentation with instructions
