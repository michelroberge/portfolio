const express = require("express");
const userService = require("../../services/userService");
const authMiddleware = require("../../middlewares/auth");
const adminAuth = require('../../middlewares/admin');

const router = express.Router();

// Endpoint for adding user
router.post("/", authMiddleware, adminAuth, async (req, res) => {
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
