const User = require('../models/user'); 
const Item = require('../models/Item');

// Function to follow an item
const followItem = async (req, res) => {
  try {
     
    const userId = req.user.userId; 
    const itemId = req.params.itemId;
    console.log('In followItem function, userId:', userId);
    console.log('In followItem function, itemId:', itemId);

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in request' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.followedItems.includes(itemId)) {
      user.followedItems.push(itemId);
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
    
    const userId = req.user.userId; // Hämta `userId` från `req.user`

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in request' });
    }

    const user = await User.findById(userId).populate('followedItems'); 
    if (!user) {
      console.error('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.followedItems);
  } catch (error) {
    console.error('Error in getFollowedItems:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { followItem, getFollowedItems };
