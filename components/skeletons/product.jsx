import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col items-start space-y-4 p-4 border rounded-md shadow-md">
      <Skeleton className="h-48 w-48 rounded-md" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
