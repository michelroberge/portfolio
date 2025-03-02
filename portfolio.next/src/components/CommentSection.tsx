"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
  redacted: boolean;
  replies: Comment[];
}

interface CommentSectionProps {
  blogId: string;
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();

  // ✅ Wrap fetchComments with useCallback to prevent unnecessary re-renders
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/blog/${blogId}`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        setComments([]);
      } else {
        setComments(data);
      }
    } catch {
      setError("Failed to load comments");
    }
  }, [blogId]); // ✅ Only re-create function when blogId changes

  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // ✅ Now safe to include fetchComments

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensures auth cookie is sent
        body: JSON.stringify({
          author: user?.username,
          text: newComment,
          blog: blogId,
          parent: replyTo,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to post comment");
        return;
      }
      setNewComment("");
      setReplyTo(null);
      fetchComments(); // ✅ Re-fetch comments after submitting
    } catch {
      setError("Failed to post comment");
    }
  }

  function renderComments(comments: Comment[], level = 0) {
    return comments.map((comment) => (
      <div key={comment._id} style={{ marginLeft: level * 20 }}>
        <div className="p-2 border rounded mb-1">
          <p className="font-bold">{comment.author}</p>
          <p>
            {comment.redacted ? (
              <span className="text-gray-500 italic">[This comment has been redacted]</span>
            ) : (
              comment.text
            )}
          </p>
          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          {!comment.redacted && (
            <button onClick={() => setReplyTo(comment._id)} className="text-blue-500 text-sm">
              Reply
            </button>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
      </div>
    ));
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>{renderComments(comments)}</div>
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-4">
          {replyTo && <p className="mb-2 text-sm text-gray-600">Replying to comment {replyTo}</p>}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex items-center">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Post Comment
            </button>
            {replyTo && (
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="ml-2 text-sm text-gray-500 underline"
              >
                Cancel Reply
              </button>
            )}
          </div>
        </form>
      ) : (
        <p>
          <a
            href={`/admin/login?returnUrl=${encodeURIComponent(pathname)}`}
            className="text-blue-500 underline"
          >
            Login to comment
          </a>
        </p>
      )}
    </div>
  );
}
