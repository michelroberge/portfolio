// portfolio.node/src/routes/oauthRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("../config/passport");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

// Helper function to issue a JWT and set it as a cookie.
function issueToken(req, res) {
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
  res.redirect("/");
}

// Google OAuth2 Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), issueToken);

// Facebook OAuth2 Routes
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), issueToken);

// GitHub OAuth2 Routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), issueToken);

// Microsoft OAuth2 Routes
router.get("/microsoft", passport.authenticate("microsoft", { scope: ["user.read"] }));
router.get("/microsoft/callback", passport.authenticate("microsoft", { failureRedirect: "/login" }), issueToken);

module.exports = router;
