import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import PagesList from "@/components/admin/PagesList";
import {Page} from '@/models/Page'
import { fetchPages } from "@/services/pageService";

interface PageContentProps {
  pages: Page[];
  cookieHeader: string;
}

const PageContent = ({ pages, cookieHeader }: PageContentProps) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pages Management</h1>
      <PagesList initialPages={pages} cookieHeader={cookieHeader} />
    </div>
  );
};

export default async function PagesManagementPage() {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  
  // Fetch pages server-side for SSR
  const pages = await fetchPages(true, cookieHeader);

  return (
    <AdminLayout>
      <PageContent pages={pages} cookieHeader={cookieHeader} />
    </AdminLayout>
  );
}
