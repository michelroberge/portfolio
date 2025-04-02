"use client";

import { useState } from "react";
import { Comment } from "@/models/Comment";
import { redactComment } from "@/services/commentService";

interface CommentsListProps {
  initialComments: Comment[];
  cookieHeader?: string;
}

export default function CommentsList({ initialComments, cookieHeader }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [error, setError] = useState<string | null>(null);

  async function handleRedact(id: string) {
    if (!confirm("Are you sure you want to redact this comment? This action cannot be undone.")) return;
    try {
      await redactComment(id, true, cookieHeader || null);
      setComments(comments.map(comment => 
        comment._id === id ? { ...comment, redacted: true } : comment
      ));
    } catch (err) {
      console.error('Failed to redact comment:', err);
      setError("Failed to redact comment");
    }
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <p className={`text-gray-600 ${comment.redacted ? 'italic text-gray-400' : ''}`}>
                {comment.redacted ? '[Content redacted]' : comment.text}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                By: {comment.author || 'Anonymous'} | 
                Posted: {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  <p className="text-sm font-medium text-gray-600">Replies:</p>
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-gray-50 p-2 rounded">
                      <p className={`text-sm ${reply.redacted ? 'italic text-gray-400' : ''}`}>
                        {reply.redacted ? '[Content redacted]' : reply.text}
                      </p>
                      <p className="text-xs text-gray-500">
                        By: {reply.author || 'Anonymous'} | 
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="ml-4">
              {!comment.redacted && (
                <button 
                  onClick={() => handleRedact(comment._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Redact
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {comments.length === 0 && (
        <p className="text-gray-500 text-center">No comments to display</p>
      )}
    </div>
  );
}
