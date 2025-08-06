import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import ChatbotHistoryList from "@/components/admin/ChatbotHistoryList";
import { fetchChatbotHistory } from "@/services/chatbotHistoryService";


export default async function AdminChatbotHistoryPage() {
  // This will automatically redirect if not authenticated or not admin
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  // Fetch chatbot history server-side for SSR
  const history = await fetchChatbotHistory(1, 50, cookieHeader);
  
  return (
    <AdminLayout>
      <ChatbotHistoryList initialHistory={history} />
    </AdminLayout>
  );
} 