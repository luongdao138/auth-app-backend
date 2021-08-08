const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
// const MongoStore = require('connect-mongo');
const mongodbStore = require('connect-mongo')(session);
const passport = require('./passport');

app.use(
  cors({
    origin: ['http://localhost:3000'],
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

// session store
// const sessionStore = MongoStore.create({
//   mongoUrl: process.env.MONGODB_URI,
//   collectionName: 'sessions',
// });
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: 'session_secret',
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24,
//     },
//     store: sessionStore,
//   })
// );
app.use(
  session({
    name: 'quicklinks.sess',
    store: new mongodbStore({
      mongooseConnection: mongoose.connection,
      touchAfter: 24 * 3600,
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 15 },
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listenning on port ${PORT}`);
});
