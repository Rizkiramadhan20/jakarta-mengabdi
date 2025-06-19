export function formatIDR(value: number) {
  if (!value) return "";
  return value.toLocaleString("id-ID");
}
