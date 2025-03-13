import { notFound } from "next/navigation";
import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import CareerEntryForm from "@/components/admin/CareerEntryForm";
import { fetchCareerEntry } from "@/services/careerService";

export default async function EditCareerEntryPage({ params }: { params: Promise<{ id: string }> }) {
  await protectAdminRoute();

  const {id} = await params;
  // Verify entry exists server-side for SSR
  try {
    await fetchCareerEntry(id);
  } catch (error) {
    console.error("Failed to fetch career entry:", error);
    return notFound();
  }

  return (
    <AdminLayout>
      <CareerEntryForm initialId={id} />
    </AdminLayout>
  );
}
