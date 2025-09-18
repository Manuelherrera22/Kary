import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-muted dark:bg-slate-700", className)}
      {...props} />)
  );
}

function SkeletonCard({ className, ...props }) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-white/10 dark:bg-slate-800/40 backdrop-blur-md shadow-lg border border-white/20 dark:border-slate-700/50",
        className
      )}
      {...props}
    >
      <div className="flex items-center mb-4">
        <Skeleton className="h-6 w-6 rounded-full mr-3" />
        <Skeleton className="h-5 w-2/3 rounded" />
      </div>
      <Skeleton className="h-4 w-full mb-2 rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
    </div>
  );
}

export { Skeleton, SkeletonCard };