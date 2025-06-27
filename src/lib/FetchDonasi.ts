import { Donasi } from "@/interface/donasi";

export const fetchDonasiData = async (): Promise<Donasi[]> => {
  try {
    // Skip fetch during build time if BASE_URL is not available
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn("NEXT_PUBLIC_BASE_URL not available during build time");
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/donasi`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        // Only add revalidate if not in build mode
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
    return data || [];
  } catch (error) {
    console.error("Error fetching donasi data:", error);
    // Return empty array instead of throwing to prevent build failures
    return [];
  }
};

export const fetchDonasiBySlug = async (
  slug: string
): Promise<Donasi | null> => {
  try {
    // Skip fetch during build time if BASE_URL is not available
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn("NEXT_PUBLIC_BASE_URL not available during build time");
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/donasi/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        // Only add revalidate if not in build mode
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

    const data: Donasi = await response.json();

    return data || null;
  } catch (error) {
    console.error("Error fetching donasi by slug:", error);
    // Return null instead of throwing to prevent build failures
    return null;
  }
};
