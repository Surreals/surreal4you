// The block: one generated scene (public/scene) with seven things standing on
// it. Each spot is a door into a window. `x`/`y` are the spot centre in
// percent of the scene image; `place` is the word printed next to it.
// Four spots carry a camera: `scene` is its OSD tag, `clip` a few seconds of
// webm that plays in the hover card (CHILL for cams 01–03, Petlura for
// cam-04). `offline` is what a camera shows while its section is switched off.
export const SPOTS = [
  {
    id: "music",
    place: "stands",
    label: "music",
    x: 30,
    y: 30,
    key: "1",
    cam: "cam-01",
    scene: "stands · stadium",
    image: "/photos/cam-stands.webp",
    clip: "/photos/clip-stands.webm",
  },
  {
    id: "merch",
    place: "kiosk",
    label: "merch",
    x: 62,
    y: 24,
    key: "2",
    cam: "cam-02",
    scene: "court · net",
    image: "/photos/cam-net.webp",
    clip: "/photos/clip-net.webm",
    offline: { scene: "no signal", image: "/photos/testcard.svg", clip: null },
  },
  {
    id: "archive",
    place: "garage",
    label: "archive",
    x: 78,
    y: 48,
    key: "3",
    cam: "cam-03",
    scene: "court · indoor",
    image: "/photos/cam-court.webp",
    clip: "/photos/clip-court.webm",
  },
  {
    id: "subject",
    place: "lamp",
    label: "subject",
    x: 33,
    y: 66,
    key: "4",
    cam: "cam-04",
    scene: "close-up",
    image: "/photos/cam-portrait.webp",
    clip: "/photos/clip-portrait.webm",
  },
  { id: "log", place: "booth", label: "log", x: 50, y: 48, key: "l" },
  { id: "note", place: "board", label: "note", x: 62, y: 72, key: "n" },
  { id: "map", place: "mast", label: "map", x: 16, y: 46, key: "m" },
];

// The four cameras, for the terminal.
export const FEEDS = SPOTS.filter((s) => s.cam);

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
// slightly off: the block is watched, and it is not quite right.
export const AMBIENT_LOG = [
  "motion · garage",
  "w211 left the lot",
  "w211 is back. nobody drove it",
  "signal stable",
  "frame dropped · recovered",
  "someone is watching",
  "hehemonia · replaying",
  "fog over the uzh river",
  "tape rewound",
  "subject under the lamp",
  "subject left the frame",
  "the lamp points up again",
  "caution tape still tight",
  "nothing happened",
  "recording continues",
  "booth empty · monitors on",
  "cat crossed cam-02",
  "shutter moved · kiosk",
  "paper on the board changed",
  "one seat is yellow. nobody chose it",
  "ball rolled off the block",
  "beacon blinked twice",
  "clock check · ok",
  "korzo empty · 03:12",
  "castle hill · fog",
  "bridge lights on",
  "someone hummed the hook · cam-04",
];

export const BOOT_LINES = [
  "SRRLOVYCH",
  "cam-01 ok",
  "cam-02 ok",
  "cam-03 ok",
  "cam-04 ok",
  "one block · uzh · 48.62n 22.29e",
];
