const express = require('express');
const { getItems,createItem, getItemById, upload} = require('../controllers/itemController');
const router = express.Router();
const {test, registerUser,loginUser,logoutUser, getProfile} = require('../controllers/authController')
const cors = require('cors');
//const { refreshTokens } = require('../tokenStore');
const jwt = require ('jsonwebtoken')
const requireAuth = require('../middleware/requireAuth');




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


// Refresh token route
router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(401); // Unauthorized

    try {
        // verify refresh token
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // get the saved refresh-token from database
        const storedToken = await RefreshToken.findOne({ userId: payload.userId, token: refreshToken });
        if (!storedToken) return res.sendStatus(403); // Forbidden

        // generate new access token
        const accessToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Access token giltig i 15 minuter
        );

        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.sendStatus(403); // Forbidden
    }
});

module.exports = router;