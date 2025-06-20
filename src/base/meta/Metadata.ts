const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f5f5f5",
};

export const metadata = {
  title: "Komunitas Pengabdian Masyarakat Jakarta - Jakarta Mengabdi",
  description:
    "Bergabunglah dengan gerakan sosial untuk membangun Jakarta yang lebih baik. Datang dari hati untuk masyarakat Jakarta.",
  authors: [{ name: "Rizki Ramadhan" }],
  creator: "Rizki Ramadhan",
  publisher: "Rizki Ramadhan",
  category: "Web Development",
  keywords: [
    "Full Stack Developer",
    "Freelancer",
    "Web Developer",
    "Web Design",
    "Web Development",
    "Leuwiliang Developer",
    "Bogor Web Developer",
    "Jawa Barat Developer",
    "Frontend Developer",
    "Backend Developer",
    "Portfolio Website",
  ],
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/png",
      },
      {
        url: "/favicon.ico",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon.ico",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
    appleTouchIcon: "/favicon.ico",
  },
  tags: [
    {
      name: "Rizki Ramadhan",
      content: "Full Stack Developer & Freelancer",
    },
  ],
  manifest: "/manifest.json",
  metadataBase: new URL(BASE_URL),
  canonical: BASE_URL,
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#f5f5f5",
    "application-name": "Rizki Ramadhan",
    "msapplication-tap-highlight": "no",
    "theme-color": "#f5f5f5",
  },
  openGraph: {
    type: "website",
    title: "Rizki Ramadhan - Full Stack Developer & Freelancer",
    description:
      "Full Stack Developer dan Freelancer profesional dari Leuwiliang, Kabupaten Bogor, Jawa Barat. Spesialis dalam pengembangan website modern, aplikasi web, dan solusi digital yang inovatif.",
    url: BASE_URL,
    siteName: "Rizki Ramadhan",
    locale: "id_ID",
    images: [
      {
        url: "/desktop.png",
        width: 1200,
        height: 630,
        alt: "Rizki Ramadhan - Full Stack Developer & Freelancer",
        type: "image/jpeg",
      },
    ],
    countryName: "Indonesia",
    emails: ["rr8027896@gmail.com"],
    phoneNumbers: ["+62-813-9863-2939"],
    streetAddress: "Leuwiliang, Kabupaten Bogor",
    postalCode: "16640",
    locality: "Leuwiliang",
    region: "Jawa Barat",
    country: "ID",
    profile: {
      firstName: "Rizki",
      lastName: "Ramadhan",
      username: "rizki_ramadhan",
      gender: "male",
    },
    article: {
      publishedTime: "2024-01-01T00:00:00+07:00",
      modifiedTime: "2024-03-19T00:00:00+07:00",
      section: "Web Development",
      tags: ["Full Stack Developer", "Freelancer", "Web Development"],
    },
    video: {
      url: `${BASE_URL}/video-preview.mp4`,
      type: "video/mp4",
      width: 1280,
      height: 720,
    },
    audio: {
      url: `${BASE_URL}/audio-preview.mp3`,
      type: "audio/mpeg",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizki Ramadhan - Full Stack Developer & Freelancer",
    description:
      "Full Stack Developer dan Freelancer profesional dari Leuwiliang, Kabupaten Bogor, Jawa Barat. Spesialis dalam pengembangan website modern, aplikasi web, dan solusi digital yang inovatif.",
    creator: "@rizki_ramadhan",
    site: "@rizki_ramadhan",
    images: ["/og-image.jpg"],
  },
  //   verification: {
  //     google: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_ID,
  //     googleTagManager: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
  //     yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  //     bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  //   },
  //   robots: {
  //     index: true,
  //     follow: true,
  //     nocache: false,
  //     googleBot: {
  //       index: true,
  //       follow: true,
  //       "max-video-preview": -1,
  //       "max-image-preview": "large",
  //       "max-snippet": -1,
  //     },
  //   },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "id-ID": BASE_URL,
    },
  },
};

export default metadata;
