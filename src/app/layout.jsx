import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";
import { SITE_URL } from "@/lib/jsonLd";

// SRRL station type system — see DESIGN.md. Both working faces carry Cyrillic
// so «гегемонія» and the log never fall back to the system font.
const display = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "900"],
  variable: "--font-display",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const DESCRIPTION =
  "SRRLOVYCH. hip-hop from uzhhorod, ukraine. hehemonia is out on spotify, apple music and youtube. one block of the town is under observation, and the log takes your line.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SRRLOVYCH · hip-hop from uzhhorod",
  description: DESCRIPTION,
  applicationName: "SRRLOVYCH",
  authors: [{ name: "SRRLOVYCH" }],
  keywords: [
    "SRRLOVYCH",
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
    siteName: "SRRLOVYCH",
    title: "SRRLOVYCH · hip-hop from uzhhorod",
    description: DESCRIPTION,
    locale: "en_US",
    images: [{ url: "/og-image.png", type: "image/png", alt: "SRRLOVYCH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SRRLOVYCH · hip-hop from uzhhorod",
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", alt: "SRRLOVYCH" }],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { title: "SRRLOVYCH", statusBarStyle: "black" },
  other: {
    "geo.region": "UA-21",
    "geo.placename": "Uzhhorod, Ukraine",
  },
};

export const viewport = {
  themeColor: "#0c0c0e",
  viewportFit: "cover",
};

// The MusicGroup JSON-LD lives on the home page (src/app/page.jsx): it is
// built from the same admin-editable links the station shows.

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
      className={`${display.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-mono">
        {children}
        <Analytics />
        <SpeedInsights />
        <ServiceWorker />
      </body>
    </html>
  );
};

export default RootLayout;
