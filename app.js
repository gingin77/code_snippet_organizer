const fs = require('fs')
const path = require('path')
const express = require('express')
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const passport = require('passport')
const PassportLocalStrategy = require('passport-local')
const mongoose = require('mongoose')
const flash = require('express-flash-messages')
const models = require("./models/users")
const User = models.User
const duplicateError = 11000
// const duplicateError
// E11000

mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/snippets')

const Snippet = require('./models/snippets')

const app = express()
app.engine('mustache', mustacheExpress())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'mustache')

app.use('/static', express.static('static'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
})
// Taken from the express documentation: http://expressjs.com/en/guide/error-handling.html

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
  secret: 'keyboard pitbull',
  resave: false,
  saveUninitialized: false
}))

passport.use(authStrategy)
passport.serializeUser(authSerializer)
passport.deserializeUser(authDeserializer)

app.use(require('connect-flash')())
app.use(passport.initialize())

app.get('/login', function (req, res, next) {
  let errors = req.flash('error')
  req.flash('success', 'You can add messages by including a second parameter with the function.')
  res.render('login'
  )
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register/', function (req, res) {
  res.render('register')
})

app.post('/register/', function (req, res) {
  req.checkBody('email', 'Email must be an email address').isEmail()
  req.checkBody('email', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()

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

app.get('/language/:language', function (req, res) {
  Snippet.find({language: req.params.language})
  .then(function (snippet) {
    res.render('find_by_list_template', {
      language: req.params.language,
      snippet: snippet})
  })
})

app.post('/language/:language', function (req, res) {
  // let selectedLanguage = req.body.language
  Snippet.find({language: req.body.language})
  .then(function (snippet) {
    res.redirect(`/language/${req.body.language}`)
  })
})

app.get('/new_snippet/', function (req, res){
  res.render('new_snippet')
})

app.post('/new_snippet/', function (req, res){
  var snippet = new Snippet()

  snippet.title = req.body.title
  snippet.language = req.body.language
  snippet.body = req.body.body
  snippet.notes = req.body.notes
  snippet.tags = req.body.tags.replace(/\s/g, '').split(",")
  snippet.user = req.body.user

  console.log(snippet)

  snippet.save(function(err){
    res.redirect('/')
  })
})

app.get('/:id', function (req, res) {
  // console.log(req.params.id)
  Snippet.findOne({_id: req.params.id})
  .then(function (snippet) {
    res.render('single_snippet', {snippet: snippet})
  })
})
// FUntion below is taken from the mongoose docs
// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
// })
//
app.get('/:id/edit', function (req, res) {
  Snippet.findOne({_id: req.params.id})
    .then(function (snippet) {
      console.log(snippet)
      res.render('edit_snippet', {snippet: snippet})
    })
})

app.post('/:id/edit', function (req, res) {
  const snippet = req.body
    snippet.title = req.body.title
    snippet.language = req.body.language
    snippet.body = req.body.body
    snippet.notes = req.body.notes
    snippet.tags = req.body.tags.replace(/\s/g, '').split(",")
    snippet.user = req.body.user

  Snippet.updateOne({_id: req.params.id}, snippet, {})
  .then(function () {
    res.redirect(`/${req.params.id}`)
  })
})

app.post('/:id/delete', function (req, res) {
  Snippet.findOneAndRemove({_id: req.params.id}).then(function (snippet) {
    res.redirect('/')
  })
})

app.get('/', function (req, res) {
  Snippet.find()
  .then(function (snippet) {
    res.render('home', {snippet: snippet})
  })
})

app.listen(3000, function () {
  console.log('Your app is running http://localhost:3000/.')
})
