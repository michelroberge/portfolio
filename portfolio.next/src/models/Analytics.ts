/**
 * Valid types for analytics event data values
 */
export type EventDataValue = string | number | boolean | null;

/**
 * Represents analytics data for the portfolio
 */
export interface AnalyticsData {
    users: number;
    blogPosts: number;
    projects: number;
    sessions: number;
    pageHits: number;
    topPages: Array<{
        path: string;
        hits: number;
    }>;
    topEvents: Array<{
        name: string;
        count: number;
    }>;
    lastUpdated?: string;
}

/**
 * Represents a page view event
 */
export interface PageView {
    path: string;
    timestamp: string;
    userId?: string;
    sessionId?: string;
}

/**
 * Represents a custom analytics event
 */
export interface AnalyticsEvent {
    name: string;
    data?: Record<string, EventDataValue>;
    timestamp: string;
    userId?: string;
    sessionId?: string;
}

/**
 * Represents telemetry data for the admin dashboard
 */
export interface TelemetryData {
    pageViews: number;
    uniqueVisitors: number;
    topPages: Array<{ 
        path: string; 
        views: number;
    }>;
}

/**
 * Valid types for error details values
 */
export type ErrorDetailValue = string | number | boolean | null | Error;

/**
 * Represents an error response from the analytics API
 */
export interface AnalyticsError {
    message: string;
    code?: string;
    details?: Record<string, ErrorDetailValue>;
}
