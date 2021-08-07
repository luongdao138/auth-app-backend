const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      return done('User not found', null);
    }
  } catch (error) {
    return done('Internal server error', null);
  }
});

const LocalSignupStrategy = require('./LocalSignupStrategy');
const LocalLoginStrategy = require('./LocalLoginStrategy');
const GoogleStrategy = require('./GoogleStrategy');
const FacebookStrategy = require('./FacebookStrategy');
const GithubStrategy = require('./GithubStrategy');

passport.use('local-login', LocalLoginStrategy);
passport.use('local-signup', LocalSignupStrategy);
passport.use(GoogleStrategy);
passport.use(FacebookStrategy);
passport.use(GithubStrategy);

module.exports = passport;
