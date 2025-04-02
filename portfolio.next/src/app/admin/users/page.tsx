import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import UserList from "@/components/admin/UserList";
import { fetchUsers } from "@/services/userService";

export default async function UserManagementPage() {
  // This will automatically redirect if not authenticated or not admin
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  // Fetch users server-side for SSR
  const users = await fetchUsers(true, cookieHeader);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <UserList initialUsers={users} currentUserId={user?._id || ''} />
      </div>
    </AdminLayout>
  );
}
