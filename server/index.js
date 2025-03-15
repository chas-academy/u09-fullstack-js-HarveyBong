const express =require('express');
const dotenv = require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('RENDER_URL:', process.env.VITE_RENDER_URL);
const cors =require('cors');
const app =express();
const {mongoose} = require('mongoose');
const cookieParser= require('cookie-parser')
const authRoutes = require('./routes/authRoutes'); 
const offerRoutes = require('./routes/offerRoutes');
const adminRoutes = require('./routes/adminRoutes');

//db connection
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Mongodb connected') )
.catch (()=> console.log('db not connected'))

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    origin: [ 'https://antiq.netlify.app', 'http://localhost:5173' ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
app.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      // Hämta refresh-token från databasen
      const storedToken = await RefreshToken.findOne({ userId: payload.userId, token: refreshToken });
      if (!storedToken) return res.sendStatus(403); // Forbidden

      // Skapa en ny access-token
      const accessToken = jwt.sign(
          { userId: payload.userId },
          process.env.JWT_SECRET,
          { expiresIn: '15m' }
      );

      // Sätt den nya access-tokenen i en cookie
      res.cookie("token", accessToken, { httpOnly: true });

      res.json({ accessToken });
  } catch (error) {
      console.log("Refresh token error:", error);
      res.sendStatus(403);
  }
});

// Logout route to remove refresh-token
app.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(204); // No content, already logged out

  // Ta bort refresh-token från databasen
  await RefreshToken.findOneAndDelete({ token: refreshToken });

  res.clearCookie('refreshToken');
  res.clearCookie('token');
  res.sendStatus(204);
});


const port = 8000;

app.listen(port,() => console.log(`Server is running on ${port}`))
