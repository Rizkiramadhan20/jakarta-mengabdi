export function formatIDR(value: number) {
  if (value == null) return "";
  return value.toLocaleString("id-ID");
}

export function getRawNumberFromIDR(value: string) {
  // Hapus semua karakter selain angka
  return value.replace(/[^\d]/g, "");
}
