
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  }
});

const upload = multer({ storage: storage }).single('image');

const createItem = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const image = req.file ? req.file.path : '';

    if (!title || !description || !price) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Save the item in the database (assuming you have a model for Item)
    const newItem = new Item({
      title,
      description,
      price,
      image,
      createdAt: new Date(),
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error publishing item:', error);
    res.status(500).json({ error: 'Failed to publish item.' });
  }
};
const getItems = async (req, res) => {
  try {
    const items = await Item.find(); 
    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
};
module.exports = {
  createItem,
  getItems,
};
