const express = require('express');
const { getItems,createItem, getItemById, upload} = require('../controllers/itemController');
const router = express.Router();
const {test, registerUser,loginUser,logoutUser, getProfile} = require('../controllers/authController')
const cors = require('cors');


const requireAuth = require('../middleware/requireAuth');


// middleware

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

//user routes
router.get('/', test )
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser)
router.get('/profile', requireAuth, getProfile)


//Item posting routes
router.post('/items', requireAuth, upload, createItem); 
router.get('/items', getItems);

//Get item by id
router.get('/items/:id', getItemById); 


module.exports = router;