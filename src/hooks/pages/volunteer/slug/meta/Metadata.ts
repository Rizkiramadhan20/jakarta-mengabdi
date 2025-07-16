import { Metadata } from "next";

import { Volunteer } from "@/interface/volunteer";

export async function getVolunteer(slug: string): Promise<Volunteer | null> {
  try {
    // Skip fetch during build time if BASE_URL is not available
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.warn("NEXT_PUBLIC_BASE_URL not available during build time");
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/volunteer`,
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

    const data: Volunteer[] = await response.json();

    // Find the specific item by slug
    const volunteerItem = data.find((item) => item.slug === slug);

    return volunteerItem || null;
  } catch (error) {
    console.error("Error fetching kaka saku:", error);
    // Return null instead of throwing to prevent build failures
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const volunteer = await getVolunteer(params.slug);

  if (!volunteer) {
    return {
      title: "Volunteer Not Found",
      description: "The requested Volunteer item could not be found.",
      openGraph: {
        title: "Volunteer Not Found",
        description: "The requested Volunteer item could not be found.",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "Volunteer Not Found",
        description: "The requested Volunteer item could not be found.",
      },
    };
  }

  const description = volunteer.detail || `Support ${volunteer.title}`;
  const imageUrl = volunteer.img_url
    ? Array.isArray(volunteer.img_url)
      ? volunteer.img_url[0]
      : volunteer.img_url
    : undefined;

  return {
    title: `Volunteer - ${volunteer.title}`,
    description: description,
    openGraph: {
      title: `Volunteer - ${volunteer.title}`,
      description: description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : [],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/volunteer/${volunteer.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Volunteer - ${volunteer.title}`,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/volunteer/${volunteer.slug}`,
    },
  };
}
