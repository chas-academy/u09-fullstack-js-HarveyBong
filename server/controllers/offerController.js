
const User = require('../models/user');
const Item = require('../models/Item');
const Offer = require('../models/Offer');

const createOffer = async (req, res) => {
    console.log('Reached createOffer endpoint'); // För att bekräfta att anropet når hit
    console.log('Request body:', req.body); // För att kontrollera innehållet i förfrågan
   
    try {
      const { itemId, message, amount } = req.body;
      console.log('Request body:', req.body);
      const userId = req.user.userId;
  
      // Kontrollera om användaren har rollen 'Expert'
      const user = await User.findById(userId);
      if (user.role !== 'Expert') {
        return res.status(403).json({ error: 'Endast användare med rollen Expert kan skicka offerter.' });
      }
  
      // Skapa en ny offert
      const newOffer = new Offer({
        item: itemId,
        user: userId,
        message,
        amount,
      });
  
      await newOffer.save();
      res.status(201).json({ message: 'Offerten har skapats.' });
    } catch (error) {
      console.error('Error creating offer:', error);
      res.status(500).json({ error: 'Ett fel uppstod vid skapandet av offerten.' });
    }
  };

  const getOffersForItem = async (req, res) => {
    try {
      const { itemId } = req.params; // Hämtar itemId från request-parametrarna
      const offers = await Offer.find({ item: itemId }).populate('user', 'name'); // Populerar `user`-fältet för att inkludera användarnamnet
  
      res.status(200).json(offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      res.status(500).json({ error: 'Misslyckades med att hämta offerter.' });
    }
  };

  const getOffersForUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Hämta annonser som skapats av användaren och hitta offerter kopplade till dessa annonser
      const items = await Item.find({ createdBy: userId }); // Hitta alla annonser skapade av användaren
      const itemIds = items.map(item => item._id); // Samla alla itemId:n
  
      const offers = await Offer.find({ item: { $in: itemIds } })
        .populate('user', 'name')
        .populate('item', 'title image description price createdAt'); 
      res.status(200).json(offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      res.status(500).json({ error: 'Misslyckades med att hämta offerter.' });
    }
  };
  
  
  
  
  
module.exports = { createOffer, getOffersForItem, getOffersForUser };
