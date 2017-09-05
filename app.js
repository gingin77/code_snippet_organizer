const fs = require('fs')
const path = require('path')
const express = require('express')
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const PassportLocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const flash = require('express-flash-messages')

mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/snippets')

const models = require('./models')
const User = models.User
const Snippet = models.Snippet

const app = express()
app.engine('mustache', mustacheExpress())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'mustache')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))

var authStrategy = new PassportLocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  }, function (email, password, done) {
    User.authenticate (email, password, function (error, user) {
      done(error, user, error ? { message: error.message } : null)
    })
  })

const authSerializer = function (user, done) {
  done (null, user.id)
}

const authDeserializer = function (id, done) {
  User.findById (id, function (error, user) {
    done(error, user)
  })
}

passport.use(authStrategy)
passport.serializeUser(authSerializer)
passport.deserializeUser(authDeserializer)

// ... continue with Express.js app initialization ...
app.use(require('connect-flash')())
app.use(passport.initialize())

app.get('/login', function (req, res, next) {
  let errors = req.flash('error')
  req.flash('success', 'You can add messages by including a second parameter with the function.')
  res.render('login', {
    messages: res.locals.getMessages()
  })
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

const requireLogin = function (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login/')
  }
}

app.get('/secret/', requireLogin, function (req, res) {
  res.render("secret");
})

app.listen(3000, function() {
    console.log('Your app is running http://localhost:3000/.')
})
