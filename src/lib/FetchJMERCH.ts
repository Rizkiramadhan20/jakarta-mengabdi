import { JMerch, OnlineStore } from "@/interface/jmerch";

export const fetchJMerchData = async (): Promise<JMerch[]> => {
  try {
    // Skip fetch during build time if BASE_URL is not available
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn("NEXT_PUBLIC_BASE_URL not available during build time");
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/jmerch`,
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
    console.error("Error fetching jmerch data:", error);
    return [];
  }
};

export const fetchOnlineStoreData = async (): Promise<OnlineStore[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn("NEXT_PUBLIC_BASE_URL not available during build time");
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/jmerch/online-store`,
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
    console.error("Error fetching online store data:", error);
    return [];
  }
};
