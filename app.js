
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const express = require('express');
const app = express();
dotenv.config({path: './config.env'});
require('./db/connection');
//const User = require('./model/userSchema');
app.use(express.json());
// Linking Router File
app.use(require('./router/auth'));

app.listen(3000, () => {
  console.log(`server is running on 3000`)
})