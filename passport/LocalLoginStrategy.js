const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const LocalLoginStrategy = new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (email, password, done) => {
    try {
      let user = await User.findOne({ email });
      if (!user)
        return done(new Error('Email or password does not correct!'), null);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return done(new Error('Email or password does not correct!'), null);

      let result = { ...user._doc };
      result.isAuthenticated = true;
      return done(null, result);
    } catch (error) {
      done(error, null);
    }
  }
);

module.exports = LocalLoginStrategy;
