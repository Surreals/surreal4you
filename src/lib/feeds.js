// The four camera feeds of the station. Each one is a door into a window.
// Swap the photos here; everything else (OSD, log, keyboard) follows.
export const FEEDS = [
  {
    id: "music",
    cam: "cam-01",
    label: "music",
    title: "гегемонія",
    image: "/moodboard/hero.webp",
    alt: "Srrlovych sits in an empty blue pool behind red-and-white caution tape",
    key: "1",
  },
  {
    id: "merch",
    cam: "cam-02",
    label: "merch",
    title: "мерч",
    image: "/moodboard/car-street.webp",
    alt: "A silver Mercedes W211 parked on a cobbled street in front of a flower shop",
    key: "2",
  },
  {
    id: "archive",
    cam: "cam-03",
    label: "archive",
    title: "архів",
    image: "/moodboard/car-night.webp",
    alt: "The same Mercedes at night under a street lamp by an apartment block",
    key: "3",
  },
  {
    id: "subject",
    cam: "cam-04",
    label: "subject",
    title: "суб’єкт",
    image: "/moodboard/night.webp",
    alt: "Srrlovych smoking on a night street in Prague",
    key: "4",
  },
];

// Plates in the archive window. Tags read like evidence labels.
export const PLATES = [
  { src: "/moodboard/hero.webp", tag: "sub-01 · басейн", w: 1280, h: 960 },
  { src: "/hehemonia.png", tag: "obj · гегемонія", w: 1024, h: 1024 },
  { src: "/moodboard/night.webp", tag: "sub-01 · прага", w: 960, h: 1280 },
  { src: "/moodboard/car-night.webp", tag: "obj · w211 · ніч", w: 960, h: 1280 },
  { src: "/moodboard/car-street.webp", tag: "obj · w211 · квіти", w: 960, h: 1280 },
  { src: "/moodboard/car-field.webp", tag: "obj · w211 · поле", w: 1280, h: 960 },
  { src: "/moodboard/xray.webp", tag: "текстура · рентген", w: 1024, h: 1024 },
  { src: "/moodboard/chroma.webp", tag: "акцент · веселка", w: 1092, h: 1092 },
];

export const HQ = { city: "ужгород", lat: "48.62n", lon: "22.29e", tz: "Europe/Kyiv" };

// Lines the log writes on its own between real events. Lowercase, short,
// slightly off — the station is watching a world that is not quite right.
export const AMBIENT_LOG = [
  "рух виявлено · cam-03",
  "w211 залишив паркінг",
  "сигнал стабільний",
  "втрата кадру · відновлено",
  "хтось дивиться",
  "гегемонія · повторне відтворення",
  "туман над ужем",
  "плівка намотана",
  "суб’єкт у кадрі · cam-01",
  "суб’єкт вийшов з кадру",
  "ліхтар блимнув · cam-03",
  "стрічка натягнута",
  "нічого не сталося",
  "запис триває",
  "оператор відсутній",
  "кіт перетнув cam-02",
  "басейн порожній",
  "номер розмито",
  "веселка над дахом · cam-04",
  "перевірка часу · ок",
];

export const BOOT_LINES = [
  "srrl station",
  "cam-01 ok",
  "cam-02 ok",
  "cam-03 ok",
  "cam-04 ok",
  "uzh · 48.62n 22.29e",
];
