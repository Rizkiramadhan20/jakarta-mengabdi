import { format } from "date-fns";

import { id } from "date-fns/locale";

/**
 * Format a date string or Date object to '20 Januari 2025, 14:30' (Indonesian locale)
 * @param dateStr string | Date
 * @returns string
 */
export function formatDateIndo(dateStr: string | Date): string {
  try {
    return format(new Date(dateStr), "d MMMM yyyy", { locale: id });
  } catch {
    return String(dateStr);
  }
}

/**
 * Format a time string or Date object to '15:00' format (HH:mm)
 * @param timeStr string | Date
 * @returns string
 */
export function formatTimeOnly(timeStr: string | Date): string {
  try {
    if (typeof timeStr === "string") {
      if (/^\d{2}:\d{2}$/.test(timeStr)) {
        return timeStr;
      }
      if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
        return timeStr.slice(0, 5);
      }
    }
    return format(new Date(timeStr), "HH:mm");
  } catch {
    return String(timeStr);
  }
}
