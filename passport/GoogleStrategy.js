const Strategy = require('passport-google-oauth20').Strategy;
const { google } = require('../config');
const User = require('../models/User');

const GoogleStrategy = new Strategy(
  {
    clientID: google.clientID,
    clientSecret: google.clientSecret,
    callbackURL: google.callbackURL,
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('profile: ', profile);
    try {
      let user = await User.findOne({ social_id: profile.id });
      if (user) return done(null, user);
      user = new User({
        social_id: profile.id,
        display_name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
      });
      user = await user.save();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);

module.exports = GoogleStrategy;
