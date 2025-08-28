import { Skeleton } from "./components/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 w-full h-full">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  )
}