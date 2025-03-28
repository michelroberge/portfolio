import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import CareerEntryForm from "@/components/admin/CareerEntryForm";

export default async function AddCareerEntryPage() {
  await protectAdminRoute();

  // Verify entry exists server-side for SSR
  return (
    <AdminLayout>
      <CareerEntryForm initialId={"new"} />
    </AdminLayout>
  );
}
