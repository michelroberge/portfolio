const express = require("express");
const authService = require("../services/authService");
const User = require('../models/User');
const router = express.Router();
const querystring = require('querystring');
const fetch = require('node-fetch');
const crypto = require('crypto');

// OIDC configuration cache
let oidcConfig = null;
let oidcConfigExpiry = 0;

// Fetch OIDC configuration from well-known endpoint
async function getOIDCConfig() {
  const now = Date.now();
  if (oidcConfig && now < oidcConfigExpiry) {
    return oidcConfig;
  }

  try {
    const wellKnownUrl = `${process.env.OIDC_ISSUER}/.well-known/openid-configuration`;
    const response = await fetch(wellKnownUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch OIDC config: ${response.status}`);
    }
    
    oidcConfig = await response.json();
    oidcConfigExpiry = now + (5 * 60 * 1000); // Cache for 5 minutes
    return oidcConfig;
  } catch (error) {
    console.error('Failed to fetch OIDC configuration:', error);
    throw error;
  }
}

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

// OIDC authentication endpoint
router.post("/oidc", async (req, res) => {
  try {
    const { email, name, sub, provider, isAdmin } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required for OIDC authentication" 
      });
    }

    // Find or create user based on OIDC claims
    let user = await User.findOne({ username: email });
    
    if (!user) {
      // Create new user from OIDC
      const password = `oidc_${sub}_${Date.now()}`; // Generate a secure password
      user = await authService.registerUser({ 
        username: email, 
        password: password,
        isAdmin: isAdmin || false // Use OIDC admin status or default to false
      });
      
      // Update user with OIDC information
      user.name = name || email.split('@')[0];
      user.oidcProvider = provider;
      user.oidcSub = sub;
      await user.save();
    } else {
      // Update existing user's OIDC information and admin status
      user.oidcProvider = provider;
      user.oidcSub = sub;
      if (name && !user.name) {
        user.name = name;
      }
      // Update admin status from OIDC claims (allows role changes in Keycloak)
      if (typeof isAdmin === 'boolean') {
        user.isAdmin = isAdmin;
      }
      await user.save();
    }

    // Generate JWT token
    const token = authService.generateToken({
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    });

    res.json({ 
      success: true, 
      token: token,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        name: user.name
      }
    });
  } catch (error) {
    console.error('OIDC authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: "OIDC authentication failed" 
    });
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

// Auth config endpoint for frontend
router.get('/config', (req, res) => {
  const oidcEnabled = !!(
    process.env.OIDC_CLIENT_ID &&
    process.env.OIDC_ISSUER &&
    process.env.OIDC_REDIRECT_URI
  );
  const localAuthEnabled = process.env.LOCAL_AUTH_DISABLE !== 'true';
  res.json({ oidcEnabled, localAuthEnabled });
});

// OIDC login endpoint (start authorization code flow)
router.get('/oidc/login', async (req, res) => {
  try {
    const { returnUrl = '/' } = req.query;
    const state = Buffer.from(JSON.stringify({ returnUrl, csrf: crypto.randomBytes(16).toString('hex') })).toString('base64');
    
    const oidcConfig = await getOIDCConfig();
    
    const params = querystring.stringify({
      client_id: process.env.OIDC_CLIENT_ID,
      response_type: 'code',
      scope: process.env.OIDC_SCOPE || 'openid profile email roles',
      redirect_uri: process.env.OIDC_REDIRECT_URI,
      state,
    });
    
    const authUrl = `${oidcConfig.authorization_endpoint}?${params}`;
    res.redirect(authUrl);
  } catch (error) {
    console.error('OIDC login error:', error);
    res.redirect(`/admin/login?error=oidc_config_failed`);
  }
});

// OIDC callback endpoint
router.get('/oidc/callback', async (req, res) => {
  const { code, state } = req.query;
  let returnUrl = '/admin'; // Default to admin dashboard
  
  if (state) {
    try {
      const stateObj = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
      returnUrl = stateObj.returnUrl || '/admin';
    } catch (e) {
      console.error('Failed to parse OIDC state:', e);
    }
  }
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/login?error=missing_code`);
  }
  
  try {
    const oidcConfig = await getOIDCConfig();
    
    // Exchange code for tokens
    const tokenRes = await fetch(oidcConfig.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.OIDC_CLIENT_ID,
        client_secret: process.env.OIDC_CLIENT_SECRET,
        redirect_uri: process.env.OIDC_REDIRECT_URI,
      }),
    });
    
    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Token exchange failed:', errorText);
      throw new Error('Token exchange failed');
    }
    
    const tokenData = await tokenRes.json();
    
    // Get user info
    const userInfoRes = await fetch(oidcConfig.userinfo_endpoint, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    if (!userInfoRes.ok) {
      const errorText = await userInfoRes.text();
      console.error('User info failed:', errorText);
      throw new Error('User info failed');
    }
    
    const userInfo = await userInfoRes.json();
    
    // Check for admin role in OIDC claims
    const isAdmin = checkAdminRole(userInfo, tokenData);
    
    // Authenticate or create user
    const authRes = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/oidc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userInfo.email,
        name: userInfo.name,
        sub: userInfo.sub,
        provider: 'oidc',
        isAdmin: isAdmin,
      }),
    });
    
    const authData = await authRes.json();
    if (!authData.success) throw new Error('OIDC backend auth failed');
    
    // Set auth cookie and redirect to frontend
    res.cookie('auth-token', authData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000,
    });
    
    // Redirect to frontend with the auth cookie
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}${returnUrl}`);
  } catch (err) {
    console.error('OIDC callback error:', err);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/admin/login?error=oidc_failed`);
  }
});

// Helper function to check for admin role in OIDC claims
function checkAdminRole(userInfo, tokenData) {
  // Check multiple possible locations for admin role
  const adminRoleNames = ['admin', 'portfolio-admin', 'realm-admin'];
  
  console.log('🔍 [OIDC] Checking admin role in userInfo:', JSON.stringify(userInfo, null, 2));
  
  // Check in userInfo (from userinfo endpoint)
  if (userInfo.roles && Array.isArray(userInfo.roles)) {
    console.log('🔍 [OIDC] Checking userInfo.roles:', userInfo.roles);
    if (userInfo.roles.some(role => adminRoleNames.includes(role))) {
      console.log('✅ [OIDC] Admin role found in userInfo.roles');
      return true;
    }
  }
  
  // Check in realm_access.roles (Keycloak specific)
  if (userInfo.realm_access && userInfo.realm_access.roles) {
    console.log('🔍 [OIDC] Checking userInfo.realm_access.roles:', userInfo.realm_access.roles);
    if (userInfo.realm_access.roles.some(role => adminRoleNames.includes(role))) {
      console.log('✅ [OIDC] Admin role found in realm_access.roles');
      return true;
    }
  }
  
  // Check in resource_access (client-specific roles)
  if (userInfo.resource_access) {
    console.log('🔍 [OIDC] Checking userInfo.resource_access:', userInfo.resource_access);
    for (const clientId in userInfo.resource_access) {
      const clientRoles = userInfo.resource_access[clientId].roles;
      if (clientRoles && clientRoles.some(role => adminRoleNames.includes(role))) {
        console.log(`✅ [OIDC] Admin role found in resource_access.${clientId}.roles`);
        return true;
      }
    }
  }
  
  // Check in ID token claims (if available)
  if (tokenData.id_token) {
    try {
      const idTokenPayload = JSON.parse(Buffer.from(tokenData.id_token.split('.')[1], 'base64').toString());
      console.log('🔍 [OIDC] Checking ID token payload:', JSON.stringify(idTokenPayload, null, 2));
      
      if (idTokenPayload.roles && Array.isArray(idTokenPayload.roles)) {
        console.log('🔍 [OIDC] Checking idTokenPayload.roles:', idTokenPayload.roles);
        if (idTokenPayload.roles.some(role => adminRoleNames.includes(role))) {
          console.log('✅ [OIDC] Admin role found in idTokenPayload.roles');
          return true;
        }
      }
      
      if (idTokenPayload.realm_access && idTokenPayload.realm_access.roles) {
        console.log('🔍 [OIDC] Checking idTokenPayload.realm_access.roles:', idTokenPayload.realm_access.roles);
        if (idTokenPayload.realm_access.roles.some(role => adminRoleNames.includes(role))) {
          console.log('✅ [OIDC] Admin role found in idTokenPayload.realm_access.roles');
          return true;
        }
      }
    } catch (e) {
      console.warn('⚠️ [OIDC] Failed to parse ID token for role checking:', e);
    }
  }
  
  console.log('❌ [OIDC] No admin role found in any claims');
  return false;
}

module.exports = router;
