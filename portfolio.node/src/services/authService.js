const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Use SECRET_KEY from environment variables or fallback
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

/**
 * Registers a new user.
 * @param {Object} param0 - Contains username and password.
 * @returns {Promise<Object>} - The created user.
 */
async function registerUser({ username, password }) {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("User already exists");
  }
  // Create a new user; the pre-save hook in User model will hash the password.
  const user = new User({ username, passwordHash: password });
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
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
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

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
};
