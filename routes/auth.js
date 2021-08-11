const router = require('express').Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    // get token from request

    // verify token
    const response = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, sub, picture, name } = response.getPayload();
    let user = await User.findOne({ social_id: sub });
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.CLIENT_SECRET);
      return res.json({ token, user });
    }
    user = new User({
      social_id: sub,
      email,
      display_name: name,
      photo: picture,
    });
    user = await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.CLIENT_SECRET);
    return res.json({ token, user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Google login failed!',
    });
  }
});

module.exports = router;
