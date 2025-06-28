import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import OIDCLogin from '@/components/admin/login/OIDCLogin';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('OIDCLogin', () => {
  const mockRouter = { push: jest.fn() };
  const mockSearchParams = { get: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockSearchParams.get.mockReturnValue('/admin');
  });

  it('renders the OIDC login button', () => {
    render(<OIDCLogin />);
    expect(screen.getByText('Login with OIDC')).toBeInTheDocument();
  });

  it('redirects to backend OIDC login endpoint with returnUrl when clicked', () => {
    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
    render(<OIDCLogin />);
    fireEvent.click(screen.getByText('Login with OIDC'));
    expect(window.location.href).toContain('/api/auth/oidc/login?returnUrl=%2Fadmin');
  });
}); 