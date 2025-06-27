import { Metadata } from "next";

import { Donasi } from "@/interface/donasi";

export async function getDonasi(slug: string): Promise<Donasi | null> {
  try {
    // Skip fetch during build time if BASE_URL is not available
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn("NEXT_PUBLIC_BASE_URL not available during build time");
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/donasi`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
        // Remove next.revalidate to prevent build-time fetching
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: Donasi[] = await response.json();

    // Find the specific item by slug
    const donasiItem = data.find((item) => item.slug === slug);

    return donasiItem || null;
  } catch (error) {
    console.error("Error fetching donasi:", error);
    // Return null instead of throwing to prevent build failures
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const donasi = await getDonasi(params.slug);

  if (!donasi) {
    return {
      title: "Donasi Not Found",
      description: "The requested Donasi item could not be found.",
      openGraph: {
        title: "Donasi Not Found",
        description: "The requested Donasi item could not be found.",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Donasi Not Found",
        description: "The requested Donasi item could not be found.",
      },
    };
  }

  const description =
    donasi.description ||
    `Support ${donasi.title} - Target: ${donasi.target_amount.toLocaleString(
      "id-ID"
    )}`;
  const imageUrl = donasi.image_url
    ? Array.isArray(donasi.image_url)
      ? donasi.image_url[0]
      : donasi.image_url
    : undefined;

  return {
    title: `Donasi - ${donasi.title}`,
    description: description,
    openGraph: {
      title: `Donasi - ${donasi.title}`,
      description: description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : [],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/donasi/${donasi.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Donasi - ${donasi.title}`,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/donasi/${donasi.slug}`,
    },
  };
}
