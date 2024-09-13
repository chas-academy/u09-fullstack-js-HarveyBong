const express =require('express');
const dotenv = require('dotenv').config();
const cors =require('cors');
const app =express();
const {mongoose} = require('mongoose');
const cookieParser= require('cookie-parser')

//db connection
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('db connected') )
.catch (()=> console.log('db not connected', err))

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));


app.use('/', require('./routes/authRoutes'));


const port = 8000;

app.listen(port,() => console.log(`Server is running on ${port}`))
