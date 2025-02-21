const  express = require( "express");
const Project = require( "../models/Project.js");
const authMiddleware = require("../middlewares/auth");
const User = require('../models/User');

const router = express.Router();

// Create a new project
router.post("/", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
  
      // Create user instance (password will be hashed automatically by Mongoose middleware)
      const newUser = new User({ username, passwordHash: password });
      await newUser.save();
  
      console.log("New User Created:", username);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

// form to create user
router.get("/create", async (req, res) => {
    res.send(`
        <html>
        <head><title>Create User</title></head>
        <body>
            <h2>Create a New User</h2>
                <form action="/api/users" method="POST">
                <label>Username: <input type="text" name="username" required /></label><br/>
                <label>Password: <input type="password" name="password" required /></label><br/>
                <button type="submit">Create</button>
            </form>
        </body>
        </html>
    `);
});

module.exports = router;