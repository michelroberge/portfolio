import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with your actual Keycloak config or use env vars
const KEYCLOAK_BASE_URL = process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'your-realm';
const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  // TODO: Extract id_token from session/cookie (this is a placeholder)
  // You may need to integrate with your session management to get the id_token
  const idToken = req.cookies.get('id_token')?.value;

  if (!idToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const logoutUrl = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout?` +
    `id_token_hint=${encodeURIComponent(idToken)}&post_logout_redirect_uri=${encodeURIComponent(POST_LOGOUT_REDIRECT_URI)}`;

  return NextResponse.json({ logoutUrl });
} 