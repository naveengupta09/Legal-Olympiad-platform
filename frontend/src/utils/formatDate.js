import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = typeof value === "string" ? parseISO(value) : new Date(value);
  return isValid(parsed) ? parsed : null;
};

export function formatDate(value) {
  const date = toDate(value);
  return date ? format(date, "MMM d, yyyy") : "—";
}

export function formatDateTime(value) {
  const date = toDate(value);
  return date ? format(date, "MMM d, yyyy, h:mm a") : "—";
}

export function formatRelative(value) {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : "—";
}

export function formatDuration(value) {
  if (value === null || value === undefined || value === "") return "—";
  const totalMinutes = Number(value);
  if (Number.isNaN(totalMinutes)) return String(value);
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function formatScore(value) {
  if (value === null || value === undefined || value === "") return "0";
  return Number(value).toLocaleString();
}
