import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import CareerTimelineManager from "@/components/admin/CareerTimelineManager";

export default async function CareerTimelinePage() {
  await protectAdminRoute();

  return (
    <AdminLayout>
      <CareerTimelineManager />
    </AdminLayout>
  );
}
