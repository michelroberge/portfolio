const express = require("express");
const authService = require("../services/authService");
const router = express.Router();

// Register a new user using the auth service
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    await authService.registerUser({ username, password });
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
router.get("/check", (req, res) => {
  const token = req.cookies["auth-token"];
  if (!token) {
    return res.status(401).json({ authenticated: false, message: "No token provided" });
  }
  try {
    const decoded = authService.verifyToken(token);
    res.json({ authenticated: true, user: decoded });
  } catch (error) {
    res.status(401).json({ authenticated: false, message: error.message });
  }
});

// Logout by clearing the token cookie
router.get("/logout", (req, res) => {
  res.clearCookie("auth-token");
  res.json({ message: "Logged out" });
});

module.exports = router;
