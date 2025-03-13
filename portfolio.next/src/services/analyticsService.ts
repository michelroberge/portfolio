// portfolio.next/src/services/analyticsService.ts
import { ADMIN_API } from '@/lib/constants';
import { AnalyticsData, TelemetryData, AnalyticsError } from '@/models/Analytics';

const ANALYTICS_ERRORS = {
    FETCH_FAILED: "Failed to fetch analytics data",
    NETWORK_ERROR: "Network error while fetching analytics",
    UNAUTHORIZED: "Unauthorized access to analytics",
    TRACK_FAILED: "Failed to track analytics",
} as const;

/**
 * Fetch analytics data for the portfolio dashboard
 * @throws {Error} With domain-specific error message if fetch fails
 */
export async function fetchAnalytics(): Promise<AnalyticsData> {
    try {
        const res = await fetch(ADMIN_API.analytics.list, {
            credentials: "include",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!res.ok) {
            const error = await res.json() as AnalyticsError;
            if (res.status === 401) {
                throw new Error(ANALYTICS_ERRORS.UNAUTHORIZED);
            }
            throw new Error(error.message || ANALYTICS_ERRORS.FETCH_FAILED);
        }

        const data = await res.json();
        return {
            ...data,
            lastUpdated: new Date().toISOString(),
        } as AnalyticsData;
    } catch (error) {
        console.error("Analytics service error:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(ANALYTICS_ERRORS.NETWORK_ERROR);
    }
}

/**
 * Track a page view
 */
export async function trackPageView(path: string): Promise<void> {
    try {
        const res = await fetch(ADMIN_API.analytics.trackPage, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ path }),
        });

        if (!res.ok) {
            const error = await res.json() as AnalyticsError;
            if (res.status === 401) {
                throw new Error(ANALYTICS_ERRORS.UNAUTHORIZED);
            }
            throw new Error(error.message || ANALYTICS_ERRORS.TRACK_FAILED);
        }
    } catch (error) {
        console.error("Analytics service error:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(ANALYTICS_ERRORS.NETWORK_ERROR);
    }
}

/**
 * Track a custom event
 */
export async function trackEvent(event: string, data?: Record<string, any>): Promise<void> {
    try {
        const res = await fetch(ADMIN_API.analytics.trackEvent, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ event, data }),
        });

        if (!res.ok) {
            const error = await res.json() as AnalyticsError;
            if (res.status === 401) {
                throw new Error(ANALYTICS_ERRORS.UNAUTHORIZED);
            }
            throw new Error(error.message || ANALYTICS_ERRORS.TRACK_FAILED);
        }
    } catch (error) {
        console.error("Analytics service error:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(ANALYTICS_ERRORS.NETWORK_ERROR);
    }
}

/**
 * Fetch telemetry data for the admin dashboard
 */
export async function fetchTelemetry(): Promise<TelemetryData> {
    try {
        const res = await fetch(ADMIN_API.analytics.telemetry, {
            credentials: "include",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!res.ok) {
            const error = await res.json() as AnalyticsError;
            if (res.status === 401) {
                throw new Error(ANALYTICS_ERRORS.UNAUTHORIZED);
            }
            throw new Error(error.message || ANALYTICS_ERRORS.FETCH_FAILED);
        }

        const data = await res.json();
        return {
            ...data,
            lastUpdated: new Date().toISOString(),
        } as TelemetryData;
    } catch (error) {
        console.error("Analytics service error:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(ANALYTICS_ERRORS.NETWORK_ERROR);
    }
}
