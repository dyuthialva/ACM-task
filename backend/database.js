const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the backend directory exists
const backendDir = __dirname;
if (!fs.existsSync(backendDir)) {
  fs.mkdirSync(backendDir, { recursive: true });
}

// Connect to SQLite database
const dbPath = path.join(backendDir, 'nicemart.db');
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Initialize database schema
const initializeDatabase = () => {
  // 1. Create users table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // 2. Create products table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      image TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // 3. Create orders table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Placed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `).run();

  // 4. Create order_items table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `).run();

  console.log('Database tables verified/created successfully.');

  // Seed data if products table is empty
  seedProducts();
};

const seedProducts = () => {
  const countRow = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (countRow.count > 0) {
    console.log('Products table already has data. Seeding skipped.');
    return;
  }

  console.log('Products table is empty. Seeding realistic NICEMART products...');

  const mockProducts = [
    {
      name: 'Keychron K2 Wireless Mechanical Keyboard',
      price: 79.99,
      category: 'Gaming',
      description: 'Compact 75% layout tactile mechanical keyboard with Bluetooth connectivity and RGB backlighting.',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400',
      stock: 45
    },
    {
      name: 'Razer DeathAdder V3 Pro',
      price: 149.99,
      category: 'Gaming',
      description: 'Ultra-lightweight wireless ergonomic gaming mouse with 30K DPI optical sensor and 90 hours battery life.',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400',
      stock: 30
    },
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      price: 399.99,
      category: 'Audio',
      description: 'Premium industry-leading noise canceling wireless over-ear headphones with exceptional sound clarity.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
      stock: 25
    },
    {
      name: 'SteelSeries Arctis Nova Pro',
      price: 349.99,
      category: 'Audio',
      description: 'Premium wireless gaming headset with active noise cancellation, dual audio streams, and hot-swappable batteries.',
      image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=400',
      stock: 15
    },
    {
      name: 'Dell UltraSharp 27" 4K Monitor',
      price: 499.99,
      category: 'Electronics',
      description: '27-inch 4K USB-C hub monitor featuring IPS Black technology, color-accurate performance, and 90W power delivery.',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
      stock: 12
    },
    {
      name: 'Apple iPad Air (M1)',
      price: 599.99,
      category: 'Electronics',
      description: 'Powerful 10.9-inch tablet featuring the Apple M1 chip, Liquid Retina display, and support for Apple Pencil 2.',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400',
      stock: 20
    },
    {
      name: 'Logitech MX Master 3S',
      price: 99.99,
      category: 'Accessories',
      description: 'Ergonomic wireless performance office mouse with 8K DPI sensor, quiet clicks, and MagSpeed electromagnetic scroll.',
      image: 'https://images.unsplash.com/photo-1625842268584-8f329044703b?auto=format&fit=crop&q=80&w=400',
      stock: 50
    },
    {
      name: 'Anker 511 Charger Nano 3',
      price: 22.99,
      category: 'Accessories',
      description: 'Ultra-compact 30W USB-C GaN fast charger, perfect for smartphones, tablets, and lightweight laptops.',
      image: 'https://images.unsplash.com/photo-1619489646924-b4fce76b7556?auto=format&fit=crop&q=80&w=400',
      stock: 100
    },
    {
      name: 'Elgato Stream Deck MK.2',
      price: 149.99,
      category: 'Gaming',
      description: 'Studio controller featuring 15 customizable LCD keys to trigger actions, launch apps, and control audio.',
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400',
      stock: 18
    },
    {
      name: 'Bose QuietComfort Earbuds II',
      price: 299.99,
      category: 'Audio',
      description: 'Next-gen true wireless earbuds offering personalized active noise cancellation and rich, immersive sound.',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400',
      stock: 40
    },
    {
      name: 'ASUS ROG Ally Handheld',
      price: 699.99,
      category: 'Gaming',
      description: 'Powerful Windows 11 gaming handheld powered by AMD Ryzen Z1 Extreme processor and a gorgeous 120Hz 1080p display.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
      stock: 10
    },
    {
      name: 'Samsung T7 Shield 2TB SSD',
      price: 159.99,
      category: 'Electronics',
      description: 'Rugged external solid state drive with IP65 water and dust resistance, offering read/write speeds up to 1050 MB/s.',
      image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&q=80&w=400',
      stock: 60
    }
  ];

  const insertStmt = db.prepare(`
    INSERT INTO products (name, price, category, description, image, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Run in a single transaction for efficiency and safety
  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insertStmt.run(
        product.name,
        product.price,
        product.category,
        product.description,
        product.image,
        product.stock
      );
    }
  });

  insertMany(mockProducts);
  console.log('Seeded 12 products successfully.');
};

// Initialize DB schema & seed data immediately
initializeDatabase();

module.exports = db;
