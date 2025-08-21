import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const CANONICAL_URL = BASE_URL ? `${BASE_URL}/donasi` : "/donasi";
const OG_IMAGE = "/logo.png";

export const donasiMetadata: Metadata = {
  title: "Donasi - Jakarta Mengabdi",
  description:
    "Dukung program Jakarta Mengabdi untuk membantu masyarakat Jakarta. Salurkan donasi Anda dengan aman, transparan, dan berdampak.",
  keywords: [
    "donasi Jakarta",
    "Jakarta Mengabdi",
    "sedekah",
    "zakat",
    "infaq",
    "bantu sesama",
    "program sosial",
    "pengabdian masyarakat",
    "galang dana",
  ],
  alternates: {
    canonical: CANONICAL_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Donasi - Jakarta Mengabdi",
    description:
      "Salurkan donasi Anda untuk mendukung program sosial Jakarta Mengabdi yang berdampak nyata bagi warga Jakarta.",
    type: "website",
    locale: "id_ID",
    siteName: "Jakarta Mengabdi",
    url: CANONICAL_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Jakarta Mengabdi - Donasi",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Donasi - Jakarta Mengabdi",
    description:
      "Dukung Jakarta Mengabdi dengan donasi terbaik Anda. Aman dan transparan.",
    images: [OG_IMAGE],
  },
};
