const jwt = require('jsonwebtoken');

// Middleware för att skydda routes
const requireAuth = (req, res, next) => {
  const { token } = req.cookies; // Hämta token från cookies
  console.log('Request cookies in authController.js:', req.cookies); // Logga alla cookies

  if (!token) {
    console.error('No token found in cookies');
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  try {
    console.log('Token från cookies:', token);
    // Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lagra användardata i `req`
    console.log('Decoded JWT:', decoded); // Logga den dekodade JWT
    next(); // Gå vidare till nästa middleware eller route handler
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(403).json({ error: 'Invalid Token' });
  }
};

module.exports = requireAuth;
