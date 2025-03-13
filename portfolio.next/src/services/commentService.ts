import { AUTH_API, ADMIN_API } from '@/lib/constants';
import { Comment, CommentUpdate, CommentCreate } from '@/models/Comment';

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
 * Redact a comment by its ID (admin only)
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

/**
 * Create a new comment or reply (auth required)
 */
export async function createComment(comment: CommentCreate): Promise<Comment> {
  try {
    const res = await fetch(AUTH_API.comment.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(comment),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create comment");
    }

    return res.json();
  } catch (err) {
    console.error("Failed to create comment:", err);
    throw err;
  }
}

/**
 * Update a user's own comment (auth required)
 */
export async function updateComment(id: string, update: CommentUpdate): Promise<Comment> {
  try {
    const res = await fetch(AUTH_API.comment.update(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(update),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update comment");
    }

    return res.json();
  } catch (err) {
    console.error("Failed to update comment:", err);
    throw err;
  }
}

/**
 * Delete a user's own comment (auth required)
 */
export async function deleteComment(id: string): Promise<void> {
  try {
    const res = await fetch(AUTH_API.comment.delete(id), {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete comment");
    }
  } catch (err) {
    console.error("Failed to delete comment:", err);
    throw err;
  }
}
