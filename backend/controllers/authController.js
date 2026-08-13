const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

// Email regex helper
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// POST /api/auth/register
exports.register = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation checks
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required.' });
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ error: 'Email is required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address format.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check email uniqueness
    const emailExists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (emailExists) {
      return res.status(409).json({ error: 'Email is already registered. Please login instead.' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user (default role is 'user')
    db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, 'user')
    `).run(name, email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully. Please log in.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Sign JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'nicemart_secret_key',
      { expiresIn: '24h' }
    );

    // Return token and user info (excluding password hash)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me (Protected Profile)
exports.getMe = (req, res, next) => {
  try {
    // req.user contains decoded token info attached by authMiddleware
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
