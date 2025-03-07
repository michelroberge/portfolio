import { redirect } from "next/navigation";
import { getAuthUser } from "@/services/authService";
import { getBlog } from "@/services/blogService";
import EditBlogEntry from "@/components/admin/EditBlogEntry";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  const user = await getAuthUser();
  
  if (!user || !user.isAdmin) {
    const baseAddress = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    redirect(`${baseAddress}/admin/login?returnUrl=%2Fadmin%2Fblogs%2Fedit%2F${params.id}`); // ✅ Redirect unauthorized users
  }

  const blog = await getBlog(id);
  if (!blog) redirect("/admin/blogs"); // ✅ Redirect if blog doesn't exist

  return <EditBlogEntry initialBlog={blog} />;
}
