const mongoose = require('mongoose')

const {Schema} = mongoose

const userSchema = new Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },  
    
    role: {
    type: String,
    enum: ['Expert', 'Customer'],
    default:'Customer',
    required: true,
    
          },
  followedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] 
  });

const UserModel= mongoose.model('User', userSchema);


module.exports = UserModel;