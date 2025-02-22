const User = require("../models/User");

/**
 * Creates a new user.
 * 
 * @param {Object} userData - An object containing user details.
 * @param {string} userData.username - The username.
 * @param {string} userData.password - The plain-text password.
 * @returns {Promise<Object>} - The newly created user.
 * @throws {Error} - If username or password is missing or if the user already exists.
 */
async function createUser({ username, password }) {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
  
    // Check for an existing user with the same username.
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("User already exists");
    }
  
    // Create the user instance.
    // The User model's pre-save hook will hash the password automatically.
    const newUser = new User({ username, passwordHash: password });
    await newUser.save();
    return newUser;
  }

/**
 * Retrieves all users.
 * @returns {Promise<Array>} - Array of user.
 */
async function getAllUsers() {
  return User.find();
}

/**
 * Retrieves a users by its ID.
 * @param {string} id - The user ID.
 * @returns {Promise<Object|null>} - The found user  or null.
 */
async function getUserById(id) {
  return User.findById(id);
}

/**
 * Updates a user by its ID.
 * @param {string} id - The user ID.
 * @param {Object} data - Data to update.
 * @returns {Promise<Object|null>} - The updated user or null.
 */
async function updateUser(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true });
}

/**
 * Deletes a user by its ID.
 * @param {string} id - The user ID.
 * @returns {Promise<Object|null>} - The deleted user or null.
 */
async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
