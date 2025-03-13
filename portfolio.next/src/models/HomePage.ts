import { BlogEntry } from './BlogEntry';
import { Project } from './Project';

/**
 * Represents the home page data
 */
export interface HomePage {
    blogs: BlogEntry[];
    projects: Project[];
    featuredBlogs: BlogEntry[];
    featuredProjects: Project[];
    stats: {
        totalBlogs: number;
        totalProjects: number;
        lastUpdated: string;
    };
}
