"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/constants";
import { Comment } from "@/models/Comment";
import { fetchAllComments, redactComment } from "@/services/commentService";

export default function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function loadComments() {
      try {
        const data = await fetchAllComments();
        setComments(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch comments");
        }
      }
    }
    if (isAuthenticated) loadComments();
  }, [isAuthenticated]);

  const handleRedact = async (id: string) => {
    if (!confirm("Mark this comment as redacted?")) return;
    try {
      await redactComment(id);
      // Update the local state to mark the comment as redacted
      setComments(prev =>
        prev.map(c => (c._id === id ? { ...c, redacted: true } : c))
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to redact comment");
      }
    }
  };

  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!user?.isAdmin) return <p>Only admins can access this page.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Comments</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Author</th>
            <th className="border p-2 text-left">Comment</th>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">Status</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment._id} className="border">
              <td className="border p-2">{comment.author}</td>
              <td className="border p-2">{comment.text}</td>
              <td className="border p-2">
                {new Date(comment.createdAt).toLocaleString()}
              </td>
              <td className="border p-2">
                {comment.redacted ? "Redacted" : "Active"}
              </td>
              <td className="border p-2">
                {!comment.redacted && (
                  <button
                    onClick={() => handleRedact(comment._id)}
                    className="text-red-500 hover:underline"
                  >
                    Redact
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href={APP_ROUTES.admin.home} className="text-blue-500 underline mt-4 inline-block">
        Back to Dashboard
      </Link>
    </div>
  );
}
