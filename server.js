const express = require('express');
const app = express();
const fetch = require('node-fetch');
const shortid = require('shortid');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
  next();
});

passport.use(new GitHubStrategy({
    clientID: '6bcaff828e7c309ffd2d',
    clientSecret: '84236d72696f19991d28f42a87e8957882649bfe',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log({ profile, accessToken, refreshToken });
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb({ profile, accessToken, refreshToken });
    // });
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('redirected');
    res.redirect('http://localhost:9000/#/login');
});



app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.listen(3000, () => {
    console.log('server started at PORT', 3000);
});
