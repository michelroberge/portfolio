const express = require("express");
const authService = require("../services/authService");
const User = require('../models/User');
const router = express.Router();

// Register a new user using the auth service
router.post("/register", async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    await authService.registerUser({ username, password, isAdmin });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login a user using the auth service
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.loginUser({ username, password });
    
    // Set the token in an HTTP-only cookie
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });
    
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Check authentication using the auth service
router.get("/status", async (req, res) => {

  const admin = await User.findOne({ isAdmin: true });
  if ( !admin){
    console.debug("authentication failed", "no admin user");
    return res.status(200).json({ authenticated: false, setupRequired: true });
  }
  let token = req.cookies["auth-token"] || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.debug("authentication failed", "no token");
    return res.status(401).json({ authenticated: false, message: "No token provided" });
  }
  try {
    const decoded = authService.verifyToken(token);
    console.debug("authentication successful", decoded.username);
    res.json({ authenticated: true, user: decoded });
  } catch (error) {
    console.error("authentication failed", error);
    res.status(401).json({ authenticated: false, message: error.message });
  }
});

// Logout by clearing the token cookie
router.get("/logout", (req, res) => {
  res.clearCookie("auth-token");
  res.json({ message: "Logged out" });
});

module.exports = router;
