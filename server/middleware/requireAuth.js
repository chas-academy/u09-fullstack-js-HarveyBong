const jwt = require('jsonwebtoken');

// Middleware för att skydda routes
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Hämta token från cookies
  
  if (!token) {
    console.error('No token found in cookies:', req.cookies);
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  try {
    // Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded && decoded.userId) {
      console.log('Token verified successfully:', decoded);
      req.user = { userId: decoded.userId }; 
      next(); 
    } else {
      console.error('Invalid decoded token structure:', decoded);
      return res.status(401).json({ error: 'Invalid token structure.' });
    }
  } catch (err) {
    console.error('Token verification error:', err.message); 
    return res.status(403).json({ error: 'Invalid Token' });
  }
};

module.exports = requireAuth;
