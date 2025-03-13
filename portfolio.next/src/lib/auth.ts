import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_API, APP_ROUTES } from '@/lib/constants';
import { User } from '@/models/User';

/**
 * Get the authenticated user's status server-side
 */
export async function getAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
        const res = await fetch(AUTH_API.auth.status, {
            headers: {
                Cookie: cookies().toString(),
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            return { isAuthenticated: false, user: null };
        }

        const user = await res.json();
        return { isAuthenticated: true, user };
    } catch (error) {
        console.error('Failed to get auth status:', error);
        return { isAuthenticated: false, user: null };
    }
}

/**
 * Protect a route server-side, redirecting to login if not authenticated
 * or not an admin
 */
export async function protectAdminRoute() {
    const { isAuthenticated, user } = await getAuthStatus();
    
    if (!isAuthenticated || !user?.isAdmin) {
        redirect(APP_ROUTES.auth.login);
    }

    return { user };
}
