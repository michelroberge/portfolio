import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_API, APP_ROUTES } from '@/lib/constants';
import { User } from '@/models/User';

/**
 * Get the authenticated user's status server-side
 */
export async function getAuthStatus(): Promise<{ isAuthenticated: boolean; user: User | null, isAdmin: boolean }> {
    try {
        const res = await fetch(AUTH_API.auth.status, {
            headers: {
                Cookie: cookies().toString(),
            },
            cache: 'no-store',
        });

        console.log('🔍 [DEBUG] getAuthStatus res.ok:', res.ok);

        if (!res.ok) {
            return { isAuthenticated: false, user: null, isAdmin: false };
        }

        const {user} = await res.json();
        console.log('🔍 [DEBUG] getAuthStatus user:', user);

        return { isAuthenticated: true, user, isAdmin: user.isAdmin };
    } catch (error) {
        console.error('Failed to get auth status:', error);
        return { isAuthenticated: false, user: null, isAdmin: false };
    }
}

/**
 * Protect a route server-side, redirecting to login if not authenticated
 * or not an admin
 */
export async function protectAdminRoute() {
    const { isAuthenticated, user, isAdmin } = await getAuthStatus();

    console.log('🔍 [DEBUG] protectAdminRoute isAuthenticated:', isAuthenticated, 'isAdmin:', isAdmin);

    if (!isAuthenticated || !isAdmin) {
        redirect(APP_ROUTES.auth.login);
    }

    return { user };
}

/**
 * Protect a route server-side, redirecting to login if not authenticated
 * or not an admin
 */
export async function getAdminCookie(user : User | null = null) {

    if (!user || !user.isAdmin) {
        redirect(APP_ROUTES.auth.login);
    }

    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString(); 
    
    return { cookieHeader };
}

