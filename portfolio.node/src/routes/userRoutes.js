const express = require("express");
const userService = require("../services/userService");
const authMiddleware = require("../middlewares/auth");
const User = require('../models/User');
const adminAuth = require('../middlewares/admin');

const router = express.Router();


router.post("/initialize", async (req, res) => {
  try {

    const admin = await User.findOne({ isAdmin: true });
    if ( admin ){
      res.status(403).json({ message: "Admin user already exists." });
      return;
    }

    const { username, password } = req.body;

    // Delegate the creation to the user service.
    const newUser = await userService.createUser({ username, password, isAdmin: true });
    console.log("New User Created:", newUser.username);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    // Use 400 for client errors (e.g., missing fields or duplicate user)
    res.status(error.message === "User already exists" || error.message === "Username and password are required" ? 400 : 500)
       .json({ error: error.message });
  }
});


router.get("/admin-exists", async (req, res) => {
  try {
    const admin = await User.findOne({ isAdmin: true });
    res.json({ exists: !!admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// A simple GET endpoint that serves a registration form.
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

// Endpoint for user registration
router.post("/", authMiddleware, async (req, res) => {
  try {

    if  (!req.user?.isAdmin === true){
      res.status(403);
    }

    const { username, password } = req.body;

    // Delegate the creation to the user service.
    const newUser = await userService.createUser({ username, password });
    console.log("New User Created:", newUser.username);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    // Use 400 for client errors (e.g., missing fields or duplicate user)
    res.status(error.message === "User already exists" || error.message === "Username and password are required" ? 400 : 500)
       .json({ error: error.message });
  }
});

router.get("/", authMiddleware, adminAuth, async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

router.get("/:id", authMiddleware, adminAuth, async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.put("/:id", authMiddleware, adminAuth, async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.json(updatedUser);
});

router.delete("/:id", authMiddleware, adminAuth, async (req, res) => {
  const deletedUser = await userService.deleteUser(req.params.id);
  if (!deletedUser) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
});

module.exports = router;
