const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const LocalSignupStrategy = new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (email, password, done) => {
    try {
      let user = await User.findOne({ email });
      if (user) return done(new Error('Email already exists!'), null);

      const salt = await bcrypt.genSalt(10);
      const hashPw = await bcrypt.hash(password, salt);
      user = new User({
        email,
        password: hashPw,
      });
      user = await user.save();
      let result = { ...user._doc };
      result.isAuthenticated = true;
      return done(null, result);
    } catch (error) {
      return done(error, null);
    }
  }
);

module.exports = LocalSignupStrategy;
