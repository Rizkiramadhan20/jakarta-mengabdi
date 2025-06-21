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
    return data.data;
  } catch (error) {
    console.error("Error fetching donasi data:", error);
    throw error;
  }
};
