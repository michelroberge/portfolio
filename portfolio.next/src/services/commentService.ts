import { ADMIN_API } from '@/lib/constants';
import { Comment } from '@/models/Comment';

/**
 * Fetch all comments for admin management
 */
export async function fetchAllComments(): Promise<Comment[]> {
  try {
    const res = await fetch(ADMIN_API.comment.list, {
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch comments");
    }

    return res.json();
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    throw err;
  }
}

/**
 * Redact a comment by its ID
 */
export async function redactComment(id: string): Promise<void> {
  try {
    const res = await fetch(ADMIN_API.comment.delete(id), {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to redact comment");
    }
  } catch (err) {
    console.error("Failed to redact comment:", err);
    throw err;
  }
}
