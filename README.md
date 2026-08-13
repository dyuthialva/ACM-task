# NICEMART

A full-stack e-commerce platform built with React, Node.js, Express, and SQLite. NICEMART demonstrates end-to-end web development — from a responsive React frontend with Context API state management, through a RESTful Express backend with JWT authentication and role-based authorization, to a SQLite database with transactional order processing. The project covers product browsing, shopping cart, checkout, order management, and a complete admin dashboard.

---

## Features

### User Features
- **Registration & Login** — Create an account and sign in with email and password
- **JWT Authentication** — Secure token-based sessions persisted across page refreshes
- **Product Browsing** — Browse the full catalog of workspace gear and electronics
- **Search** — Real-time product search by name (debounced API calls)
- **Category Filtering** — Filter products by category
- **Sorting** — Sort by price (low→high, high→low) or name (A→Z, Z→A)
- **Product Details** — Dedicated product page with stock status, description, and add-to-cart
- **Shopping Cart** — Persistent cart with quantity controls, stock-limit enforcement, and subtotal calculation
- **Checkout** — Review order items and place order with a single click
- **Order Creation** — Backend validates stock, calculates totals, and creates order atomically
- **Order History** — View all past orders with item details, totals, and statuses
- **Order Status** — See current status of each order (Placed → Processing → Shipped → Delivered)

### Admin Features
- **Admin Authentication** — Admin account with elevated role, protected via JWT + middleware
- **Add Products** — Create new products with name, price, category, description, image URL, and stock
- **Edit Products** — Update any product field inline via the admin dashboard
- **Delete Products** — Remove products with confirmation dialog
- **View All Orders** — See every order placed by every user, with user details
- **Update Order Status** — Change order status (Placed / Processing / Shipped / Delivered / Cancelled) in real time

### Validation & Security
- **bcrypt password hashing** — Passwords are salted and hashed before storage; never stored or returned in plain text
- **JWT authentication** — Stateless token-based auth; tokens expire after 24 hours
- **Role-based authorization** — `authMiddleware` validates tokens; `adminMiddleware` restricts routes to admin role only
- **Backend stock validation** — Stock is read from the database at order time, never trusted from the frontend
- **Backend order total calculation** — Order totals are computed server-side using database prices
- **Input validation** — Both frontend (per-field, inline) and backend validate all user inputs
- **API error handling** — Consistent HTTP status codes; raw database errors are never exposed
- **Database transactions** — Order creation runs inside a `better-sqlite3` transaction — rolls back entirely on any failure

---

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI component library |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client for API calls |
| **React Router v6** | Client-side routing |
| **React Context API** | Global state (cart, auth) |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | HTTP server and routing |
| **jsonwebtoken** | JWT creation and verification |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variable loading |
| **cors** | Cross-origin request handling |

### Database
| Technology | Purpose |
|---|---|
| **SQLite** | Embedded relational database |
| **better-sqlite3** | Synchronous SQLite driver with transaction support |

---

## Architecture

```
┌─────────────────────────────────┐
│         React Frontend          │
│  (Vite · React Router · Context)│
└────────────────┬────────────────┘
                 │ HTTP (Axios)
                 ▼
┌─────────────────────────────────┐
│       Express REST API          │
│         (localhost:5000)        │
├─────────────────────────────────┤
│  authMiddleware │ adminMiddleware│  ← JWT verification layer
├─────────────────────────────────┤
│  productController              │
│  authController                 │
│  orderController                │
└────────────────┬────────────────┘
                 │ better-sqlite3
                 ▼
┌─────────────────────────────────┐
│       SQLite Database           │
│        (nicemart.db)            │
│  users · products · orders      │
│  order_items                    │
└─────────────────────────────────┘
```

### Authentication Flow

1. User submits credentials to `POST /api/auth/login`
2. Backend verifies the bcrypt hash and signs a JWT containing `{ id, email, role }`
3. Frontend stores the token in `localStorage` via `AuthContext`
4. All subsequent requests include `Authorization: Bearer <token>` via Axios
5. `authMiddleware` verifies the token on every protected route and attaches `req.user`

### Admin Authorization

Routes requiring admin access (e.g. `PUT /api/orders/:id/status`, `DELETE /api/products/:id`) are double-guarded:

```
request → authMiddleware (validates JWT) → adminMiddleware (checks req.user.role === 'admin') → controller
```

If either check fails, the request is rejected with `401 Unauthorized` or `403 Forbidden` — the controller never executes.

---

## API Endpoints

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products. Supports `?search=`, `?category=`, `?sort=` |
| `GET` | `/api/products/:id` | Public | Get a single product by ID |
| `POST` | `/api/products` | **Admin** | Create a new product |
| `PUT` | `/api/products/:id` | **Admin** | Update an existing product |
| `DELETE` | `/api/products/:id` | **Admin** | Delete a product |

**Sort values:** `price_asc`, `price_desc`, `name_asc`, `name_desc`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/me` | **Auth** | Get current authenticated user profile |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/orders` | **Auth** | Place a new order (transactional) |
| `GET` | `/api/orders` | **Auth** | Get orders (own orders for users; all orders for admin) |
| `GET` | `/api/orders/:id` | **Auth** | Get a single order (own only, or any for admin) |
| `PUT` | `/api/orders/:id/status` | **Admin** | Update order status |

---

## Database

### Schema

```sql
-- Users table
CREATE TABLE users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,          -- bcrypt hash, never plain text
  role       TEXT DEFAULT 'user',    -- 'user' | 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  price       REAL NOT NULL,
  category    TEXT NOT NULL,
  description TEXT,
  image       TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER,
  total_amount REAL NOT NULL,
  status       TEXT DEFAULT 'Placed',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id   INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity   INTEGER NOT NULL,
  price      REAL NOT NULL,     -- price at time of purchase (snapshot)
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

### Relationships

```
users ──< orders ──< order_items >── products
```

- One **user** can have many **orders**
- One **order** can have many **order_items**
- Each **order_item** references one **product** (with a price snapshot taken at checkout time)

---

## Installation

### Prerequisites
- Node.js v18+ and npm

### 1. Clone the repository

```bash
git clone https://github.com/dyuthialva/ACM-task.git
cd ACM-task
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Configure environment variables (optional)

Create a `.env` file in the project root:

```env
PORT=5000
JWT_SECRET=your_strong_secret_here
NODE_ENV=development
```

> If `.env` is not provided, the backend defaults to `PORT=5000` and a fallback JWT secret. **Always set a strong `JWT_SECRET` in any real deployment.**

### 5. Start the backend

From the project root:

```bash
npm run dev
```

The backend starts on `http://localhost:5000`. The SQLite database (`backend/nicemart.db`) is created and seeded automatically on first run.

### 6. Start the frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

The frontend starts on `http://localhost:5173`.

Open `http://localhost:5173` in your browser.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express server listens on |
| `JWT_SECRET` | `nicemart_secret_key` | Secret used to sign and verify JWTs |
| `NODE_ENV` | `development` | Controls whether raw error details are returned in 500 responses |

> **Security note:** The default `JWT_SECRET` is insecure and is only suitable for local development. Always use a long, random secret in any staging or production environment.

---

## Admin Demo Account

The database is seeded with a default admin account for development and testing:

| Field | Value |
|---|---|
| Email | `admin@nicemart.com` |
| Password | `Admin123!` |
| Role | `admin` |

> ⚠️ **This is a development/demo credential.** Do not use these credentials in a real deployment. Replace the seeded admin password with a strong, unique password and remove the seed script before going to production.

---

## Stock & Race Condition Handling

### The Problem

If only one unit of a product remains in stock and two users attempt to purchase it simultaneously, a naive implementation might:

1. Both users read stock = 1 ✅
2. Both users pass the stock check ✅
3. Both users create an order ✅
4. Stock is decremented twice → stock = -1 ❌

### The Solution

NICEMART prevents this using a **database transaction** in `orderController.js`:

```js
const executeOrderTransaction = db.transaction((userId, items) => {
  // 1. Re-read stock from DB inside the transaction (not from frontend)
  const product = db.prepare('SELECT price, stock FROM products WHERE id = ?').get(productId);

  // 2. Hard-check stock — throws if insufficient
  if (product.stock < requestedQuantity) {
    throw new Error(`Insufficient stock for ${product.name}.`);
  }

  // 3. Create order record
  // 4. Create order_item records
  // 5. Decrement stock atomically
  db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(quantity, productId);
});
```

Key guarantees:
- **Stock is always read from the database** at order time — frontend stock values are ignored
- **The entire sequence** (stock check → order creation → stock decrement) is wrapped in a single `better-sqlite3` transaction
- If any step throws an error, the entire transaction is **automatically rolled back** — no partial orders or phantom inventory decrements
- **Order totals** are calculated server-side from database prices — the frontend total is never trusted

---

## Challenges & Solutions

### 1. Keeping cart state across pages and browser refreshes

**Problem:** React component state resets on navigation or refresh, losing cart contents.

**Solution:** `CartContext` wraps the entire app via the React Context API. Cart state is persisted to `localStorage` on every change and restored on mount, providing seamless persistence without a backend session.

```js
// Persist on every cart change
useEffect(() => {
  localStorage.setItem('nicemart_cart', JSON.stringify(cart));
}, [cart]);

// Restore on first load
const [cart, setCart] = useState(() => {
  const saved = localStorage.getItem('nicemart_cart');
  return saved ? JSON.parse(saved) : [];
});
```

### 2. Preventing overselling when stock is low

**Problem:** Multiple concurrent purchases could oversell a product if stock checks are done outside a transaction.

**Solution:** The backend runs all stock validation, order creation, and stock decrement inside a single `better-sqlite3` transaction. SQLite's serialized writes ensure that two concurrent requests cannot both pass the stock check for the same final item.

### 3. Securing admin functionality from regular users

**Problem:** Admin-only actions (product CRUD, order status updates) must be inaccessible to regular users — both in the UI and at the API level.

**Solution:** Two-layer protection:
- **Frontend:** `ProtectedRoute` with `adminOnly={true}` redirects non-admin users away from `/admin` before they see any UI
- **Backend:** Every admin API route is guarded by `adminMiddleware` which checks `req.user.role === 'admin'` — a regular user's JWT is rejected with `403 Forbidden` even if they bypass the frontend

### 4. Keeping frontend and backend data synchronized

**Problem:** Product stock changes (from other users' purchases) need to be reflected correctly — a user shouldn't be able to add more than what's actually available.

**Solution:** Product data is fetched fresh from the backend whenever the user visits a product page. The backend is the single source of truth for stock; the frontend only uses backend stock for display and cart enforcement. The final stock check always happens server-side at checkout.

---

## Screenshots

Screenshots are located in `docs/screenshots/`:

| Page | File |
|---|---|
| Home | `docs/screenshots/home.png` |
| Products | `docs/screenshots/products.png` |
| Product Details | `docs/screenshots/product-details.png` |
| Cart | `docs/screenshots/cart.png` |
| Checkout | `docs/screenshots/checkout.png` |
| Orders | `docs/screenshots/orders.png` |
| Admin Dashboard | `docs/screenshots/admin.png` |

> To add screenshots, place PNG files in the `docs/screenshots/` directory following the naming convention above.

---

## Future Improvements

The following features are intentionally out of scope for this version but would be natural next steps:

- **Razorpay Integration** — Real payment processing with order confirmation webhooks
- **Wishlist** — Save products for later, persisted to user accounts
- **Product Reviews & Ratings** — User-submitted reviews with star ratings per product
- **Coupon/Discount Codes** — Promo code validation applied at checkout
- **Analytics Dashboard** — Admin charts for revenue, top products, and order trends
- **Production-grade Authentication** — Replace `localStorage` JWT storage with secure `HttpOnly` cookies to protect against XSS; add CSRF protection for state-changing requests
- **Email Notifications** — Order confirmation and status update emails via Nodemailer or SendGrid
- **Pagination** — Server-side pagination for large product catalogs and order lists
- **Image Uploads** — Upload product images directly instead of pasting URLs (e.g. via Cloudinary)

---

## Project Structure

```
ACM-task/
├── server.js                    # Express app entry point; route registration
├── package.json                 # Backend dependencies
├── .env                         # Environment variables (not committed)
├── .gitignore
│
├── backend/
│   ├── database.js              # SQLite setup, table creation, seed data
│   ├── nicemart.db              # SQLite database file (auto-created)
│   ├── controllers/
│   │   ├── authController.js    # register, login, getMe
│   │   ├── productController.js # getProducts, getProductById, createProduct, updateProduct, deleteProduct
│   │   └── orderController.js   # createOrder, getOrders, getOrderById, updateOrderStatus
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT token verification
│   │   └── adminMiddleware.js   # Admin role check (requires authMiddleware first)
│   └── routes/
│       ├── authRoutes.js        # /api/auth/*
│       ├── productRoutes.js     # /api/products/*
│       └── orderRoutes.js       # /api/orders/*
│
├── frontend/
│   ├── index.html
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Router, route definitions, providers
│       ├── index.css            # Global styles
│       ├── context/
│       │   ├── AuthContext.jsx  # Auth state, login/logout/register, token management
│       │   └── CartContext.jsx  # Cart state, add/remove/update, localStorage sync
│       ├── components/
│       │   ├── Navbar.jsx               # Top navigation, cart badge, auth menu
│       │   ├── ProductCard.jsx          # Product grid card with stock badge
│       │   ├── ProtectedRoute.jsx       # Route guard (auth + admin)
│       │   ├── AdminProductForm.jsx     # Add/edit product form
│       │   ├── AdminProductTable.jsx    # Product management table with edit/delete
│       │   └── AdminOrderTable.jsx      # Order management with status dropdowns
│       └── pages/
│           ├── Home.jsx            # Landing page with hero and feature highlights
│           ├── Products.jsx        # Product listing with search/filter/sort
│           ├── ProductDetails.jsx  # Single product page with add-to-cart
│           ├── Cart.jsx            # Shopping cart with quantity controls
│           ├── Checkout.jsx        # Order review and placement
│           ├── Orders.jsx          # Order history (user) / all orders (admin)
│           ├── Login.jsx           # Login form with validation
│           ├── Register.jsx        # Registration form with validation
│           └── AdminDashboard.jsx  # Admin panel (products + orders tabs)
│
└── docs/
    └── screenshots/             # UI screenshots
```

---

## License

This project was built as an academic/portfolio submission. All product data is fictional and for demonstration purposes only.
