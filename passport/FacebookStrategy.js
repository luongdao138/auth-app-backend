const Strategy = require('passport-facebook').Strategy;
const { facebook } = require('../config');
const User = require('../models/User');

const FacebookStrategy = new Strategy(
  {
    clientID: facebook.clientID,
    clientSecret: facebook.clientSecret,
    callbackURL: facebook.callbackURL,
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('profile: ', profile);
    try {
      // let user = await User.findOne({ social_id: profile.id });
      // if (user) return done(null, user);
      // user = new User({
      //   social_id: profile.id,
      //   display_name: profile.displayName,
      //   email: profile.emails[0].value,
      //   photo: profile.photos[0].value,
      // });
      // user = await user.save();
      done(null, profile);
    } catch (error) {
      console.log(error);
      done(error, null);
    }
  }
);

module.exports = FacebookStrategy;
