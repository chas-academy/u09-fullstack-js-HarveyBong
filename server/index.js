const express =require('express');
const dotenv = require('dotenv').config();
const cors =require('cors');
const app =express();
const {mongoose} = require('mongoose');
const cookieParser= require('cookie-parser')

//db connection
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Mongodb connected') )
.catch (()=> console.log('db not connected',err))

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' 
  }));

app.use('/', require('./routes/authRoutes'));

//upload images
app.use('/uploads', express.static('uploads')); 


const port = 8000;

app.listen(port,() => console.log(`Server is running on ${port}`))
