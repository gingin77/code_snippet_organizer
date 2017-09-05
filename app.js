const fs = require('fs')
const path = require('path')
const express = require('express')
const mustacheExpress = require('mustache-express')
const session = require('express-sessions')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const passport = require('passport')
const PassportLocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const flash = require('express-flash-messages')
const models = require("./models/users")
const User = models.User

mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/snippets')

// const models = require('./models')
// const User = mongoose.model('user')
const Snippet = require('./models/snippets')

const app = express()
app.engine('mustache', mustacheExpress())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'mustache')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

let authStrategy = new PassportLocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
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

app.use(session({
  resave: false,
  secret: 'keyboard pitbull',
  saveUninitialized: false,
  store: new (require('express-sessions'))({
    storage: 'mongodb',
    instance: mongoose, // optional
    host: 'localhost', // optional
    port: 27017, // optional
    db: 'test' // optional
    // collection: 'sessions', // optional
    // expire: 86400 // optional
  })
}))

passport.use(authStrategy)
passport.serializeUser(authSerializer)
passport.deserializeUser(authDeserializer)

// ... continue with Express.js app initialization ...
app.use(require('connect-flash')())
app.use(passport.initialize())

app.get('/login', function (req, res, next) {
  let errors = req.flash('error')
  req.flash('success', 'You can add messages by including a second parameter with the function.')
  res.render('login'
  // , {
  //   messages: res.locals.getMessages()
  // }
  )
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register/', function (req, res) {
  res.render('register')
})

app.post('/register/', function(req, res) {
    req.checkBody('email', 'Email must be an email address').isEmail()
    req.checkBody('email', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

  req.getValidationResult()
        .then(function (result) {
          if (!result.isEmpty()) {
            return res.render ('register', {
              username: req.body.email,
              errors: result.mapped()
            })
          }
          const user = new User({
            user_id: req.body.user_id,
            email: req.body.email,
            password: req.body.password
          })

          const error = user.validateSync()
          if (error) {
            return res.render('register', {
              errors: normalizeMongooseErrors(error.errors)
                })
            }

          user.save(function (err) {
            if (err) {
              return res.render ('register', {
                messages: {
                  error: ['That email is already in use.']
                }
              })
            }
            return res.redirect('/')
          })
        })
})

function normalizeMongooseErrors (errors) {
  Object.keys(errors).forEach(function (key) {
    errors[key].message = errors[key].msg
    errors[key].param = errors[key].path
  })
}

app.get('/home', function(req, res) {
    res.render('home');
})

app.listen(3000, function() {
    console.log('Your app is running http://localhost:3000/.')
})
