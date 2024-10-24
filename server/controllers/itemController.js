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
    console.log('Request body:', req.body); // Logga hela request body
    console.log('Request file:', req.file); // Logga filen om den finns

    if (!req.user || !req.user.userId) {
      console.error('User not authenticated in createItem');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      console.error('Missing fields in request body');
      return res.status(400).json({ error: 'All fields are required.' });
    }

    
    if (!req.file) {
      console.error('Image file is missing in request');
      return res.status(400).json({ error: 'Image file is required.' });
    }

    // Logik för att ladda upp till Cloudinary
    let imageUrl = '';
    if (req.file) {
      try {
        const stream = new Readable();
        stream.push(req.file.buffer);
        stream.push(null);

        const result = await new Promise((resolve, reject) => {
          stream.pipe(cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              return reject(error);
            }
            resolve(result);
          }));
        });

        imageUrl = result.secure_url;
        console.log('Image uploaded to Cloudinary:', imageUrl); // Logga den uppladdade bildens URL
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return res.status(500).json({ error: 'Failed to upload image.' });
      }
    }

    // Spara objektet i databasen
    const newItem = new Item({
      title,
      description,
      price,
      image: imageUrl,
      createdAt: new Date(),
      createdBy: req.user.userId,
    });

    await newItem.save();
    console.log('New item saved successfully:', newItem); // Logga det sparade objektet
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

const getItemById = async (req, res) => {
  const itemId = req.params.id; 
  console.log(`Fetching item with ID: ${itemId}`); 

  try {
    const item = await Item.findById(itemId).populate('createdBy', 'name'); 
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item); 
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).json({ message: 'Error retrieving item' });
  }
};




module.exports = {
  createItem,
  getItems,
  getItemById,
  upload,
 
  
};