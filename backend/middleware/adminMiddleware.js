module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Access restricted to administrator accounts only.' });
  }
  next();
};
