const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require('jsonwebtoken')

const RefreshToken = require('../models/RefreshToken')
const test = (req, res) => {
  res.json("test is working :P");
};

// register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Role received from frontend:', role);
    //Check if name was entered
    if (!name) {
      return res.json({
        error: "name is required",
      });
    }
    //Check if password was entered
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    //check Email
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken already",
      });
    }

    const hashedPassword = await hashPassword(password);
    //create user in db
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    //check if password match
    const match = await comparePassword(password, user.password);
    if (match) {
      // Generera access token
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '15m' },
      
      );

      // Genererate refresh token
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } 
      );

      // save refresh-token in database
      const newRefreshToken = new RefreshToken({ userId: user._id, token: refreshToken });
      await newRefreshToken.save();

      // send both access-token och refresh-token to client
      res
        .cookie('token', accessToken, { httpOnly: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .json(user);
    } else {
      res.json({
        error: "Wrong password, try again!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};


const getProfile = (req,res)=> {
const {token} = req.cookies

if(token){
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, user)=> {
    if(err) throw err;
    res.json(user);
  } )
} else{ res.json(null)}
}

const logoutUser = (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        
        return res.status(401).json({
          error: 'Invalid token',
        });
      }
      
      
      res.cookie('token', '', { maxAge: 0 }).json({
        message: 'Successfully logged out',
      });
    });
  } else {
    
    res.status(400).json({
      error: 'No token found',
    });
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
};
