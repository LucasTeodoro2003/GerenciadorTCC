import { SkeletonCalendar, SkeletonExpense } from "@/shared/ui/skeletonCards";

export default function Loading() {
  return (
    <div className="w-full h-screen p-4">
      <SkeletonExpense />
    </div>
  );
}
