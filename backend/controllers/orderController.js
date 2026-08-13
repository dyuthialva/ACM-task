const db = require('../database');

// POST /api/orders (Protected)
exports.createOrder = (req, res, next) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    // Validate request structure
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Checkout cart cannot be empty.' });
    }

    // Validate request parameters
    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'number') {
        return res.status(400).json({ error: 'Each order item must contain a valid numeric productId.' });
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be a positive integer greater than 0.' });
      }
    }

    // SQLite Transaction logic to prevent overselling / race conditions
    const executeOrderTransaction = db.transaction((uid, orderItems) => {
      let grandTotal = 0;
      const verifiedItems = [];

      // 1. Fetch current stock and verify stock limits on the backend
      for (const item of orderItems) {
        const product = db.prepare('SELECT price, stock, name FROM products WHERE id = ?').get(item.productId);

        if (!product) {
          throw new Error(`Product not found.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        grandTotal += product.price * item.quantity;
        verifiedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        });
      }

      // 2. Create the order record
      const orderInsert = db.prepare(`
        INSERT INTO orders (user_id, total_amount, status)
        VALUES (?, ?, 'Placed')
      `).run(uid, grandTotal);

      const orderId = orderInsert.lastInsertRowid;

      // 3. Create order items records and decrement product stock
      const insertOrderItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `);

      const decrementStock = db.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `);

      for (const item of verifiedItems) {
        // Insert item record
        insertOrderItem.run(orderId, item.productId, item.quantity, item.price);
        // Decrement stock in database
        decrementStock.run(item.quantity, item.productId);
      }

      return orderId;
    });

    // Run order transaction
    const orderId = executeOrderTransaction(userId, items);

    res.status(201).json({
      id: orderId,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    // If anything fails inside the transaction, it rolls back automatically
    console.error('Order creation failed:', error.message);
    res.status(400).json({ error: error.message || 'Failed to place order.' });
  }
};

// GET /api/orders (Protected)
exports.getOrders = (req, res, next) => {
  try {
    const isUserAdmin = req.user.role === 'admin';
    
    // Fetch orders depending on user role
    const ordersQuery = isUserAdmin
      ? db.prepare(`
          SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name, u.email as user_email
          FROM orders o
          JOIN users u ON o.user_id = u.id
          ORDER BY o.created_at DESC
        `).all()
      : db.prepare(`
          SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name, u.email as user_email
          FROM orders o
          JOIN users u ON o.user_id = u.id
          WHERE o.user_id = ?
          ORDER BY o.created_at DESC
        `).all(req.user.id);

    // Fetch matching order items for each order record
    const ordersWithItems = ordersQuery.map(order => {
      const items = db.prepare(`
        SELECT oi.product_id as productId, oi.quantity, oi.price, p.name as productName, p.image as productImage
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).all(order.id);
      
      return {
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        user: {
          name: order.user_name,
          email: order.user_email
        },
        items
      };
    });

    res.status(200).json(ordersWithItems);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id (Protected)
exports.getOrderById = (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

    const order = db.prepare(`
      SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `).get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Role verification (a normal user can only view their own orders, admin can view any)
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only view your own orders.' });
    }

    const items = db.prepare(`
      SELECT oi.product_id as productId, oi.quantity, oi.price, p.name as productName, p.image as productImage
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(orderId);

    res.status(200).json({
      id: order.id,
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
      user: {
        name: order.user_name,
        email: order.user_email
      },
      items
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status (Protected & Admin Only)
exports.updateOrderStatus = (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const allowedStatuses = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID format.' });
    }

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid order status. Allowed options: ${allowedStatuses.join(', ')}` });
    }

    const orderExists = db.prepare('SELECT id FROM orders WHERE id = ?').get(orderId);
    if (!orderExists) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);

    res.status(200).json({
      message: 'Order status updated successfully.',
      status
    });
  } catch (error) {
    next(error);
  }
};
