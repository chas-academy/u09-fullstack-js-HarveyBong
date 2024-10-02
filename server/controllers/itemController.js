const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const UserModel = require('../models/user');
const cloudinary = require('../config/cloudinaryConfig'); 
const { Readable } = require('stream');

const storage = multer.memoryStorage(); 

const upload = multer({ storage: storage }).single('image');

const createItem = async (req, res) => {
  try {
    console.log('Recieved request', req.file);
    console.log('User in createItem:', req.user);
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: 'User not authenticated' });
    }
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const user = await UserModel.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    let imageUrl = '';
    if (req.file) {
      
      const stream = new Readable();
      stream.push(req.file.buffer);
      stream.push(null); 

      
      const result = await new Promise((resolve, reject) => {
        stream
          .pipe(cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }));
      });
      
      imageUrl = result.secure_url; 
    }

    // Spara objektet i databasen
    const newItem = new Item({
      title,
      description,
      price,
      image: imageUrl, 
      createdAt: new Date(),
      createdBy: req.user.id,
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
    const items = await Item.find().populate('createdBy', 'name');
    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
};

module.exports = {
  createItem,
  getItems,
  upload,
};