
console.log('offerRoutes loaded');
const express = require('express');
const { createOffer, getOffersForItem, getOffersForUser } = require('../controllers/offerController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// POST - Skapa en offert
router.post('/offers', requireAuth, createOffer); // Matchar nu `/api/offers` eftersom vi satte prefixet i index.js

// GET - Hämta offerter för ett specifikt objekt
router.get('/offers/:itemId', requireAuth, getOffersForItem); // Matchar `/api/offers/:itemId`

router.get('/offers/user/:userId', requireAuth, getOffersForUser);


module.exports = router;
