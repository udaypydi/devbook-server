
const GitHubStrategy = require('passport-github').Strategy;

function initializePassport(passport) {
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
}

module.exports = initializePassport;

