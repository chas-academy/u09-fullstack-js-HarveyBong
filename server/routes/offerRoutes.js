
const express = require('express');
const { createOffer, getOffersForItem, getOffersForUser } = require('../controllers/offerController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// POST 
router.post('/offers', requireAuth, createOffer);

// GET 
router.get('/offers/:itemId', requireAuth, getOffersForItem);

router.get('/offers/user/:userId', requireAuth, getOffersForUser);


module.exports = router;
