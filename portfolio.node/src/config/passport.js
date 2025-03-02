// portfolio.node/src/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const providerConfigService = require("../services/providerConfigService");

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
    // Use a dummy password based on providerId (in production, store provider data separately)
    user = await authService.registerUser({ username: email, password: "oauth_" + providerId, isAdmin: false });
  }
  return user;
}

// Helper function to set up an OAuth strategy for a provider
async function setupOAuthStrategy(providerName, StrategyClass, defaultOptions) {
  const providerConfig = await providerConfigService.getConfigByProvider(providerName);
  const clientID = (providerConfig && providerConfig.clientId) || defaultOptions.clientID;
  const clientSecret = (providerConfig && providerConfig.clientSecret) || defaultOptions.clientSecret;
  const callbackURL = (providerConfig && providerConfig.callbackURL) || defaultOptions.callbackURL;

  const strategyOptions = {
    ...defaultOptions,
    clientID,
    clientSecret,
    callbackURL,
  };

  if (clientID && clientSecret && callbackURL) {
    passport.use(
      new StrategyClass(strategyOptions, async (accessToken, refreshToken, profile, done) => {
        try {
          // For GitHub, use a fallback email if none is provided.
          let email;
          if (providerName === "github") {
            email = profile.emails && profile.emails[0].value ? profile.emails[0].value : profile.username + "@github.com";
          } else {
            email = profile.emails && profile.emails[0].value;
          }
          if (!email) throw new Error(`No email returned from ${providerName}`);
          const user = await findOrCreateUser(profile.id, email);
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      })
    );
    console.log(`Registered strategy for ${providerName}`);
  } else {
    console.warn(`Missing configuration for ${providerName}, strategy not registered.`);
  }
}

// Set up strategies for all providers
async function setupStrategies() {
  await Promise.all([
    setupOAuthStrategy("google", GoogleStrategy, {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/oauth2/google/callback",
      scope: ["profile", "email"],
    }),
    setupOAuthStrategy("facebook", FacebookStrategy, {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || "/api/auth/oauth2/facebook/callback",
      profileFields: ["id", "emails", "name"],
    }),
    setupOAuthStrategy("github", GitHubStrategy, {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || "/api/auth/oauth2/github/callback",
      scope: ["user:email"],
    }),
    setupOAuthStrategy("microsoft", MicrosoftStrategy, {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL || "/api/auth/oauth2/microsoft/callback",
      scope: ["user.read"],
    }),
  ]);
}

module.exports = { passport, setupStrategies };
