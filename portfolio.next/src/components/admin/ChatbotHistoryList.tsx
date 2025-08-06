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
  responsePayload?: {
    fullResponse?: string;
    conversationContext?: {
      userQuery: string;
      chatHistory: any[];
      sessionId: string;
    };
  };
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
  const [selectedConversation, setSelectedConversation] = useState<ChatbotRequestLog | null>(null);
  const [showConversationModal, setShowConversationModal] = useState(false);

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

  const handleViewConversation = (log: ChatbotRequestLog) => {
    setSelectedConversation(log);
    setShowConversationModal(true);
  };

  const closeConversationModal = () => {
    setShowConversationModal(false);
    setSelectedConversation(null);
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
                     <div className="flex space-x-2">
                       {log.responsePayload?.fullResponse && (
                         <button
                           onClick={() => handleViewConversation(log)}
                           className="text-blue-600 hover:text-blue-900"
                         >
                           View
                         </button>
                       )}
                       <button
                         onClick={() => handleDelete(log._id)}
                         disabled={loading}
                         className="text-red-600 hover:text-red-900 disabled:opacity-50"
                       >
                         Delete
                       </button>
                     </div>
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

       {/* Conversation Modal */}
       {showConversationModal && selectedConversation && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold">Conversation Details</h2>
               <button
                 onClick={closeConversationModal}
                 className="text-gray-500 hover:text-gray-700"
               >
                 ✕
               </button>
             </div>
             
             <div className="space-y-4">
               {/* Request Details */}
               <div className="bg-gray-50 p-4 rounded">
                 <h3 className="font-semibold mb-2">Request Details</h3>
                 <div className="text-sm space-y-1">
                   <div><strong>IP:</strong> {selectedConversation.ip}</div>
                   <div><strong>Country:</strong> {selectedConversation.country || 'Unknown'}</div>
                   <div><strong>User Agent:</strong> {selectedConversation.userAgent || 'Unknown'}</div>
                   <div><strong>Timestamp:</strong> {formatDate(selectedConversation.createdAt)}</div>
                   <div><strong>Status:</strong> {selectedConversation.status}</div>
                 </div>
               </div>

               {/* User Query */}
               {selectedConversation.responsePayload?.conversationContext?.userQuery && (
                 <div className="bg-blue-50 p-4 rounded">
                   <h3 className="font-semibold mb-2">User Query</h3>
                   <div className="text-sm">
                     {selectedConversation.responsePayload.conversationContext.userQuery}
                   </div>
                 </div>
               )}

               {/* Chat History */}
               {selectedConversation.responsePayload?.conversationContext?.chatHistory && 
                selectedConversation.responsePayload.conversationContext.chatHistory.length > 0 && (
                 <div className="bg-yellow-50 p-4 rounded">
                   <h3 className="font-semibold mb-2">Previous Conversation History</h3>
                   <div className="text-sm space-y-2 max-h-40 overflow-y-auto">
                     {selectedConversation.responsePayload.conversationContext.chatHistory.map((msg, index) => (
                       <div key={index} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                         <div className="font-semibold text-xs">{msg.role === 'user' ? 'User' : 'AI'}:</div>
                         <div>{msg.text || msg.content}</div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* AI Response */}
               {selectedConversation.responsePayload?.fullResponse && (
                 <div className="bg-green-50 p-4 rounded">
                   <h3 className="font-semibold mb-2">AI Response</h3>
                   <div className="text-sm whitespace-pre-wrap">
                     {selectedConversation.responsePayload.fullResponse}
                   </div>
                 </div>
               )}

               {/* Error (if any) */}
               {selectedConversation.error && (
                 <div className="bg-red-50 p-4 rounded">
                   <h3 className="font-semibold mb-2 text-red-700">Error</h3>
                   <div className="text-sm text-red-700">
                     {selectedConversation.error}
                   </div>
                 </div>
               )}
             </div>
           </div>
         </div>
       )}
     </div>
   );
 } 