const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://loving-banach-b7319b.netlify.app',
    ],
    credentials: true,
  })
);

// connect mongodb database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
db.on('open', () => {
  console.log('connected db successfully!');
});

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listenning on port ${PORT}`);
});
