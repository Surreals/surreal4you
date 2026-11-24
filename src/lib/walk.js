// Where the walker can stand, and what stands in front of him. Everything
// here is in pixels of the scene picture (public/scene/*.webp, 1536x1024);
// a point means the walker's feet. The block top is a polygon inside the
// caution tape. Each thing on it has
//   shape: its outline on the picture (Scene cuts it out and lays it over
//          the walker while he is behind the thing),
//   base:  its bottom front edge, left to right. Feet above that line mean
//          the walker is behind it. Three points (left, front, right corner)
//          close into the footprint he cannot step on; two (the board's legs)
//          make a thin strip.
export const SCENE_W = 1536;
export const SCENE_H = 1024;

export const EDGE = [
  [205, 478],
  [345, 410],
  [640, 310],
  [740, 280],
  [800, 285],
  [990, 330],
  [1100, 350],
  [1345, 478],
  [1005, 790],
  [410, 708],
];

// The top edge of the stone slab the block stands on (the tape runs just
// inside it), clockwise from its left tip, with the height of the stone side
// under each corner.
export const SLAB = [
  [166, 505, 27],
  [728, 296, 30],
  [1005, 350, 30],
  [1290, 400, 30],
  [1372, 505, 30],
  [1006, 849, 50],
  [397, 757, 50],
];

export const THINGS = [
  {
    id: "stands",
    shape: [[352, 447], [352, 335], [362, 305], [572, 240], [600, 268], [657, 355], [657, 386], [455, 474], [440, 474]],
    base: [[352, 445], [455, 472], [655, 380]],
  },
  {
    id: "kiosk",
    shape: [[783, 232], [812, 205], [857, 197], [1006, 225], [1003, 352], [935, 393], [788, 362]],
    base: [[790, 358], [935, 390], [1000, 350]],
  },
  {
    id: "booth",
    shape: [[598, 447], [685, 405], [711, 409], [711, 386], [704, 381], [683, 379], [680, 364], [710, 349], [723, 351], [728, 372], [728, 413], [832, 430], [832, 597], [770, 624], [603, 614]],
    base: [[605, 612], [770, 622], [832, 595]],
  },
  {
    id: "garage",
    shape: [[1062, 354], [1070, 330], [1070, 252], [1114, 252], [1114, 320], [1191, 306], [1361, 346], [1359, 506], [1243, 551], [1062, 510]],
    base: [[1064, 508], [1241, 548], [1356, 504]],
  },
  {
    id: "car",
    shape: [[936, 554], [939, 537], [982, 507], [987, 500], [1016, 476], [1058, 467], [1111, 470], [1155, 486], [1166, 490], [1170, 512], [1161, 532], [1143, 551], [1085, 571], [1046, 588], [1032, 586], [1022, 583], [946, 571]],
    base: [[935, 560], [1045, 590], [1168, 548]],
  },
  {
    id: "board",
    shape: [[895, 600], [939, 607], [945, 596], [953, 590], [962, 597], [965, 612], [1023, 623], [1021, 713], [1016, 713], [1016, 787], [1004, 787], [1005, 711], [913, 695], [912, 770], [899, 770], [899, 692], [894, 690]],
    base: [[900, 767], [1010, 784]],
  },
  {
    id: "mast",
    shape: [[285, 210], [299, 210], [312, 420], [323, 450], [326, 542], [267, 542]],
    base: [[268, 540], [296, 546], [325, 540]],
  },
  {
    id: "lamp",
    shape: [[399, 507], [435, 507], [423, 533], [423, 690], [431, 700], [431, 717], [401, 717], [401, 700], [409, 690], [409, 533]],
    base: [[402, 713], [416, 718], [430, 713]],
  },
];

const FEET = 12; // half the walker's width at the feet: no part of him may stand in a footprint

const footprint = ({ base }) => {
  if (base.length === 2) {
    const [[x0, y0], [x1, y1]] = base;
    return [[x0, y0 - 6], [x1, y1 - 6], [x1, y1 + 4], [x0, y0 + 4]];
  }
  const [l, f, r] = base;
  return [l, f, r, [l[0] + r[0] - f[0], l[1] + r[1] - f[1]]];
};
const FOOTPRINTS = THINGS.map(footprint);

// Is the walker behind this thing? Only where the thing's base runs.
export const behind = ({ base }, x, y) => {
  for (let i = 1; i < base.length; i++) {
    const [x0, y0] = base[i - 1];
    const [x1, y1] = base[i];
    if (x >= x0 && x <= x1) return y < y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return false;
};

// Where the walker stands to use each spot (keys are SPOTS ids).
export const DOORS = {
  music: [540, 485],
  merch: [880, 402],
  archive: [1210, 575],
  subject: [440, 630],
  log: [850, 590],
  note: [880, 760],
  map: [335, 548],
};
export const NEAR = 60;
export const START = [470, 700];

const inside = (poly, x, y) => {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

export const walkable = (x, y) =>
  inside(EDGE, x, y) && !FOOTPRINTS.some((p) => inside(p, x - FEET, y) || inside(p, x, y) || inside(p, x + FEET, y));

// The spot whose door is closest to the feet, if it is within reach.
export const nearDoor = (x, y) => {
  let best = null;
  let bestD = NEAR;
  for (const [id, [dx, dy]] of Object.entries(DOORS)) {
    const d = Math.hypot(dx - x, dy - y);
    if (d < bestD) [best, bestD] = [id, d];
  }
  return best;
};

// One step from (x, y) by (dx, dy); slides along walls instead of stopping.
export const step = (x, y, dx, dy) => {
  if (walkable(x + dx, y + dy)) return [x + dx, y + dy];
  if (dx && walkable(x + dx, y)) return [x + dx, y];
  if (dy && walkable(x, y + dy)) return [x, y + dy];
  return [x, y];
};

// Shortest route on a coarse grid (BFS, 8 neighbours), as a list of points
// ending at the target. A target inside a block or off the block snaps to
// the nearest cell the walker can stand on. Empty when there is no way.
const CELL = 12;
const COLS = Math.ceil(SCENE_W / CELL);
const ROWS = Math.ceil(SCENE_H / CELL);
let grid = null;
const free = (c, r) => {
  if (!grid) {
    grid = new Uint8Array(COLS * ROWS);
    for (let j = 0; j < ROWS; j++)
      for (let i = 0; i < COLS; i++) grid[j * COLS + i] = walkable((i + 0.5) * CELL, (j + 0.5) * CELL) ? 1 : 0;
  }
  return c >= 0 && r >= 0 && c < COLS && r < ROWS && grid[r * COLS + c] === 1;
};
const DIRS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

const nearestFree = (c, r) => {
  for (let rad = 0; rad < Math.max(COLS, ROWS); rad++)
    for (let j = -rad; j <= rad; j++)
      for (let i = -rad; i <= rad; i++)
        if (Math.max(Math.abs(i), Math.abs(j)) === rad && free(c + i, r + j)) return [c + i, r + j];
  return null;
};

export const route = ([fx, fy], [tx, ty]) => {
  const start = nearestFree(Math.floor(fx / CELL), Math.floor(fy / CELL));
  const goal = nearestFree(Math.floor(tx / CELL), Math.floor(ty / CELL));
  if (!start || !goal) return [];
  const exact = walkable(tx, ty);
  const key = (c, r) => r * COLS + c;
  const prev = new Map([[key(...start), -1]]);
  const queue = [start];
  for (let q = 0; q < queue.length; q++) {
    const [c, r] = queue[q];
    if (c === goal[0] && r === goal[1]) break;
    for (const [dc, dr] of DIRS) {
      const nc = c + dc;
      const nr = r + dr;
      // diagonal moves may not cut a blocked corner
      if (!free(nc, nr) || prev.has(key(nc, nr)) || (dc && dr && (!free(c + dc, r) || !free(c, r + dr)))) continue;
      prev.set(key(nc, nr), key(c, r));
      queue.push([nc, nr]);
    }
  }
  if (!prev.has(key(...goal))) return [];
  const pts = [];
  for (let k = key(...goal); k !== -1; k = prev.get(k)) pts.unshift([((k % COLS) + 0.5) * CELL, (Math.floor(k / COLS) + 0.5) * CELL]);
  pts.shift(); // the cell the walker already stands in
  if (exact) pts.splice(-1, 1, [tx, ty]);
  return pts;
};
