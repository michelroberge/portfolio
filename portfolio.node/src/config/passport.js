// portfolio.node/src/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;

// Serialize and deserialize user (for session support, if needed)
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Helper: Register or fetch a consumer user
async function findOrCreateUser(providerId, email) {
  const User = require("../models/User");
  const authService = require("../services/authService");
  let user = await User.findOne({ username: email });
  if (!user) {
    // Use a dummy password based on providerId (in production, you might store provider data separately)
    user = await authService.registerUser({ username: email, password: "oauth_" + providerId, isAdmin: false });
  }
  return user;
}

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/oauth2/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0].value;
        if (!email) throw new Error("No email returned from Google");
        const user = await findOrCreateUser(profile.id, email);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/auth/oauth2/facebook/callback",
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0].value;
        if (!email) throw new Error("No email returned from Facebook");
        const user = await findOrCreateUser(profile.id, email);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/oauth2/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email =
          profile.emails && profile.emails[0].value
            ? profile.emails[0].value
            : profile.username + "@github.com";
        const user = await findOrCreateUser(profile.id, email);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Microsoft Strategy
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: "/api/auth/oauth2/microsoft/callback",
      scope: ["user.read"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0].value;
        if (!email) throw new Error("No email returned from Microsoft");
        const user = await findOrCreateUser(profile.id, email);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
