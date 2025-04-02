/**
 * Represents a link in a timeline event
 */
export interface TimelineLink {
    url: string;
    title: string;
    description?: string;
}

/**
 * Represents a timeline event
 */
export interface TimelineEvent {
    _id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    description: string;
    skills: string[];
    links: TimelineLink[];
    order: number;
    visible: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Represents the career timeline
 */
export interface CareerTimeline {
    events: TimelineEvent[];
    lastUpdated: string;
}
