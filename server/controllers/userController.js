const User = require('../models/user'); 
const Item = require('../models/Item');

// Function to follow an item
const followItem = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the request
    const itemId = req.params.itemId; // Get the item ID from the request parameters
    console.log('In followItem function, itemId:', itemId); 

    const user = await User.findById(userId); // Find the user by ID
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the item is already followed
    if (!user.followedItems.includes(itemId)) {
      user.followedItems.push(itemId); // Add itemId to followedItems array
      await user.save(); 
      return res.status(200).json({ message: 'Item followed successfully' });
    }

    res.status(400).json({ message: 'Item already followed' });
  } catch (err) {
    console.error('Error in followItem:', err); 
    res.status(500).json({ error: 'Failed to follow item' });
  }
};

// Function to get followed items
const getFollowedItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('followedItems'); 
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.followedItems); 
  } catch (error) {
    console.error('Error in getFollowedItems:', error); 
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { followItem, getFollowedItems };
