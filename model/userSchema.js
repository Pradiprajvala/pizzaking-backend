const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('../db/connection');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    confirmPassword: {
      type: String,
      required: true
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  
})


userSchema.pre('save', function(next) {
    //not using fat arrow bcoz 'this' is working inside it
    if(this.isModified('password')){
      bcrypt.hash(this.password, 12, (err,hash) => {
        if(err) return new Error('error in hashing password' ) ;
          this.password = hash;
          this.confirmPassword = hash;
          next();
        })
      }
    });
    
    
  // Generating Token
  
  userSchema.methods.generateAuthToken = async function () {
    try {
     let token = jwt.sign({ _id : this._id}, process.env.SECRET_KEY);//token Generated here
  // saving token                  // token => left side Schema's => Right side ubove lines token
      this.tokens = this.tokens.concat({ token: token });
    //  console.log(this.email);
    //  console.log(this.tokens);
    await this.save();
   

    return token;
    } catch (err){
      
      console.log(err);
    }
  }
    
  
  

const User = mongoose.model('USER', userSchema);

module.exports = User;
