import { redirect } from "next/navigation";
import { getAuthUser } from "@/services/authService";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default async function AnalyticsPage() {
  const { authenticated, user } = await getAuthUser();

  if (!authenticated || !user?.isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <AnalyticsDashboard />
    </div>
  );
}
