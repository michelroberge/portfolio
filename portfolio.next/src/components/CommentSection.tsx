"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
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
  const { isAuthenticated } = useAuth();

  const pathname = usePathname();
  
  async function fetchComments() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/blog/${blogId}`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        // console.error("Expected an array of comments, but got:", data);
        setComments([]);
      } else {
        setComments(data);
      }
    } catch {
      setError("Failed to load comments");
    }
  }

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensures auth cookie is sent
        body: JSON.stringify({
          author: "CurrentUser", // Replace with actual user context
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
      fetchComments();
    } catch {
      setError("Failed to post comment");
    }
  }

  function renderComments(comments: Comment[], level = 0) {
    return comments.map((comment) => (
      <div key={comment._id} style={{ marginLeft: level * 20 }}>
        <div className="p-2 border rounded mb-1">
          <p className="font-bold">{comment.author}</p>
          <p>{comment.text}</p>
          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          <button onClick={() => setReplyTo(comment._id)} className="text-blue-500 text-sm">Reply</button>
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
          <a href={`/admin/login?returnUrl=${encodeURIComponent(window.location.href )}`} className="text-blue-500 underline">
          Login to comment
          </a>
        </p>
      )}
    </div>
  );
}
