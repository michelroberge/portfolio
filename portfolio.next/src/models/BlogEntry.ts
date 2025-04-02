/**
 * Base blog entry interface with common properties
 */
export interface BaseBlogEntry {
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  isDraft: boolean;
  publishAt?: string | null;
}

/**
 * Full blog entry model returned from the API
 */
export interface BlogEntry extends BaseBlogEntry {
  _id: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new blog entry
 */
export interface BlogEntryCreate extends BaseBlogEntry {
  link: string; // Will be generated on the backend
}

/**
 * Data for updating an existing blog entry
 * All fields are optional since we can update any subset of the base fields
 */
export type BlogEntryUpdate = Partial<BaseBlogEntry>;