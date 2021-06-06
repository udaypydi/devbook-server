const express = require('express');
const app = express();
const fetch = require('node-fetch');
const shortid = require('shortid');

// passport.use(new GitHubStrategy({
//     clientID: '6bcaff828e7c309ffd2d',
//     clientSecret: '84236d72696f19991d28f42a87e8957882649bfe',
//     callbackURL: "/auth/github/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//       console.log({ profile, accessToken, refreshToken });
//     // User.findOrCreate({ githubId: profile.id }, function (err, user) {
//       return cb(err,{ profile, accessToken, refreshToken });
//     // });
//   }
// ));

 const data = {
    clientID: '6bcaff828e7c309ffd2d',
    clientSecret: '84236d72696f19991d28f42a87e8957882649bfe',
    callbackURL: "/auth/github/callback",
    scopes: 'repo'
  };

app.get('/auth/github', (req, res) => {
  fetch(`
  https://github.com/login/oauth/authorize?client_id=${data.clientID}&redirect_uri=${data.callbackURL}&scopes=${data.scopes}
  &state=${shortid.generate()}
  `)
    .then(res => {
      console.log(res);
    })
});

// app.get('/auth/github/callback', 
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
// });



app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.listen(3000, () => {
    console.log('server started at PORT', 3000);
});
