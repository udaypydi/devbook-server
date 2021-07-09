const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GitHubStrategy = require('passport-github').Strategy;
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const githubOptions = {
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackUrl,
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const githubVerify = (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile);
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

const githubStrategy = new GitHubStrategy(githubOptions, githubVerify);

module.exports = {
  jwtStrategy,
  githubStrategy,
};
