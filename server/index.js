const express =require('express');
const dotenv = require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const cors =require('cors');
const app =express();
const {mongoose} = require('mongoose');
const cookieParser= require('cookie-parser')
const authRoutes = require('./routes/authRoutes'); 
const offerRoutes = require('./routes/offerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const createAdminRoute = require('./routes/createAdmin');
//db connection
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Mongodb connected') )
.catch (()=> console.log('db not connected',err))

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));


  //app.use('/', require('./routes/authRoutes'));
  app.use('/', authRoutes);
  app.use('/api', offerRoutes); 

  //admin routes
  app.use('/api/admin', adminRoutes);
 


  //upload images
  app.use('/uploads', express.static('uploads')); 

// Refresh tokens
let refreshTokens = [];

// Refresh token route
app.post('/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken; 

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    //create new access token
    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } 
    );

    res.json({ accessToken });
  });
});

// Logout route to remove refresh-token
app.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken); 
  res.clearCookie('refreshToken');
  res.sendStatus(204);
});


const port = 8000;

app.listen(port,() => console.log(`Server is running on ${port}`))
