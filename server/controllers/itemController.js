const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const cloudinary = require('../config/cloudinaryConfig'); // Importera din Cloudinary-konfiguration
const { Readable } = require('stream');
// Setup multer for file uploads
const storage = multer.memoryStorage(); // Använd minneslagring istället för disklagring

const upload = multer({ storage: storage }).single('image');

const createItem = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    let imageUrl = '';
    if (req.file) {
      // Skapa en läsbar ström från bufferten
      const stream = new Readable();
      stream.push(req.file.buffer);
      stream.push(null); // Signalera att strömmen är slut

      // Använd upload_stream istället för upload
      const result = await new Promise((resolve, reject) => {
        stream
          .pipe(cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }));
      });
      
      imageUrl = result.secure_url; // Hämta den säkra URL:en
    }

    // Spara objektet i databasen
    const newItem = new Item({
      title,
      description,
      price,
      image: imageUrl, // Använd imageUrl här
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
  upload,
};