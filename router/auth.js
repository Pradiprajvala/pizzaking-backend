const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('../db/connection');
const User = require("../model/userSchema");
/* USING PROMISE
router.post('/register', (req,res) => {
  //res.json({message: req.body});
  //console.log(req.body);
  //console.log(req.body.name);
  const { name, email , phone , password, confirmPassword} = req.body;
  //console.log(name);
  if( !name || !email || !phone  || ! password || !confirmPassword ){
       return res.status(422).json({error: " fill properly"})
  }
  // left side database's email = right side Users email
  User.findOne({email: email})
  .then((userExist) => {
    if(userExist){
      return res.status(422).json({error:"Email Already Exists"});
    }
    
    const user = new User({ name, email , phone , password, confirmPassword});
    user.save().then(() => {
      res.status(201).json({message: "User Created"});
  }).catch((err) => {
    console.log(err)
  res.status(500).json({error: "Failed to register"})
  });
  
  
}).catch((err) => { console.log(err); });
});
module.exports = router;
*/

//USING async
router.post('/register', async (req,res) => {
  //res.json({message: req.body});
  //console.log(req.body);
  //console.log(req.body.name);
  let token;
  const { name, email , phone , password, confirmPassword} = req.body;
  //console.log(name);
  if( !name || !email || !phone  || ! password || !confirmPassword ){
       return res.status(422).json({error: " fill properly"});
  }
  
  try{ 
    const userExist = await User.findOne({email: email});
    
    if(userExist){
      return res.status(422).json({error:"Email Already Exists"});
    }
    const user = new User({ name, email , phone , password, confirmPassword});
  // hashing password using pre save method
    
    
  
     
    await  user.save();
    
    
    res.status(201).json({message: "User Created"});
    
  } catch(err) {
    console.log(err);
  }
  
});

router.post('/login', async(req,res) => {
  try{
    let token;
  const { email , password  } = req.body;
  
  
  if (!email || !password) {
    return res.status(400).json({error:"Enter Properly"});
  }
  
  const userLogin = await User.findOne({email: email});
  //if email exist then its collection will be stored ad userLogin
  
  if(userLogin){
  const isMatch = await bcrypt.compare(password, userLogin.password);
  const token = await userLogin.generateAuthToken();
  
  
  
    if(isMatch) {
  res.json({message: "Login Success"});
 
    } else {
     console.log(`wrong password`)
    res.json({error: "Password or Email is wrong"});
  }
  } else {
    console.log(`wrong email`)
    res.json({error:"Password or Email is wrong"});
  }
  }catch(err){
    console.log(err);
  }
  
});

module.exports = router;
