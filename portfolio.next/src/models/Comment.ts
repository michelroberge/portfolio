/**
 * Model representing a user comment
 */
export interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
  redacted: boolean;
  replies: Comment[];
  userId?: string; // To identify if the current user owns this comment
}

/**
 * Interface for updating a comment
 */
export interface CommentUpdate {
  text: string;
}

/**
 * Interface for creating a new comment
 */
export interface CommentCreate {
  text: string;
  parentId?: string; // For replies
}
