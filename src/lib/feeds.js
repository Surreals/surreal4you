// The four camera feeds of the station. Each one is a door into a window.
// `scene` is the OSD location tag; `title` is the big word on the tile
// (music takes the album title from content instead); `clip` is a few
// seconds of webm cut from the Petlura video that loops on the tile.
// `offline` is what the tile shows while that section is switched off.
export const FEEDS = [
  {
    id: "music",
    cam: "cam-01",
    label: "music",
    scene: "road · carpathians",
    title: null,
    image: "/photos/cam-road.webp",
    clip: "/photos/clip-road.webm",
    alt: "Srrlovych crouches on a mountain road next to a red chevron sign",
    key: "1",
  },
  {
    id: "merch",
    cam: "cam-02",
    label: "merch",
    scene: "stage · blue",
    title: "merch",
    image: "/photos/cam-stage.webp",
    clip: "/photos/clip-stage.webm",
    alt: "Srrlovych on stage under blue light, hair over his face, microphone in hand",
    key: "2",
    offline: {
      scene: "offline",
      image: "/photos/testcard.svg",
      clip: null,
      alt: "Test card: no signal",
    },
  },
  {
    id: "archive",
    cam: "cam-03",
    label: "archive",
    scene: "studio · dark",
    title: "archive",
    image: "/photos/cam-studio.webp",
    clip: "/photos/clip-studio.webm",
    alt: "A dark rehearsal room seen from a high corner, one figure moving",
    key: "3",
  },
  {
    id: "subject",
    cam: "cam-04",
    label: "subject",
    scene: "close-up",
    title: "subject",
    image: "/photos/cam-portrait.webp",
    clip: "/photos/clip-portrait.webm",
    alt: "Close-up of Srrlovych in sunglasses and a pearl necklace, hills behind",
    key: "4",
  },
];

// Plates in the archive window. Tags read like evidence labels: sub = the
// subject, obj = an object, rel = a release.
export const PLATES = [
  { src: "/photos/cam-road-sign.webp", tag: "sub-01 · road", w: 1600, h: 900 },
  { src: "/hehemonia.png", tag: "rel · hehemonia", w: 1024, h: 1024 },
  { src: "/photos/cam-green-room.webp", tag: "sub-01 · green room", w: 1600, h: 900 },
  { src: "/photos/cover-petlura.webp", tag: "rel · petlura", w: 1000, h: 1000 },
  { src: "/photos/cam-studio.webp", tag: "obj · studio · cam", w: 1600, h: 900 },
  { src: "/photos/stage-blue.webp", tag: "sub-01 · stage", w: 1400, h: 788 },
  { src: "/photos/cover-playa.webp", tag: "rel · playa", w: 1000, h: 1000 },
  { src: "/moodboard/hero.webp", tag: "sub-01 · pool", w: 1280, h: 960 },
  { src: "/photos/hair.webp", tag: "sub-01 · wind", w: 1400, h: 788 },
  { src: "/photos/cover-prytamanno.webp", tag: "rel · prytamanno", w: 1000, h: 1000 },
  { src: "/photos/road-far.webp", tag: "sub-01 · far", w: 1400, h: 788 },
  { src: "/photos/cover-q7.webp", tag: "rel · q7", w: 1000, h: 1000 },
  { src: "/photos/green-two.webp", tag: "sub-01 · double", w: 1400, h: 788 },
  { src: "/photos/cover-lvlup.webp", tag: "rel · lvl up", w: 1000, h: 1000 },
  { src: "/photos/laugh.webp", tag: "sub-01 · 118s", w: 1400, h: 788 },
  { src: "/photos/cover-woody.webp", tag: "rel · woody", w: 1000, h: 1000 },
  { src: "/photos/cam-stage.webp", tag: "sub-01 · stage · green", w: 1600, h: 900 },
  { src: "/photos/cover-grind.webp", tag: "rel · grind", w: 1000, h: 1000 },
  { src: "/photos/studio.webp", tag: "obj · studio · light", w: 1400, h: 788 },
  { src: "/photos/cover-kitka.webp", tag: "rel · kitka", w: 1000, h: 1000 },
  { src: "/photos/cover-kofein.webp", tag: "rel · kofein", w: 1000, h: 1000 },
];

export const HQ = { city: "uzhhorod", lat: "48.62n", lon: "22.29e", tz: "Europe/Kyiv" };

// Lines the log writes on its own between real events. Lowercase, short,
// slightly off — the station is watching a world that is not quite right.
export const AMBIENT_LOG = [
  "motion detected · cam-03",
  "w211 left the lot",
  "signal stable",
  "frame dropped · recovered",
  "someone is watching",
  "hehemonia · replaying",
  "fog over the uzh river",
  "tape rewound",
  "subject in frame · cam-01",
  "subject left the frame",
  "street lamp flickered · cam-03",
  "caution tape still tight",
  "nothing happened",
  "recording continues",
  "operator absent",
  "cat crossed cam-02",
  "pool still empty",
  "plate blurred",
  "road sign turned right",
  "clock check · ok",
  "korzo empty · 03:12",
  "castle hill · fog",
  "linden alley · no motion",
  "bridge lights on",
  "someone hummed the hook · cam-04",
];

export const BOOT_LINES = [
  "srrl station",
  "cam-01 ok",
  "cam-02 ok",
  "cam-03 ok",
  "cam-04 ok",
  "uzh · 48.62n 22.29e",
];

// Folders on the day desk, in reading order. Positions are percentages of
// the desk; they only apply on wide screens.
export const DESK = [
  { id: "music", label: "music", x: 10, y: 10 },
  { id: "merch", label: "merch", x: 72, y: 8 },
  { id: "note", label: null, x: 46, y: 30, accent: true }, // label = note title
  { id: "archive", label: "archive", x: 24, y: 48 },
  { id: "subject", label: "subject", x: 84, y: 40 },
  { id: "log", label: "log", x: 8, y: 68 },
  { id: "map", label: "map", x: 60, y: 62 },
  { id: "terminal", label: "terminal", x: 88, y: 70 },
];
