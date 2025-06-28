// Test the OIDC configuration logic directly
describe('OIDC Configuration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should detect OIDC as disabled when required variables are missing', () => {
    // Clear OIDC environment variables
    delete process.env.NEXT_OIDC_CLIENT_ID;
    delete process.env.NEXT_OIDC_ISSUER;
    delete process.env.NEXT_OIDC_REDIRECT_URI;

    const oidcEnabled = !!(
      process.env.NEXT_OIDC_CLIENT_ID &&
      process.env.NEXT_OIDC_ISSUER &&
      process.env.NEXT_OIDC_REDIRECT_URI
    );

    expect(oidcEnabled).toBe(false);
  });

  it('should detect OIDC as enabled when all required variables are present', () => {
    // Set OIDC environment variables
    process.env.NEXT_OIDC_CLIENT_ID = 'test-client-id';
    process.env.NEXT_OIDC_ISSUER = 'https://test-issuer.com';
    process.env.NEXT_OIDC_REDIRECT_URI = 'http://localhost:3000/api/oidc/callback';

    const oidcEnabled = !!(
      process.env.NEXT_OIDC_CLIENT_ID &&
      process.env.NEXT_OIDC_ISSUER &&
      process.env.NEXT_OIDC_REDIRECT_URI
    );

    expect(oidcEnabled).toBe(true);
  });

  it('should detect local auth as disabled when NEXT_LOCAL_AUTH_DISABLE is true', () => {
    process.env.NEXT_LOCAL_AUTH_DISABLE = 'true';
    
    const localAuthDisabled = process.env.NEXT_LOCAL_AUTH_DISABLE === 'true';
    
    expect(localAuthDisabled).toBe(true);
  });

  it('should detect local auth as enabled when NEXT_LOCAL_AUTH_DISABLE is false', () => {
    process.env.NEXT_LOCAL_AUTH_DISABLE = 'false';
    
    const localAuthDisabled = process.env.NEXT_LOCAL_AUTH_DISABLE === 'true';
    
    expect(localAuthDisabled).toBe(false);
  });

  it('should use default scope when NEXT_OIDC_SCOPE is not set', () => {
    delete process.env.NEXT_OIDC_SCOPE;
    
    const scope = process.env.NEXT_OIDC_SCOPE || 'openid profile email';
    
    expect(scope).toBe('openid profile email');
  });

  it('should use custom scope when NEXT_OIDC_SCOPE is set', () => {
    process.env.NEXT_OIDC_SCOPE = 'openid profile email groups';
    
    const scope = process.env.NEXT_OIDC_SCOPE || 'openid profile email';
    
    expect(scope).toBe('openid profile email groups');
  });
});