"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteChatbotRequestLog, fetchChatbotHistory } from "@/services/chatbotHistoryService";

interface ChatbotRequestLog {
  _id: string;
  ip: string;
  country?: string;
  userAgent?: string;
  origin?: string;
  referer?: string;
  host?: string;
  requestPayload: any;
  responsePayload?: any;
  status: "success" | "error" | "blocked" | "other";
  error?: string;
  blacklisted: boolean;
  whitelisted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatbotHistoryListProps {
  initialHistory: {
    logs: ChatbotRequestLog[];
    total: number;
    page: number;
    limit: number;
  };
}

export default function ChatbotHistoryList({ initialHistory }: ChatbotHistoryListProps) {
  const router = useRouter();
  const [history, setHistory] = useState(initialHistory);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this log entry?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteChatbotRequestLog(id);

      // Remove the deleted item from the list
      setHistory(prev => ({
        ...prev,
        logs: prev.logs.filter(log => log._id !== id),
        total: prev.total - 1
      }));
    } catch (error) {
      console.error("Failed to delete log entry:", error);
      alert("Failed to delete log entry");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      setLoading(true);
      const newHistory = await fetchChatbotHistory(page, history.limit);
      setHistory(newHistory);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      alert("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600";
      case "error": return "text-red-600";
      case "blocked": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const totalPages = Math.ceil(history.total / history.limit);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chatbot Request History</h1>
        <div className="text-sm text-gray-500">
          Total: {history.total} entries
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP / Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{log.ip}</div>
                    {log.country && (
                      <div className="text-xs text-gray-500">{log.country}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    {log.blacklisted && (
                      <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        BL
                      </span>
                    )}
                    {log.whitelisted && (
                      <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        WL
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      {log.requestPayload?.message || log.requestPayload?.query || 
                       truncateText(JSON.stringify(log.requestPayload), 80)}
                    </div>
                    {log.error && (
                      <div className="text-xs text-red-500 mt-1">
                        {truncateText(log.error, 60)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      {log.userAgent ? truncateText(log.userAgent, 60) : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(log._id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => handlePageChange(history.page - 1)}
              disabled={history.page <= 1 || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {history.page} of {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(history.page + 1)}
              disabled={history.page >= totalPages || loading}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 