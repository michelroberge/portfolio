import { protectAdminRoute } from "@/lib/auth";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default async function Analytics() {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <AnalyticsDashboard />
    </div>
  );
}
