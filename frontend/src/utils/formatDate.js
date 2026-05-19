import { format, formatDistanceToNow, intervalToDuration } from "date-fns";

export function formatDate(date) {
  if (!date) return "—";
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date) {
  if (!date) return "—";
  return format(new Date(date), "MMM d, yyyy · h:mm a");
}

export function formatRelative(date) {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export { formatScore, getRankLabel } from "./formatScore";

export function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const d = intervalToDuration({ start: 0, end: seconds * 1000 });
  const h = d.hours || 0;
  const m = String(d.minutes || 0).padStart(2, "0");
  const s = String(d.seconds || 0).padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

/** Format when value is stored in minutes (webinars, etc.) */
export function formatDurationMinutes(minutes) {
  if (!minutes) return "0:00";
  return formatDuration(Math.round(Number(minutes) * 60));
}
