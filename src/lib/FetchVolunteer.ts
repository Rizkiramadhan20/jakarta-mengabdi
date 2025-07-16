import { Volunteer } from "@/interface/volunteer";

export const fetchVolunteerData = async (): Promise<Volunteer[]> => {
  try {
    // Skip fetch during build time if BASE_URL is not available
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn("NEXT_PUBLIC_BASE_URL not available during build time");
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/volunteer`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        next: { revalidate: 5 },
      }
    );
    2 + 41;

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching volunteer data:", error);
    return [];
  }
};

export const fetchVolunteerBySlug = async (
  slug: string
): Promise<Volunteer | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/volunteer/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: Volunteer = await response.json();

    return data || null;
  } catch (error) {
    console.error("Error fetching volunteer by slug:", error);
    // Return null instead of throwing to prevent build failures
    return null;
  }
};
