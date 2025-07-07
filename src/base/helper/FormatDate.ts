import { format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Format a date string or Date object to '20 Januari 2025' (Indonesian locale)
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
