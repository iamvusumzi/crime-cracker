const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const crimeSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  phone: {
    type: String,
    required: [true, 'Please tell us your number']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  location: {
    type: String,
    required: [true, "Please provide your current location"]
  },
  description: {
    type: String,
    required: [true, "Please provide a short description of the crime"]
  },
});
  
const Crime = mongoose.model('Crime', crimeSchema);
module.exports = Crime;