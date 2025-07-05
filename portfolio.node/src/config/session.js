// middleware/session.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (mongooseConnection) => {
    console.log('Initiating Sessions through MongoDB');
  return session({
    secret: process.env.SESSION_SECRET || 'default-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongooseConnection.getClient(), // native MongoDB client from Mongoose
      dbName: process.env.MONGO_DB_NAME || 'sessiondb',
      collectionName: 'sessions',
      ttl: 60 * 60 * 24, // 1 day in seconds
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true if behind HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    },
  });
};
