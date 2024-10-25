const express = require('express');
const { getItems,createItem, getItemById, upload,getMyAds,deleteItem } = require('../controllers/itemController');
const router = express.Router();
const {test, registerUser,loginUser,logoutUser, getProfile, updateUserProfile} = require('../controllers/authController')

const { followItem, getFollowedItems,unfollowItem } = require('../controllers/userController')

const jwt = require ('jsonwebtoken')
const requireAuth = require('../middleware/requireAuth');

let refreshTokens = [];




//user routes
router.get('/', test )
router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/logout', (req, res) => {
  

  const refreshToken = req.cookies.refreshToken;

 
  res.clearCookie('refreshToken');
  res.clearCookie('token');

  if (!refreshToken) {
    return res.status(204).json({ message: 'Logged out successfully, no refresh token provided' });
  }

  // Logik för att ta bort refresh-token om den finns
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  
  return res.status(204).json({ message: 'Logged out successfully' });
});


router.put('/update-profile', requireAuth, updateUserProfile);


router.get('/profile', requireAuth, getProfile)


//Item posting routes
router.post('/items', requireAuth, upload, createItem); 
router.get('/items', getItems);

//Get item by id
router.get('/items/:id', getItemById); 

// Routes för att följa & avfölja en annons
router.post('/follow/:itemId', requireAuth, (req, res, next) => {
    console.log(`Route /follow/${req.params.itemId} reached`);
    next();
  }, followItem);
router.get('/followed', requireAuth, getFollowedItems); 

router.post('/unfollow/:itemId', requireAuth, unfollowItem);


// User Ads....
router.get('/my-ads', requireAuth, getMyAds);
router.delete('/items/:itemId', requireAuth, deleteItem);





// Refresh token route
router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(401); // Unauthorized

    try {
        // verify refresh token
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // get the saved refresh-token from database
        const storedToken = await RefreshToken.findOne({ userId: payload.userId, token: refreshToken });
        if (!storedToken) return res.sendStatus(403); 

        // generate new access token
        const accessToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Access token giltig i 15 minuter
        );

        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.sendStatus(403); 
    }
});

module.exports = router;