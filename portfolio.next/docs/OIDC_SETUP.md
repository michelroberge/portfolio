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
OIDC_SCOPE=openid profile email roles

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

## Keycloak Configuration

### 1. Create Admin Role

1. Go to your Keycloak realm (e.g., `homelab`)
2. Navigate to **Roles** in the left sidebar
3. Click **Add Role**
4. Set **Role Name** to `portfolio-admin`
5. Set **Description** to `Portfolio application administrator`
6. Click **Save**

### 2. Assign Admin Role to Users

1. Go to **Users** in the left sidebar
2. Select the user you want to make an admin
3. Go to the **Role Mappings** tab
4. Under **Realm Roles**, find `portfolio-admin` and click **Add selected**
5. The role should now appear in the **Assigned Roles** section

### 3. Configure Client to Include Roles

1. Go to **Clients** → **portfolio** (your client)
2. Go to the **Mappers** tab
3. Click **Create**
4. Configure the mapper:
   - **Name**: `realm roles`
   - **Mapper Type**: `Realm Role`
   - **Token Claim Name**: `realm_access.roles`
   - **Add to ID token**: ✅ **ON**
   - **Add to access token**: ✅ **ON**
   - **Add to userinfo**: ✅ **ON**
5. Click **Save**

### 4. Alternative: Client-Specific Roles

If you prefer client-specific roles:

1. Go to **Clients** → **portfolio**
2. Go to the **Roles** tab
3. Click **Add Role**
4. Create a role named `admin`
5. Assign this role to users in the **Role Mappings** tab of their user profile

## Configuration Options

### LOCAL_AUTH_DISABLE

- `false` (default): Shows both local login form and OIDC button
- `true`: Automatically redirects to OIDC provider, no local login form

### OIDC_SCOPE

Default scope is `openid profile email roles`. The `roles` scope is required for admin role checking.

### Admin Role Names

The system checks for these role names (in order of preference):
- `admin`
- `portfolio-admin`
- `realm-admin`

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
7. Application gets user info and checks for admin roles
8. User is created/updated in local database with admin status
9. User is redirected to admin dashboard

## User Management

- New users are automatically created when they first authenticate via OIDC
- Admin status is determined by OIDC roles (`admin`, `portfolio-admin`, or `realm-admin`)
- Admin status is updated on each login (allows role changes in Keycloak)
- Users without admin roles are created with `isAdmin: false`

## Troubleshooting

### Admin Role Not Working

1. **Check role assignment**: Ensure the user has the correct role in Keycloak
2. **Verify mapper configuration**: Make sure the realm role mapper is configured correctly
3. **Check token claims**: Use a JWT decoder to verify roles are included in the token
4. **Review backend logs**: Look for role checking debug information

### Common Issues

- **Role not in token**: Check Keycloak client mapper configuration
- **Wrong role name**: Ensure the role name matches one of the supported names
- **Scope missing**: Verify `roles` is included in the OIDC scope

## Security Considerations

- Always use HTTPS in production
- Store sensitive environment variables securely
- Regularly rotate OIDC client secrets
- Use appropriate OIDC scopes for your use case
- Consider implementing additional security measures like MFA 