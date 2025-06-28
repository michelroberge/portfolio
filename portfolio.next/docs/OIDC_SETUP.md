# OIDC Authentication Setup

This document explains how to configure OpenID Connect (OIDC) authentication for the admin interface.

## Environment Variables

Add the following environment variables to your backend `.env` file:

```bash
# OIDC Configuration (Backend)
OIDC_CLIENT_ID=your_oidc_client_id
OIDC_CLIENT_SECRET=your_oidc_client_secret
OIDC_ISSUER=https://your-oidc-provider.com
OIDC_REDIRECT_URI=http://localhost:5000/api/auth/oidc/callback
OIDC_SCOPE=openid profile email

# Frontend URL (for redirects after OIDC authentication)
FRONTEND_URL=http://localhost:3000

# CORS Configuration
ALLOW_CORS=http://localhost:3000

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

## Supported OIDC Providers

The application supports any OIDC-compliant provider, including:

- Auth0
- Okta
- Azure AD
- Google Identity Platform
- Keycloak
- Any custom OIDC provider

## OIDC Flow

1. User visits `/admin/login`
2. If `LOCAL_AUTH_DISABLE=true`, automatically redirects to OIDC provider
3. If `LOCAL_AUTH_DISABLE=false`, shows login form with OIDC button
4. User authenticates with OIDC provider
5. OIDC provider redirects back to `/api/auth/oidc/callback`
6. Application exchanges authorization code for tokens
7. Application gets user info from OIDC provider
8. User is created/updated in local database
9. User is redirected to admin dashboard

## User Management

- New users are automatically created when they first authenticate via OIDC
- Users are created with `isAdmin: false` by default
- Admin privileges must be manually granted through the admin interface
- OIDC information (provider, sub) is stored for future reference

## Security Considerations

- Always use HTTPS in production
- Store sensitive environment variables securely
- Regularly rotate OIDC client secrets
- Use appropriate OIDC scopes for your use case
- Consider implementing additional security measures like MFA 