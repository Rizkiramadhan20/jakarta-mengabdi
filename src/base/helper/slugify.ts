export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan -
    .replace(/[^a-z0-9\-]/g, "") // Hapus karakter non-alfanumerik kecuali -
    .replace(/\-+/g, "-") // Ganti multiple - dengan single -
    .replace(/^-+|-+$/g, ""); // Hapus - di awal/akhir
}
