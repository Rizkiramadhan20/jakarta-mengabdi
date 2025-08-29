import { Metadata } from "next";

import { KakaSaku } from "@/interface/kakaSaku";

export async function getKakaSaku(slug: string): Promise<KakaSaku | null> {
  try {
    // Skip fetch during build time if BASE_URL is not available
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      return null;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/kakasaku`,
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

    const data: KakaSaku[] = await response.json();

    // Find the specific item by slug
    const kakaSakuItem = data.find((item) => item.slug === slug);

    return kakaSakuItem || null;
  } catch (error) {
    // Return null instead of throwing to prevent build failures
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const kakaSaku = await getKakaSaku(params.slug);

  if (!kakaSaku) {
    return {
      title: "KakaSaku Not Found",
      description: "The requested KakaSaku item could not be found.",
      openGraph: {
        title: "KakaSaku Not Found",
        description: "The requested KakaSaku item could not be found.",
        type: "website",
      },
      twitter: {
        card: "summary",
        title: "KakaSaku Not Found",
        description: "The requested KakaSaku item could not be found.",
      },
    };
  }

  const description =
    kakaSaku.description ||
    `Support ${
      kakaSaku.title
    } - Target: ${kakaSaku.target_amount.toLocaleString("id-ID")}`;
  const imageUrl = kakaSaku.image_url
    ? Array.isArray(kakaSaku.image_url)
      ? kakaSaku.image_url[0]
      : kakaSaku.image_url
    : undefined;

  return {
    title: `KakaSaku - ${kakaSaku.title}`,
    description: description,
    openGraph: {
      title: `KakaSaku - ${kakaSaku.title}`,
      description: description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl }] : [],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/donasi/${kakaSaku.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `KakaSaku - ${kakaSaku.title}`,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/donasi/${kakaSaku.slug}`,
    },
  };
}
