const jwt = require('jsonwebtoken');

// Middleware för att skydda routes
const requireAuth = (req, res, next) => {
  const { token } = req.cookies; // Hämta token från cookies

  if (!token) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  try {
    // Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lagra användardata i `req`
    next(); // Gå vidare till nästa middleware eller route handler
  } catch (err) {
    return res.status(403).json({ error: 'Invalid Token' });
  }
};

module.exports = requireAuth;
