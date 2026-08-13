const db = require('../database');

// Helper to validate product fields
const validateProductInputs = (name, price, category, stock) => {
  const errors = [];

  if (typeof name !== 'string' || name.trim() === '') {
    errors.push('Product name is required and must be a non-empty string.');
  }

  if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a number greater than or equal to 0.');
  }

  if (category === undefined || category === null || typeof category !== 'string' || category.trim() === '') {
    errors.push('Category is required and must be a non-empty string.');
  }

  if (stock === undefined || stock === null || !Number.isInteger(stock) || stock < 0) {
    errors.push('Stock is required and must be a non-negative integer.');
  }

  return errors;
};

// Helper to validate ID parameter
const validateId = (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0 || String(parsedId) !== String(id)) {
    return null;
  }
  return parsedId;
};

// GET /api/products
exports.getProducts = (req, res, next) => {
  try {
    const { search, category, sort } = req.query;

    let query = 'SELECT * FROM products';
    const conditions = [];
    const params = [];

    // 1. Search filter (in name or description)
    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // 2. Category filter
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    // Combine conditions into WHERE clause
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // 3. Sorting (whitelisted to prevent SQL injection)
    const allowedSorts = {
      price_asc: 'ORDER BY price ASC',
      price_desc: 'ORDER BY price DESC',
      name_asc: 'ORDER BY name ASC',
      name_desc: 'ORDER BY name DESC'
    };

    if (sort && allowedSorts[sort]) {
      query += ` ${allowedSorts[sort]}`;
    } else {
      query += ' ORDER BY id DESC'; // Default sorting
    }

    const products = db.prepare(query).all(...params);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
exports.getProductById = (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a positive integer.' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// POST /api/products
exports.createProduct = (req, res, next) => {
  try {
    const { name, price, category, description, image, stock } = req.body;

    const validationErrors = validateProductInputs(name, price, category, stock);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const insertStmt = db.prepare(`
      INSERT INTO products (name, price, category, description, image, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      name,
      price,
      category,
      description || null,
      image || null,
      stock
    );

    // Fetch the newly created product
    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
exports.updateProduct = (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a positive integer.' });
    }

    const { name, price, category, description, image, stock } = req.body;

    const validationErrors = validateProductInputs(name, price, category, stock);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Check if the product exists
    const productExists = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!productExists) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const updateStmt = db.prepare(`
      UPDATE products
      SET name = ?, price = ?, category = ?, description = ?, image = ?, stock = ?
      WHERE id = ?
    `);

    updateStmt.run(
      name,
      price,
      category,
      description || null,
      image || null,
      stock,
      id
    );

    // Fetch the updated product
    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
exports.deleteProduct = (req, res, next) => {
  try {
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Invalid product ID. Must be a positive integer.' });
    }

    // Check if the product exists
    const productExists = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!productExists) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
