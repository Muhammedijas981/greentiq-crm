import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type: 'card' | 'table-row' | 'form';
  count?: number;
}

export default function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl bg-[#1e293b]" />
        ))}
      </div>
    );
  }
  
  if (type === 'table-row') {
    return (
      <div className="w-full space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-[#1e293b]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4 bg-[#1e293b]" />
          <Skeleton className="h-10 w-full bg-[#1e293b]" />
        </div>
      ))}
    </div>
  );
}
