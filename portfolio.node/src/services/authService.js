const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Use SECRET_KEY from environment variables or fallback
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

/**
 * Registers a new user.
 * If `isAdmin` is true, ensures no admin user already exists.
 * @param {Object} param0 - Contains username, password, and optional isAdmin flag.
 * @returns {Promise<Object>} - The created user.
 */
async function registerUser({ username, password, isAdmin = false }) {
  // If registering an admin, check that no admin exists yet.
  if (isAdmin) {
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      throw new Error("An admin user already exists. Admin registration requires an existing admin.");
    }
  }

  // Check for an existing user with the same username.
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  // Create a new user; the User model's pre-save hook hashes the password.
  const user = new User({ username, passwordHash: password, isAdmin });
  await user.save();
  return user;
}

/**
 * Logs in a user by validating credentials and returning a JWT.
 * @param {Object} param0 - Contains username and password.
 * @returns {Promise<string>} - JWT token.
 */
async function loginUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user || !(await user.validatePassword(password))) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
}

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token.
 * @returns {Object} - Decoded token information.
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

/**
 * Generates a JWT token for a user.
 * @param {Object} userData - User data to include in the token.
 * @returns {string} - JWT token.
 */
function generateToken(userData) {
  return jwt.sign(userData, SECRET_KEY, {
    expiresIn: "1h",
  });
}

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  generateToken,
};
