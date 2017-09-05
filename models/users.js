const mongoose = require('mongoose')
const Hash = require('password-hash')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    set: function (newValue) {
      return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue)
    }
  }
// ... add any other properties you want to save with users ...
})

userSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({ email: email
  }, function (error, user) {
    if (user && Hash.verify(password, user.password)) {
      callback(null, user)
    } else if (user || !error) {
      // Email or password was invalid (no MongoDB error)
      error = new Error('Your email address or password is invalid. Please try again.')
      callback(error, null)
    } else {
      // Something bad happened with MongoDB. You shouldn't run into this often.
      callback(error, null)
    }
  })
}

const User = mongoose.model('User', userSchema)

module.exports = {
  User: User
}

// import mongoose from 'mongoose';
// import user from './schemas/user';
//
// export const User = mongoose.models.User || mongoose.model('User', user);
