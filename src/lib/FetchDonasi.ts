import { Donasi } from "@/interface/donasi";

import axios from "axios";

export const fetchDonasiData = async (): Promise<Donasi[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/donasi`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      }
    );
    const data = response.data || [];
    return data;
  } catch (error) {
    console.error("Error fetching donasi data:", error);
    throw error;
  }
};

export const fetchDonasiBySlug = async (
  slug: string
): Promise<Donasi | null> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/donasi`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      }
    );
    const data: Donasi[] = response.data;
    const item = data.find((item) => item.slug === slug);
    return item || null;
  } catch (error) {
    console.error("Error fetching kaka saku by slug:", error);
    throw error;
  }
};
