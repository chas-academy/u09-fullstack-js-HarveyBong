const jwt = require('jsonwebtoken');

// Middleware för att skydda routes
const requireAuth = (req, res, next) => {
  const { token } = req.cookies; // Hämta token från cookies
  console.log('Request headers:', req.headers.cookie);
  console.log('User in requireAuth:', req.user);
  console.log('coockiies in requireAuth:', req.cookies);
  if (!token) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }
  try {
    // Verifiera token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded JWT:",decoded)
    req.user = decoded; // Lagra användardata i `req`
    console.log('User after decoding in requireAuth:', req.user); // Ny logg för att se resultatet
    next(); // Gå vidare till nästa middleware eller route handler
  } catch (err) {
    return res.status(403).json({ error: 'Invalid Token' });
  }
};

module.exports = requireAuth;
