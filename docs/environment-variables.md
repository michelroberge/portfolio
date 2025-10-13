# Environment Variables Configuration

This document outlines the required environment variables for the cross-domain OIDC authentication setup between the Next.js frontend and Node.js backend.

## Backend Environment Variables

Create a `.env.production.local` file in the `portfolio.node` directory:

```bash
# Cookie domain for cross-subdomain authentication
# Set to .domain.name to allow cookies to work across subdomains
COOKIE_DOMAIN=.domain.name

# CORS allowed origin - must match your frontend domain exactly
ALLOW_CORS=https://domain.name

# Frontend URL for redirects after authentication
FRONTEND_URL=https://domain.name

# Backend URL (for internal calls)
BACKEND_URL=https://api.domain.name

# Keycloak OIDC configuration
KEYCLOAK_BASE_URL=https://keycloak.domain.name
KEYCLOAK_REALM=your-realm
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_ISSUER=https://keycloak.domain.name/realms/your-realm
OIDC_REDIRECT_URI=https://api.domain.name/api/auth/oidc/callback
OIDC_SCOPE=openid profile email roles

# Session configuration
SESSION_SECRET=your-secure-session-secret-min-32-chars

# Database configuration
MONGO_URI=mongodb://your-mongo-connection-string
MONGO_DB_NAME=your-database-name

# Application environment
NODE_ENV=production
LOG_HTTP_REQUESTS=false
```

## Frontend Environment Variables

Create a `.env.production.local` file in the `portfolio.next` directory:

```bash
# Backend API URL - must point to your backend subdomain
NEXT_PUBLIC_API_URL=https://api.domain.name

# Frontend base URL - your main domain
NEXT_PUBLIC_BASE_URL=https://domain.name

# Application environment
NODE_ENV=production
```

## Development Environment Variables

For local development, use `.env.development.local` files with:

**Backend (`portfolio.node/.env.development.local`):**
```bash
COOKIE_DOMAIN=localhost
ALLOW_CORS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
KEYCLOAK_BASE_URL=http://localhost:8080
KEYCLOAK_REALM=your-realm
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_ISSUER=http://localhost:8080/realms/your-realm
OIDC_REDIRECT_URI=http://localhost:5000/api/auth/oidc/callback
OIDC_SCOPE=openid profile email roles
SESSION_SECRET=your-secure-session-secret-min-32-chars
MONGO_URI=mongodb://localhost:27017/portfolio-dev
MONGO_DB_NAME=portfolio-dev
NODE_ENV=development
LOG_HTTP_REQUESTS=true
```

**Frontend (`portfolio.next/.env.development.local`):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

## Keycloak Client Configuration

Ensure your Keycloak client is configured with:

1. **Valid Redirect URIs:**
   - `https://api.domain.name/api/auth/oidc/callback` (production)
   - `http://localhost:5000/api/auth/oidc/callback` (development)

2. **Web Origins:**
   - `https://domain.name` (production)
   - `http://localhost:3000` (development)

3. **Access Type:** `confidential`

4. **Standard Flow Enabled:** `ON`

## Security Notes

1. **HTTPS Required:** The `SameSite=None` cookie setting requires HTTPS in production
2. **Session Secret:** Use a cryptographically secure random string (minimum 32 characters)
3. **OIDC Client Secret:** Keep this secure and rotate regularly
4. **Cookie Domain:** Use `.domain.name` format to enable cross-subdomain cookie sharing
5. **CORS Origin:** Must match your frontend domain exactly (no trailing slashes)

## Testing Checklist

After setting up environment variables:

- [ ] Backend starts without errors
- [ ] Frontend connects to backend API
- [ ] OIDC login redirects to Keycloak
- [ ] OIDC callback works and sets cookies
- [ ] Authentication persists across page refreshes
- [ ] Logout clears cookies and redirects properly
- [ ] Cookies have correct domain, sameSite, and secure flags in browser DevTools
