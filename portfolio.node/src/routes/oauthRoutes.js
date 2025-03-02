// portfolio.node/src/routes/oauthRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const {passport} = require("../config/passport");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

// Helper function to issue a JWT and set it as a cookie.
function issueToken(req, res, returnUrl) {
  const token = jwt.sign(
    { id: req.user.id, username: req.user.username, isAdmin: req.user.isAdmin },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.cookie("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 3600000,
  });
  res.redirect(returnUrl);
}


// Google OAuth2 Routes
router.get("/google", (req, res, next) => {
  const { returnUrl } = req.query;
  // Generate a CSRF token (or use a library) – here we use a simple random string for illustration.
  const csrf = Math.random().toString(36).slice(2);
  // (If you use sessions, store the CSRF token for later verification.)
  const state = Buffer.from(JSON.stringify({ returnUrl, csrf })).toString("base64");
  passport.authenticate("google", { scope: ["profile", "email"], state })(req, res, next);
});


router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false  }), (req, res) => {
  let returnUrl = "/";
  if (req.query.state) {
    try {
      const state = JSON.parse(Buffer.from(req.query.state, "base64").toString("utf8"));
      returnUrl = state.returnUrl || "/"; 
      // Optionally: Compare state.csrf with the stored token.
    } catch (e) {
      console.error("Failed to parse state parameter:", e);
    }
  }
  issueToken(req, res, returnUrl);
});


router.get("/facebook", (req, res, next) => {
  const { returnUrl } = req.query;
  // Generate a CSRF token (or use a library) – here we use a simple random string for illustration.
  const csrf = Math.random().toString(36).slice(2);
  // (If you use sessions, store the CSRF token for later verification.)
  const state = Buffer.from(JSON.stringify({ returnUrl, csrf })).toString("base64");
  passport.authenticate("facebook", { scope: ["public_profile", "email"], state })(req, res, next);
});


router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login", session: false  }), (req, res) => {
  let returnUrl = "/";
  if (req.query.state) {
    try {
      const state = JSON.parse(Buffer.from(req.query.state, "base64").toString("utf8"));
      returnUrl = state.returnUrl || "/"; 

      // Optionally: Compare state.csrf with the stored token.
    } catch (e) {
      console.error("Failed to parse state parameter:", e);
    }
  }
  issueToken(req, res, returnUrl);
});

router.get("/github", (req, res, next) => {
  const { returnUrl } = req.query;
  // Generate a CSRF token (or use a library) – here we use a simple random string for illustration.
  const csrf = Math.random().toString(36).slice(2);
  // (If you use sessions, store the CSRF token for later verification.)
  const state = Buffer.from(JSON.stringify({ returnUrl, csrf })).toString("base64");
  passport.authenticate("github", { scope: ["user:email"], state })(req, res, next);
});


router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login", session: false  }), (req, res) => {
  let returnUrl = "/";
  if (req.query.state) {
    try {
      const state = JSON.parse(Buffer.from(req.query.state, "base64").toString("utf8"));
      returnUrl = state.returnUrl || "/"; 
      // Optionally: Compare state.csrf with the stored token.
    } catch (e) {
      console.error("Failed to parse state parameter:", e);
    }
  }
  issueToken(req, res, returnUrl);
});

router.get("/microsoft", (req, res, next) => {
  const { returnUrl } = req.query;
  // Generate a CSRF token (or use a library) – here we use a simple random string for illustration.
  const csrf = Math.random().toString(36).slice(2);
  // (If you use sessions, store the CSRF token for later verification.)
  const state = Buffer.from(JSON.stringify({ returnUrl, csrf })).toString("base64");
  passport.authenticate("microsoft", { scope: ["profile", "email"], state })(req, res, next);
});


router.get("/microsoft/callback", passport.authenticate("microsoft", { failureRedirect: "/login", session: false  }), (req, res) => {
  let returnUrl = "/";
  if (req.query.state) {
    try {
      const state = JSON.parse(Buffer.from(req.query.state, "base64").toString("utf8"));
      returnUrl = state.returnUrl || "/"; 
      // Optionally: Compare state.csrf with the stored token.
    } catch (e) {
      console.error("Failed to parse state parameter:", e);
    }
  }
  issueToken(req, res, returnUrl);
});
module.exports = router;
