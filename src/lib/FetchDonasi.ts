import { Donasi } from "@/interface/donasi";

export const fetchDonasiData = async (): Promise<Donasi[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/donasi`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        next: {
          revalidate: 5, // Validasi ulang setiap 5 detik
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data || []; // Return data directly, with fallback to empty array
  } catch (error) {
    console.error("Error fetching donasi data:", error);
    throw error;
  }
};

export const fetchDonasiBySlug = async (
  slug: string
): Promise<Donasi | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/donasi`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        next: {
          revalidate: 5,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: Donasi[] = await response.json();
    const donasi = data.find((item) => item.slug === slug);
    return donasi || null;
  } catch (error) {
    console.error("Error fetching donasi by slug:", error);
    throw error;
  }
};
