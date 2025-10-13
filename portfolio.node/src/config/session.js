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
      secure: true, // Always true for HTTPS
      httpOnly: true,
      sameSite: 'none', // Required for cross-domain
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    },
  });
};
