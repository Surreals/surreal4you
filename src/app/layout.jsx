import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Unbounded, JetBrains_Mono, Rock_Salt } from "next/font/google";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";

// SRRL station type system — see DESIGN.md. Both working faces carry Cyrillic
// so «гегемонія» and the log never fall back to the system font.
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "900"],
  variable: "--font-unbounded",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});
const rockSalt = Rock_Salt({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rock-salt",
  display: "swap",
});

const SITE_URL = "https://surreal4you.com";
const DESCRIPTION =
  "Srrlovych makes hip-hop in Uzhhorod, Ukraine. The album HEHEMONIA is out on Spotify, Apple Music and YouTube. This site is a night-watch station: four cameras on the music, the merch, the archive and the man himself, plus a log you can write into.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Srrlovych - Hip-Hop Artist | Official Website",
  description: DESCRIPTION,
  applicationName: "Srrlovych",
  authors: [{ name: "Srrlovych" }],
  keywords: [
    "Srrlovych",
    "Srrl",
    "surrealovych",
    "surreal4you",
    "HEHEMONIA",
    "гегемонія",
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
    siteName: "Srrlovych",
    title: "Srrlovych - Hip-Hop Artist | Official Website",
    description: DESCRIPTION,
    locale: "en_US",
    images: [{ url: "/og-image.png", type: "image/png", alt: "Srrlovych - Hip-Hop Artist" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Srrlovych - Hip-Hop Artist | Official Website",
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", alt: "Srrlovych - Hip-Hop Artist" }],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { title: "Srrlovych", statusBarStyle: "black" },
  other: {
    "geo.region": "UA-21",
    "geo.placename": "Uzhhorod, Ukraine",
  },
};

export const viewport = {
  themeColor: "#0c0c0e",
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "@id": `${SITE_URL}/#artist`,
  name: "Srrlovych",
  alternateName: ["Srrl", "surrealovych"],
  description: "Hip-hop artist from Uzhhorod, Ukraine. Album: HEHEMONIA.",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og-image.png`,
  genre: ["Hip-Hop", "Rap"],
  foundingLocation: { "@type": "City", name: "Uzhhorod", addressCountry: "UA" },
  sameAs: [
    "https://open.spotify.com/artist/0cpL1ooyiyxpJ4KRz8ILWW",
    "https://music.apple.com/us/artist/surreal/1631369195",
    "https://www.youtube.com/channel/UCK4Jk9WTq1hlpt5s6nWnuZA",
    "https://www.instagram.com/surrealovych/",
    "https://www.tiktok.com/@surrealovych",
    "https://t.me/surreal4you",
  ],
};

// The theme is resolved before paint from the saved choice or Uzhhorod's
// clock, so a day-time visitor never sees the night palette flash first.
const themeScript =
  "(function(){try{var s=localStorage.getItem('srrl-theme');" +
  "var h=+new Intl.DateTimeFormat('en-GB',{hour:'2-digit',hour12:false,timeZone:'Europe/Kyiv'}).format(new Date());" +
  "var t=(s==='day'||s==='night')?s:(h>=7&&h<19?'day':'night');" +
  "document.documentElement.dataset.theme=t;}catch(e){}})();";

const RootLayout = ({ children }) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${unbounded.variable} ${jetbrains.variable} ${rockSalt.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-mono">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
        <ServiceWorker />
      </body>
    </html>
  );
};

export default RootLayout;
