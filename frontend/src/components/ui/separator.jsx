export function Separator({ className = "", orientation = "horizontal", decorative = true, ...props }) {
  return orientation === "vertical" ? (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation="vertical"
      className={`shrink-0 bg-border h-full w-px ${className}`}
      {...props}
    />
  ) : (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation="horizontal"
      className={`shrink-0 bg-border h-px w-full ${className}`}
      {...props}
    />
  );
}
