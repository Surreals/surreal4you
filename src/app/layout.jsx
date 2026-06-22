import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const SITE_URL = "https://surreal4you.com";
const DESCRIPTION =
  "Official website of Srrl, a hip-hop artist from Uzhhorod, Ukraine. New album HEHEMONIA out now. Stream Srrl on Spotify, Apple Music, YouTube, Instagram, TikTok, and Telegram.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Srrl - Hip-Hop Artist | Official Website",
  description: DESCRIPTION,
  applicationName: "Srrl",
  authors: [{ name: "Srrl" }],
  keywords: [
    "Srrl",
    "surrealovych",
    "surreal4you",
    "HEHEMONIA",
    "hip-hop",
    "rap",
    "Ukraine",
    "Uzhhorod",
    "Ukrainian hip-hop",
    "Ukrainian rapper",
    "Ukrainian music",
    "Spotify",
    "Apple Music",
    "YouTube",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "profile",
    username: "surrealovych",
    url: SITE_URL,
    siteName: "Srrl",
    title: "Srrl - Hip-Hop Artist | Official Website",
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        type: "image/png",
        alt: "Srrl - Hip-Hop Artist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srrl - Hip-Hop Artist | Official Website",
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", alt: "Srrl - Hip-Hop Artist" }],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "geo.region": "UA-21",
    "geo.placename": "Uzhhorod, Ukraine",
  },
};

export const viewport = {
  themeColor: "#000000",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "@id": `${SITE_URL}/#artist`,
  name: "Srrl",
  alternateName: "surrealovych",
  description: "Hip-hop artist from Uzhhorod, Ukraine",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.png`,
  genre: ["Hip-Hop", "Rap"],
  foundingLocation: {
    "@type": "City",
    name: "Uzhhorod",
    addressCountry: "UA",
  },
  sameAs: [
    "https://open.spotify.com/artist/0cpL1ooyiyxpJ4KRz8ILWW",
    "https://music.apple.com/us/artist/surreal/1631369195",
    "https://www.youtube.com/channel/UCK4Jk9WTq1hlpt5s6nWnuZA",
    "https://www.instagram.com/surrealovych/",
    "https://www.tiktok.com/@surrealovych",
    "https://t.me/surrealenko",
  ],
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className="font-sans">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
