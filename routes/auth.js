const router = require('express').Router();
const passport = require('../passport');

router.get('/logout', (req, res) => {
  req.logOut();
  return res.json('logout successfully!');
});

router.post('/signup', (req, res) => {
  passport.authenticate('local-signup', (error, user, info) => {
    if (error)
      return res.status(400).json({
        message: error.message || 'Internal server error',
      });

    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      return res.json(user);
    });
  })(req, res);
});

router.post('/login', (req, res) => {
  passport.authenticate('local-login', (error, user, info) => {
    if (error)
      return res.status(400).json({
        message: error.message || 'Internal server error',
      });

    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Internal server error',
        });
      }

      return res.json(user);
    });
  })(req, res);
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/profile',
    failureRedirect: 'http://localhost:3000/login',
  })
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'profile'],
  })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: 'http://localhost:3000/profile',
    failureRedirect: 'http://localhost:3000/login',
  })
);

router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
  })
);
router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: 'http://localhost:3000/profile',
    failureRedirect: 'http://localhost:3000/login',
  })
);

module.exports = router;
