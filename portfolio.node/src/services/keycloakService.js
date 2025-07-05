const KcAdminClient = require('@keycloak/keycloak-admin-client').default;

// TODO: Replace with your actual Keycloak config
const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080/auth';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'your-realm';
const KEYCLOAK_ADMIN_USER = process.env.KEYCLOAK_ADMIN_USER || 'admin';
const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'admin-cli';

const kcAdminClient = new KcAdminClient({
  baseUrl: KEYCLOAK_BASE_URL,
  realmName: KEYCLOAK_REALM,
});

async function authenticate() {
  try {
    await kcAdminClient.auth({
      username: KEYCLOAK_ADMIN_USER,
      password: KEYCLOAK_ADMIN_PASSWORD,
      grantType: 'password',
      clientId: KEYCLOAK_CLIENT_ID,
    });
  } catch (err) {
    console.error('Keycloak authentication failed:', err.message);
    throw new Error('Keycloak authentication failed');
  }
}

/**
 * Ensure the 'profile-admin' role exists in Keycloak, create if not.
 * @returns {Promise<Object>} The role representation.
 */
async function ensureProfileAdminRole() {
  try {
    await authenticate();
    const roles = await kcAdminClient.roles.find();
    let role = roles.find(r => r.name === 'profile-admin');
    if (!role) {
      role = await kcAdminClient.roles.create({ name: 'profile-admin' });
    }
    return role;
  } catch (err) {
    console.error('Keycloak role check/creation failed:', err.message);
    throw new Error('Keycloak role check/creation failed');
  }
}

// --- User Management Stubs ---

/**
 * Find or create a user in Keycloak by email.
 * @param {Object} userData - { username, email, password, isAdmin }
 * @returns {Promise<Object>} The Keycloak user representation.
 */
async function findOrCreateUser(userData) {
  try {
    await authenticate();
    const { username, email, password, isAdmin } = userData;
    const users = await kcAdminClient.users.find({ email });
    let user = users && users.length > 0 ? users[0] : null;
    if (!user) {
      const createdUser = await kcAdminClient.users.create({
        username: username || email,
        email,
        enabled: true,
        emailVerified: true,
        credentials: password ? [{ type: 'password', value: password, temporary: false }] : undefined,
      });
      user = await kcAdminClient.users.findOne({ id: createdUser.id });
    }
    if (typeof isAdmin === 'boolean') {
      await setAdminRole(user.id, isAdmin);
    }
    return user;
  } catch (err) {
    console.error('Keycloak findOrCreateUser failed:', err.message);
    throw new Error('Keycloak findOrCreateUser failed');
  }
}

/**
 * Assign or remove the 'profile-admin' role for a user in Keycloak.
 * @param {string} userId - Keycloak user ID
 * @param {boolean} isAdmin - Whether to assign or remove the role
 */
async function setAdminRole(userId, isAdmin) {
  try {
    await authenticate();
    const role = await ensureProfileAdminRole();
    const userRoles = await kcAdminClient.users.listRealmRoleMappings({ id: userId });
    const hasRole = userRoles.some(r => r.name === 'profile-admin');
    if (isAdmin && !hasRole) {
      await kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        roles: [{ id: role.id, name: role.name }],
      });
    } else if (!isAdmin && hasRole) {
      await kcAdminClient.users.delRealmRoleMappings({
        id: userId,
        roles: [{ id: role.id, name: role.name }],
      });
    }
  } catch (err) {
    console.error('Keycloak setAdminRole failed:', err.message);
    throw new Error('Keycloak setAdminRole failed');
  }
}

/**
 * Remove user from client/role in Keycloak (do not delete user).
 * Removes all client role mappings for the user for the specified client.
 * @param {string} userId - Keycloak user ID
 */
async function removeUserFromClient(userId) {
  try {
    await authenticate();
    const clientId = process.env.KEYCLOAK_CLIENT_ID_FOR_APP || 'your-client-id';
    const clients = await kcAdminClient.clients.find({ clientId });
    if (!clients || clients.length === 0) {
      throw new Error(`Client with clientId '${clientId}' not found in Keycloak.`);
    }
    const client = clients[0];
    const roles = await kcAdminClient.users.listClientRoleMappings({ id: userId, clientUniqueId: client.id });
    if (roles && roles.length > 0) {
      await kcAdminClient.users.delClientRoleMappings({
        id: userId,
        clientUniqueId: client.id,
        roles: roles.map(r => ({ id: r.id, name: r.name })),
      });
    }
  } catch (err) {
    console.error('Keycloak removeUserFromClient failed:', err.message);
    throw new Error('Keycloak removeUserFromClient failed');
  }
}

module.exports = {
  authenticate,
  ensureProfileAdminRole,
  findOrCreateUser,
  setAdminRole,
  removeUserFromClient,
}; 