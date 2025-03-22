import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import CommentsList from "@/components/admin/CommentsList";
import { fetchAllComments } from "@/services/commentService";

export default async function CommentsManagementPage() {

  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  const comments = await fetchAllComments(true, cookieHeader);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Comments Management</h1>
        <CommentsList initialComments={comments} cookieHeader={cookieHeader} />
      </div>
    </AdminLayout>
  );
}
