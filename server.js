const express = require('express');
const app = express();
const fetch = require('node-fetch');
const shortid = require('shortid');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const authenticated = require('./authenticated');
const passport = require('passport');
// const initializePassport = require('./passport-config');
const GitHubStrategy = require('passport-github').Strategy;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  next();
});


app.use(session({ 
  secret: 'devchat-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   done(null, id);
});

passport.use(new GitHubStrategy({
    clientID: '6bcaff828e7c309ffd2d',
    clientSecret: '84236d72696f19991d28f42a87e8957882649bfe',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log({ profile, accessToken, refreshToken });        
    cb(null, profile);
  }
));  

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/get-user-data', (req, res) => {
  if (req.user) {
    res.json({ isLoggedIn: true })
  } else {
    res.json({ isLoggedIn: false })
  }
  
});



app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.listen(3000, () => {
    console.log('server started at PORT', 3000);
});
