export function SystemHealth() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
        <span className="font-medium">All Systems Operational</span>
      </div>
    </div>
  );
}
