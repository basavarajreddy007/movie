const MovieCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#121625] border border-slate-200 dark:border-white/10 shadow-sm">
      <div className="aspect-[2/3] animate-pulse bg-slate-200 dark:bg-[#0F1322]" />

      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;