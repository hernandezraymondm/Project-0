export function SystemHealth() {
  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
        <span className="font-medium">All Systems Operational</span>
      </div>
    </div>
  );
}
