// portfolio.next/src/app/admin/comments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

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
  const { isAuthenticated, user } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`${apiUrl}/api/comments/all`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err: unknown) { // ✅ Use unknown instead of any
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }
    if (isAuthenticated) fetchComments();
  }, [isAuthenticated, apiUrl]);

  const handleRedact = async (id: string) => {
    if (!confirm("Mark this comment as redacted?")) return;
    try {
      const res = await fetch(`${apiUrl}/api/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Redaction failed");
      // Update the local state to mark the comment as redacted.
      setComments(prev =>
        prev.map(c => (c._id === id ? { ...c, redacted: true } : c))
      );
    } catch (err: unknown) { // ✅ Use unknown instead of any
      if (err instanceof Error) {
        setError(err.message);
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
      <Link href="/admin" className="text-blue-500 underline mt-4 inline-block">
        Back to Dashboard
      </Link>
    </div>
  );
}
