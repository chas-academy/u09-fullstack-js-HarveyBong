const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Item = require('../models/Item');
const Offer = require('../models/Offer');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');


router.use(requireAuth);
router.use(requireAdmin);

// ---------------------- User Management ----------------------

// GET - Hämta alla användare
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// DELETE - Ta bort en användare
router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// ---------------------- Item Management ----------------------

// GET - Hämta alla annonser
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().populate('createdBy', 'name');
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

// DELETE - Ta bort en annons
router.delete('/items/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});



module.exports = router;
