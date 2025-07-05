# OIDC Authentication Implementation

This document describes the OpenID Connect (OIDC) authentication implementation for the portfolio application.

## Overview

The OIDC implementation provides a secure way to authenticate users using external identity providers while maintaining compatibility with the existing local authentication system.

## Features

- **Flexible Authentication**: Support for both local username/password and OIDC authentication
- **Automatic Redirect**: Option to automatically redirect to OIDC provider when local auth is disabled
- **User Management**: Automatic user creation and management based on OIDC claims
- **Admin Support**: First OIDC user becomes admin if no admin exists
- **Secure Token Handling**: Proper JWT token generation and validation

## Architecture

### Frontend (Next.js)

1. **OIDC Login Component** (`portfolio.next/src/components/admin/login/OIDCLogin.tsx`)
   - Handles OIDC authentication flow
   - Supports both full-page and button modes
   - Auto-triggers OIDC when local auth is disabled

2. **OIDC Configuration API** (`portfolio.next/src/app/api/oidc/config/route.ts`)
   - Returns OIDC configuration based on environment variables
   - Determines if OIDC is enabled and local auth is disabled

3. **OIDC Callback API** (`portfolio.next/src/app/api/oidc/callback/route.ts`)
   - Handles OIDC authorization code callback
   - Exchanges authorization code for tokens
   - Authenticates user with backend

### Backend (Node.js)

1. **OIDC Authentication Route** (`portfolio.node/src/routes/authRoutes.js`)
   - Handles OIDC user authentication
   - Creates or updates users based on OIDC claims
   - Generates JWT tokens for authenticated users

2. **Enhanced User Model** (`portfolio.node/src/models/User.js`)
   - Added OIDC-related fields (name, oidcProvider, oidcSub)
   - Supports storing OIDC provider information

3. **Auth Service** (`portfolio.node/src/services/authService.js`)
   - Added generateToken method for OIDC authentication
   - Maintains compatibility with existing authentication

## Configuration

### Environment Variables

Add these variables to your `.env.local` file:

```bash
# OIDC Configuration (Next.js Frontend)
OIDC_CLIENT_ID=your_oidc_client_id
OIDC_CLIENT_SECRET=your_oidc_client_secret
OIDC_ISSUER=https://your-oidc-provider.com
OIDC_REDIRECT_URI=http://localhost:3000/api/oidc/callback
OIDC_SCOPE=openid profile email

# Authentication Configuration
# Set to 'true' to disable local username/password authentication
# When true, only OIDC authentication will be available
LOCAL_AUTH_DISABLE=false

# JWT Secret (should be the same as backend)
SECRET_KEY=your_jwt_secret_key
```

## Configuration Options

### LOCAL_AUTH_DISABLE

- `false` (default): Shows both local login form and OIDC button
- `true`: Automatically redirects to OIDC provider, no local login form

### OIDC_SCOPE

Default scope is `openid profile email`. You can customize this based on your OIDC provider's requirements.

## OIDC Flow

1. **User visits** `/admin/login`
2. **Configuration check**: App checks if OIDC is enabled and local auth is disabled
3. **Authentication method**:
   - If `LOCAL_AUTH_DISABLE=true`: Automatically redirects to OIDC provider
   - If `LOCAL_AUTH_DISABLE=false`: Shows login form with OIDC button
4. **OIDC authentication**: User authenticates with OIDC provider
5. **Callback handling**: OIDC provider redirects back to `/api/oidc/callback`
6. **Token exchange**: App exchanges authorization code for access token
7. **User info retrieval**: App gets user information from OIDC provider
8. **User creation/update**: User is created or updated in local database
9. **Authentication**: JWT token is generated and user is redirected to admin dashboard

## User Management

### New Users
- Automatically created when they first authenticate via OIDC
- Created with `isAdmin: false` by default (unless they're the first user)
- OIDC information (provider, sub) is stored for future reference

### Existing Users
- OIDC information is updated on subsequent logins
- Admin privileges are preserved
- Local password authentication remains available

### Admin Users
- First OIDC user becomes admin if no admin exists
- Admin privileges must be manually granted for subsequent users
- Admin status is preserved across OIDC logins

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Environment Variables**: Store sensitive variables securely
3. **Client Secrets**: Regularly rotate OIDC client secrets
4. **Scopes**: Use appropriate OIDC scopes for your use case
5. **Token Validation**: JWT tokens are properly validated and signed
6. **CSRF Protection**: State parameter is used to prevent CSRF attacks

## Supported OIDC Providers

The implementation supports any OIDC-compliant provider, including:

- Auth0
- Okta
- Azure AD
- Google Identity Platform
- Keycloak
- Any custom OIDC provider

## KeyCloak integration
The app has an integration with keycloak to manage the users and roles.

```
KEYCLOAK_BASE_URL = 'http://localhost:8080/auth';
KEYCLOAK_REALM = 'your-realm';
KEYCLOAK_ADMIN_USER = 'admin';
KEYCLOAK_ADMIN_PASSWORD = 'admin';
KEYCLOAK_CLIENT_ID = 'admin-cli';
```

> TODO: Current solution is based on username and password, but this needs to be changed to service account.

## Troubleshooting

### Common Issues

1. **OIDC not showing**: Check that all required environment variables are set
2. **Callback errors**: Verify redirect URI matches OIDC provider configuration
3. **Token exchange failures**: Check client ID and secret
4. **User not created**: Verify OIDC provider returns required claims (email)

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

## Migration from Local Auth

To migrate from local authentication to OIDC:

1. Configure OIDC environment variables
2. Set `LOCAL_AUTH_DISABLE=false` initially
3. Test OIDC authentication
4. Set `LOCAL_AUTH_DISABLE=true` when ready
5. Update existing users with OIDC information if needed

## Future Enhancements

- Support for multiple OIDC providers
- Role-based access control based on OIDC claims
- Automatic user provisioning from OIDC groups
- Enhanced error handling and user feedback
- Support for OIDC refresh tokens 