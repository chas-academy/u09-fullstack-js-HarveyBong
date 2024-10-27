const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('Access Denied: No Authorization header provided');
      return res.status(403).json({ error: 'Access Denied. No Authorization header provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    
    const user = await User.findOne({ _id: decoded.userId });
    

    if (!user || user.role !== 'Admin') {
      console.log('Access Denied: User is not an admin');
      return res.status(403).json({ error: 'Access Denied. You need admin privileges.' });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.log('Access Denied: Invalid token or not authorized', error.message);
    res.status(403).json({ error: 'Access Denied. Invalid token or not authorized.' });
  }
};

module.exports = requireAdmin;
