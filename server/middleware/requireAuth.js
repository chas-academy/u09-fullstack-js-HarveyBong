const jwt = require('jsonwebtoken');

// Middleware för att skydda routes
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.error('No token found in cookies:', req.cookies);
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  try {
    // Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next(); 
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.warn("Token expired, attempting refresh...");
      return res.status(401).json({ error: "TokenExpired" }); // Signalera att vi behöver en ny token
    }

    console.error('Token verification error:', err.message);
    return res.status(403).json({ error: 'Invalid Token' });
  }
};

module.exports = requireAuth;
