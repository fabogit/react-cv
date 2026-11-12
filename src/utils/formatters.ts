/**
 * Formats a CV date into a human-readable string.
 * Supports single date strings, single-item arrays, or range arrays.
 * Filters empty or whitespace-only segments and joins multi-item ranges consistently.
 *
 * @param date - The date value as a string or array of strings.
 * @returns Formatted date string (e.g., "2022-07 - 2024-05" or "2019").
 */
export const formatCvDate = (date: string[] | string): string => {
  if (Array.isArray(date)) {
    const segments = date
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (segments.length === 0) {
      return "";
    }
    if (segments.length === 1) {
      return segments[0] ?? "";
    }
    return segments.join(" - ");
  }
  return typeof date === "string" ? date.trim() : "";
};

/**
 * Formats a Date object as YYYY-MM-DD in the local timezone.
 * Avoids UTC off-by-one errors caused by toISOString().
 *
 * @param date - Optional Date instance (defaults to current date).
 * @returns Local ISO date string (YYYY-MM-DD).
 */
export const formatLocalIsoDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
