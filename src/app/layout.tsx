import { metadata } from "@/base/meta/Metadata"

export { metadata };

import "./globals.css";

import Providers from "@/base/router/Provider";

import Pathname from "@/base/router/Pathname";

metadata.manifest = "/manifest.json";

import { poppins } from "@/base/fonts/Fonts"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Providers>
          <Pathname>
            {children}
          </Pathname>
        </Providers>
      </body>
    </html>
  );
}