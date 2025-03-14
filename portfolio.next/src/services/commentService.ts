import { AUTH_API, ADMIN_API, PUBLIC_API } from '@/lib/constants';
import { Comment, CommentUpdate, CommentCreate } from '@/models/Comment';

/**
 * Fetch all comments for admin management
 */
export async function fetchAllComments(isAdmin: boolean = false, cookieHeader: string | null = null): Promise<Comment[]> {
  try {
    const url = isAdmin ? ADMIN_API.comment.list : PUBLIC_API.comment.list;
    const headers: HeadersInit = cookieHeader
      ? { Cookie: cookieHeader }
      : {};

    const res = await fetch(url, {
      credentials: "include",
      headers,
      cache: "no-store",
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
export async function redactComment(id: string, isAdmin: boolean = false, cookieHeader: string | null = null): Promise<void> {
  try {
    if (!isAdmin) {
      throw new Error("Unauthorized");
    }

    const headers: HeadersInit = cookieHeader
      ? { Cookie: cookieHeader }
      : {};

    const res = await fetch(ADMIN_API.comment.delete(id), {
      method: "DELETE",
      credentials: "include",
      headers,
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
export async function createComment(comment: CommentCreate, cookieHeader: string | null = null): Promise<Comment> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {})
    };

    const res = await fetch(AUTH_API.comment.create, {
      method: "POST",
      headers,
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
export async function updateComment(id: string, update: CommentUpdate, cookieHeader: string | null = null): Promise<Comment> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {})
    };

    const res = await fetch(AUTH_API.comment.update(id), {
      method: "PUT",
      headers,
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
export async function deleteComment(id: string, cookieHeader: string | null = null): Promise<void> {
  try {
    const headers: HeadersInit = cookieHeader
      ? { Cookie: cookieHeader }
      : {};

    const res = await fetch(AUTH_API.comment.delete(id), {
      method: "DELETE",
      credentials: "include",
      headers,
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
