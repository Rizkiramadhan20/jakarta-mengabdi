import { KakaSaku } from "@/interface/kakaSaku";

export const fetchKakakSakuData = async (): Promise<KakaSaku[]> => {
  try {
    // Lewati pengambilan selama waktu pembuatan jika BASE_URL tidak tersedia
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn(
        "NEXT_PUBLIC_BASE_URL tidak tersedia selama waktu pembangunan"
      );
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/kakasaku`,
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
    console.error("Error fetching kaka saku data:", error);
    return [];
  }
};

export const fetchKakaSakuBySlug = async (
  slug: string
): Promise<KakaSaku | null> => {
  try {
    // Lewati pengambilan selama waktu pembuatan jika BASE_URL tidak tersedia
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn(
        "NEXT_PUBLIC_BASE_URL tidak tersedia selama waktu pembangunan"
      );
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/kakasaku/${slug}`,
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

    const data: KakaSaku = await response.json();

    return data || null;
  } catch (error) {
    console.error("Error fetching kaka saku by slug:", error);
    // Return null instead of throwing to prevent build failures
    return null;
  }
};
