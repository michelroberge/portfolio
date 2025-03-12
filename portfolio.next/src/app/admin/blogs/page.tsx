"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import BlogManagementPage from "@/components/admin/BlogManagementPage";

export default function AdminBlogPage() {
  return (
    <AdminLayout>
      <BlogManagementPage />
    </AdminLayout>
  );
}
