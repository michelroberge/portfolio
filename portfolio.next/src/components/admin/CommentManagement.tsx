"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/constants";

interface Comment {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
  redacted: boolean;
  replies: Comment[];
}

export default function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      setLoading(true);
      const res = await fetch(`${API_ENDPOINTS.admin.comments}/all`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err: unknown) {
      console.error('Failed to fetch comments:', err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleRedact = async (id: string) => {
    if (!confirm("Mark this comment as redacted?")) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.admin.comments}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Redaction failed");
      // Update the local state to mark the comment as redacted.
      setComments(prev =>
        prev.map(c => (c._id === id ? { ...c, redacted: true } : c))
      );
    } catch (err: unknown) {
      console.error('Failed to redact comment:', err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
      <Link href="/admin" className="text-blue-500 underline mt-4 inline-block">
        Back to Dashboard
      </Link>
    </div>
  );
}
