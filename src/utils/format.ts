// src/utils/formatters.ts

// 🔹 Format date to readable string
export function formatDate(date?: string | number | Date): string {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// 🔹 Truncate text safely
export function truncateText(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

// 🔹 Capitalize words
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
