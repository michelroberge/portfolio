import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import CareerTimelineManager from "@/components/admin/CareerTimelineManager";
import { fetchCareerTimeline } from "@/services/careerService";

export default async function CareerTimelinePage() {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  
  // Fetch career timeline server-side for SSR
  const timeline = await fetchCareerTimeline(true, cookieHeader);

  return (
    <AdminLayout>
      <CareerTimelineManager initialTimeline={timeline} cookieHeader={cookieHeader} />
    </AdminLayout>
  );
}
