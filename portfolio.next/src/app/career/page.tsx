export const dynamic = 'force-dynamic';
import CareerTimeline from "@/components/CareerTimeline";

export default function CareerPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Career Timeline</h1>
      <CareerTimeline />
    </div>
  );
}
