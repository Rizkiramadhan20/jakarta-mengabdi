import { KakaSaku } from "@/interface/kakaSaku";

export const fetchKakakSakuData = async (): Promise<KakaSaku[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/kakasaku`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        next: { revalidate: 5 },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    return [];
  }
};

export const fetchKakaSakuBySlug = async (
  slug: string
): Promise<KakaSaku | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/kakasaku/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: KakaSaku = await response.json();

    return data || null;
  } catch (error) {
    // Return null instead of throwing to prevent build failures
    return null;
  }
};
