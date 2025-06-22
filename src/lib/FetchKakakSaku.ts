import { KakaSaku } from "@/interface/kakaSaku";

export const fetchKakakSakuData = async (): Promise<KakaSaku[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/kakasaku`,
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
    console.error("Error fetching kaka saku data:", error);
    throw error;
  }
};
