// User model goes here

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3
  },
  passwordHashAndSalt: {
    type: String,
    required: true,
    minlength: 3
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
