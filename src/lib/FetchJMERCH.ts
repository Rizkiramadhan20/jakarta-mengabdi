import { Category } from "@/interface/products";

export const fetchProductscategoryData = async (): Promise<Category[]> => {
  try {
    // Lewati pengambilan selama waktu pembuatan jika BASE_URL tidak tersedia
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn(
        "NEXT_PUBLIC_BASE_URL tidak tersedia selama waktu pembangunan"
      );
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/products-category`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        // Tambahkan validasi ulang hanya jika tidak dalam mode pembuatan
        ...(process.env.NODE_ENV !== "production" && {
          next: {
            revalidate: 5, // Validasi ulang setiap 5 detik
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data || []; // Mengembalikan data secara langsung, dengan fallback ke array kosong
  } catch (error) {
    console.error("Error fetching products category data:", error);
    return [];
  }
};
