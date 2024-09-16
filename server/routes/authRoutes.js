const express = require('express');
const { getItems } = require('../controllers/itemController');
const router = express.Router();
const {test, registerUser,loginUser,logoutUser, getProfile} = require('../controllers/authController')
const cors = require('cors');
const { createItem } = require('../controllers/itemController');
const { upload } = require('../controllers/uploadController'); 


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
router.get('/profile', getProfile)


//Item posting routes
router.post('/items', upload, createItem); 
router.get('/items', getItems);


module.exports = router;