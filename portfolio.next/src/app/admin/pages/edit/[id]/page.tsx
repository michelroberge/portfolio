// portfolio.next/src/app/admin/pages/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditPage from "@/components/admin/EditPage";
import { fetchPageBySlug } from "@/services/pageService";
import { Page } from "@/models/Page";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  // This will automatically redirect if not authenticated or not admin
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  const { id } = await params;
  if (!id) return notFound();

  try {
    // Fetch page data server-side for SSR
    let page : Page | undefined = undefined;
    if ( id != 'new'){
      page = await fetchPageBySlug(id, true, cookieHeader);
      if (!page) return notFound();
    }


    return (
      <AdminLayout>
        <EditPage initialPage={page} />
      </AdminLayout>
    );
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return notFound();
  }
}
