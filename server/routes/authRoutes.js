const express = require('express');

const router = express.Router();
const {test, registerUser,loginUser,logoutUser, getProfile} = require('../controllers/authController')
const cors = require('cors');


// middleware

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)


router.get('/', test )
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser)
router.get('/profile', getProfile)

module.exports = router;