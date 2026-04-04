export function Progress({ value = 0, className = "", ...props }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-muted ${className}`} {...props}>
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
