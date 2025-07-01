const User = require("../models/User");
const keycloakService = require("./keycloakService");

/**
 * Creates or links a user in Keycloak, then mirrors in local DB.
 * @param {Object} userData - { username, email, password, isAdmin }
 * @returns {Promise<Object>} - The newly created or linked user.
 */
async function createUser({ username, email, password, isAdmin = false }) {
  try {
    const kcUserCreate = await keycloakService.findOrCreateUser({ username, email, password, isAdmin });
    const dbUserCreate = await User.findOneAndUpdate(
      { username: kcUserCreate.username },
      {
        username: kcUserCreate.username,
        passwordHash: password || '',
        isAdmin: isAdmin,
        name: kcUserCreate.firstName || '',
        oidcProvider: 'keycloak',
        oidcSub: kcUserCreate.id,
      },
      { upsert: true, new: true }
    );
    return dbUserCreate;
  } catch (err) {
    console.error('User creation failed:', err.message);
    return null;
  }
}

/**
 * Retrieves all users from Keycloak, mirrors in local DB, and returns them.
 * @returns {Promise<Array>} - Array of users.
 */
async function getAllUsers() {
  try {
    await keycloakService.authenticate();
    const kcUsersAll = await keycloakService.kcAdminClient.users.find();
    const mirroredUsers = await Promise.all(kcUsersAll.map(async (kcUserAll) => {
      return User.findOneAndUpdate(
        { username: kcUserAll.username },
        {
          username: kcUserAll.username,
          passwordHash: '',
          isAdmin: false,
          name: kcUserAll.firstName || '',
          oidcProvider: 'keycloak',
          oidcSub: kcUserAll.id,
        },
        { upsert: true, new: true }
      );
    }));
    return mirroredUsers;
  } catch (err) {
    console.error('Get all users failed:', err.message);
    return [];
  }
}

/**
 * Retrieves a user by ID from Keycloak, mirrors in local DB, and returns it.
 * @param {string} id - The user ID (Keycloak ID).
 * @returns {Promise<Object|null>} - The found user or null.
 */
async function getUserById(id) {
  try {
    await keycloakService.authenticate();
    const kcUserById = await keycloakService.kcAdminClient.users.findOne({ id });
    if (!kcUserById) return null;
    const dbUserById = await User.findOneAndUpdate(
      { username: kcUserById.username },
      {
        username: kcUserById.username,
        passwordHash: '',
        isAdmin: false,
        name: kcUserById.firstName || '',
        oidcProvider: 'keycloak',
        oidcSub: kcUserById.id,
      },
      { upsert: true, new: true }
    );
    return dbUserById;
  } catch (err) {
    console.error('Get user by ID failed:', err.message);
    return null;
  }
}

/**
 * Updates a user by ID in Keycloak, then mirrors in local DB.
 * @param {string} id - The user ID (Keycloak ID).
 * @param {Object} data - Data to update (e.g., isAdmin).
 * @returns {Promise<Object|null>} - The updated user or null.
 */
async function updateUser(id, data) {
  try {
    if (typeof data.isAdmin === 'boolean') {
      await keycloakService.setAdminRole(id, data.isAdmin);
    }
    return getUserById(id);
  } catch (err) {
    console.error('Update user failed:', err.message);
    return null;
  }
}

/**
 * Removes user from client in Keycloak, then mirrors in local DB.
 * @param {string} id - The user ID (Keycloak ID).
 * @returns {Promise<Object|null>} - The updated user or null.
 */
async function deleteUser(id) {
  try {
    await keycloakService.removeUserFromClient(id);
    return getUserById(id);
  } catch (err) {
    console.error('Delete user failed:', err.message);
    return null;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
