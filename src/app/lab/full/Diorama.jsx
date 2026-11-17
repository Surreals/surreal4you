"use client";

import { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { THINGS } from "../../../lib/walk";

// A trial: the block as a paper model. Every thing is a plain solid (a box, a
// wedge, a flat cut-out) measured off the painting, and the painting is thrown
// back onto those solids from where its painter stood. Seen from there the
// model is the painting, pixel for pixel; turn it and the solids show.
//
// All measurements below are pixels of the picture (public/scene/*.webp).

const W = 1536;
const H = 1024;
// The painting looks down at the block at about 18 degrees: with that angle the
// bases of the kiosk, the booth, the garage and the stands all come out square.
const TILT = (18 * Math.PI) / 180;
const S = Math.sin(TILT);
const C = Math.cos(TILT);
const FAR = 4000; // the camera's distance; it draws without perspective, so only the angle matters

// The point `up` pixels above the ground point that the picture shows at (x, y).
const at = (x, y, up = 0) => [x - W / 2, up / C, (y - H / 2) / S];
// Where a point of the model falls on the picture.
const seen = ([x, y, z]) => [x + W / 2, H / 2 + z * S - y * C];

const bin = () => ({ pos: [], uv: [] });
// Four corners of a face. `src` are the points whose picture the face wears:
// its own by default, another face's when the painting never saw this one.
const quad = (m, pts, src = pts) => {
  [0, 1, 2, 0, 2, 3].forEach((i) => {
    m.pos.push(...pts[i]);
    const [x, y] = seen(src[i]);
    m.uv.push(x / W, 1 - y / H);
  });
};
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const move = (pts, [dx, dy, dz]) => pts.map(([x, y, z]) => [x + dx, y + dy, z + dz]);

// A box on the base corners left, front, right (the fourth is implied). The
// two back walls wear the picture of the wall opposite, or, when that wall has
// the only door, of the plain side wall.
const box = (m, L, F, R, h, plainBack = false) => {
  const B = [L[0] + R[0] - F[0], L[1] + R[1] - F[1]];
  const [l, f, r, b] = [L, F, R, B].map((p) => at(...p));
  const [l1, f1, r1, b1] = [L, F, R, B].map((p) => at(...p, h));
  quad(m, [l, f, f1, l1]);
  quad(m, [f, r, r1, f1]);
  quad(m, [l1, f1, r1, b1]);
  const side = [f, r, r1, f1];
  const lb = [l, b, b1, l1];
  quad(m, lb, plainBack ? side : move(lb, sub(f, l)));
  const br = [b, r, r1, b1];
  quad(m, br, plainBack ? side : move(br, sub(f, r)));
};

// A flat cut-out standing on the ground line a-b, with a second sheet across
// it wearing the same picture so the thing does not vanish seen edge-on.
const card = (m, [ax, ay], [bx, by], h, { base = 0, cross = true } = {}) => {
  const sheet = [at(ax, ay, base), at(bx, by, base), at(bx, by, base + h), at(ax, ay, base + h)];
  quad(m, sheet);
  if (!cross) return;
  const [a, b, top] = sheet;
  const mx = (a[0] + b[0]) / 2;
  const mz = (a[2] + b[2]) / 2;
  const hx = (b[2] - a[2]) / 2;
  const hz = (a[0] - b[0]) / 2;
  quad(m, [[mx - hx, a[1], mz - hz], [mx + hx, a[1], mz + hz], [mx + hx, top[1], mz + hz], [mx - hx, top[1], mz - hz]], sheet);
};

// The top edge of the slab, clockwise from its left tip, with the height of
// the stone side under each corner.
const SLAB = [
  [166, 505, 27],
  [728, 296, 30],
  [1005, 350, 30],
  [1290, 400, 30],
  [1372, 505, 30],
  [1006, 849, 50],
  [397, 757, 50],
];
const SEEN_SIDES = [4, 5, 6]; // the sides that face the painter; the rest borrow the front one

// The car's side view, nose to tail: [share of its length, height].
const CAR = [[0, 30], [0.05, 40], [0.3, 46], [0.5, 82], [0.8, 82], [0.95, 48], [1, 44]];

// What the cut-outs keep of the picture.
const shape = (id) => THINGS.find((t) => t.id === id).shape;
const BEAM = [[399, 507], [435, 507], [445, 465], [388, 465]]; // the lamp's beam where it is painted across the ground
const CUTS = [
  shape("lamp"),
  shape("board"),
  [[285, 214], [301, 214], [305, 250], [325, 440], [330, 545], [266, 545], [278, 250]], // mast
  [[590, 126], [674, 126], [674, 182], [640, 182], [640, 300], [618, 300], [618, 182], [590, 182]], // floodlight
  [[683, 350], [722, 350], [726, 372], [726, 450], [713, 450], [713, 380], [683, 380]], // camera on the booth
  [[1070, 250], [1107, 250], [1115, 266], [1115, 353], [1102, 353], [1102, 276], [1070, 276]], // camera on the garage
];

const model = () => {
  const m = { top: bin(), sides: bin(), things: bin(), car: bin(), garage: bin(), cards: bin() };

  for (let i = 2; i < SLAB.length; i++) {
    const [a, b, c] = [SLAB[0], SLAB[i - 1], SLAB[i]].map(([x, y]) => at(x, y));
    quad(m.top, [a, b, c, c]);
  }
  const side = (i) => {
    const [ax, ay, ah] = SLAB[i];
    const [bx, by, bh] = SLAB[(i + 1) % SLAB.length];
    return [at(ax, ay), at(bx, by), at(bx, by, -bh), at(ax, ay, -ah)];
  };
  SLAB.forEach((_, i) => quad(m.sides, side(i), SEEN_SIDES.includes(i) ? undefined : side(5)));

  box(m.things, [792, 360], [937, 388], [1000, 357], 126, true); // kiosk
  box(m.things, [610, 597], [745, 622], [820, 585], 152); // guard booth
  box(m.garage, [1064, 509], [1240, 550], [1356, 505], 158, true);

  {
    // The stands: a wedge. Seats climb from the low front wall to the back.
    const [L, F, R] = [[355, 437], [442, 465], [652, 398]];
    const B = [L[0] + R[0] - F[0], L[1] + R[1] - F[1]];
    const [l, f, r, b] = [L, F, R, B].map((p) => at(...p));
    const [l1, b1] = [L, B].map((p) => at(...p, 102));
    const [f0, r0] = [F, R].map((p) => at(...p, 20));
    quad(m.things, [l, f, f0, l1]); // the end wall with the steps
    quad(m.things, [f, r, r0, f0]);
    quad(m.things, [f0, r0, b1, l1]); // the seats
    const end = [b, r, r0, b1];
    quad(m.things, end, move(end, sub(f, r)));
    quad(m.things, [l, b, b1, l1], side(5)); // the back, which the painter never saw: the slab's stone
  }

  {
    // The car: its side view pushed across its width.
    const f = at(1030, 592);
    const along = sub(at(1172, 533), f);
    const across = sub(at(940, 574), f);
    const pt = (t, w, h) => [f[0] + t * along[0] + w * across[0], h / C, f[2] + t * along[2] + w * across[2]];
    CAR.slice(1).forEach(([t1, h1], i) => {
      const [t0, h0] = CAR[i];
      quad(m.car, [pt(t0, 0, 0), pt(t1, 0, 0), pt(t1, 0, h1), pt(t0, 0, h0)]);
      const far = [pt(t0, 1, 0), pt(t1, 1, 0), pt(t1, 1, h1), pt(t0, 1, h0)];
      quad(m.car, far, move(far, sub(f, pt(0, 1, 0))));
      quad(m.car, [pt(t0, 0, h0), pt(t1, 0, h1), pt(t1, 1, h1), pt(t0, 1, h0)]); // bonnet, glass, roof, boot
    });
    quad(m.car, [pt(0, 0, 0), pt(0, 1, 0), pt(0, 1, 30), pt(0, 0, 30)]);
    const tail = [pt(1, 0, 0), pt(1, 1, 0), pt(1, 1, 44), pt(1, 0, 44)];
    quad(m.car, tail, move(tail, sub(f, pt(1, 0, 0))));
  }

  card(m.cards, [397, 707], [437, 707], 202); // lamp
  card(m.cards, [899, 767], [1022, 784], 182, { cross: false }); // notice board: flat as it is
  card(m.cards, [262, 525], [330, 525], 340); // mast
  card(m.cards, [575, 312], [700, 312], 207); // floodlight
  card(m.cards, [683, 602], [726, 602], 102, { base: 152 }); // camera on the booth roof
  card(m.cards, [1070, 511], [1115, 511], 105, { base: 158 }); // camera on the garage roof
  return m;
};

// The four pictures the model wears, made from one painting.
const pictures = (img, m, night) => {
  const sheet = (w, h, draw) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"));
    return c;
  };
  const path = (g, pts) => {
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
  };
  // paint over everything a solid hides from the painter
  const cover = (g, { pos }) => {
    for (let i = 0; i < pos.length; i += 9) {
      g.beginPath();
      path(g, [0, 3, 6].map((k) => seen(pos.slice(i + k, i + k + 3))));
      g.fill();
      g.stroke();
    }
  };

  // as painted; the empty margin takes a wall grey so an edge that overshoots is not black
  const solid = sheet(W, H, (g) => {
    g.fillStyle = night ? "#2b2b2e" : "#8a8986";
    g.fillRect(0, 0, W, H);
    g.drawImage(img, 0, 0);
  });
  // the garage without the car parked across its door
  const garage = sheet(W, H, (g) => {
    g.drawImage(solid, 0, 0);
    g.fillStyle = g.strokeStyle = "#0e0e10";
    g.lineWidth = 2;
    cover(g, m.car);
  });
  // The ground: where a thing stood in the way the painter left no asphalt, so
  // lay a patch of clean asphalt from the open middle, mirrored to tile.
  const tile = sheet(240, 160, (g) => {
    [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => {
      g.setTransform(sx, 0, 0, sy, 120, 80);
      g.drawImage(img, 450, 570, 120, 80, 0, 0, 120, 80);
    });
  });
  const ground = sheet(W, H, (g) => {
    g.drawImage(solid, 0, 0);
    g.fillStyle = g.strokeStyle = g.createPattern(tile, "repeat");
    g.lineWidth = 2;
    [m.things, m.car, m.garage].forEach((part) => cover(g, part));
    [...CUTS, ...(night ? [BEAM] : [])].forEach((pts) => {
      g.beginPath();
      path(g, pts);
      g.fill();
      g.stroke();
    });
  });
  // only the cut-outs, the rest clear
  const cuts = sheet(W, H, (g) => {
    g.beginPath();
    CUTS.forEach((pts) => path(g, pts));
    g.clip();
    g.drawImage(img, 0, 0);
  });
  return { solid, garage, ground, cuts };
};

const glow = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
};

const fade = () => {
  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, "rgba(255, 255, 255, 0)");
  grad.addColorStop(1, "rgba(255, 255, 255, 1)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 2, 64);
  return c;
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const START = { az: 0, el: TILT, zoom: 0.8 };

const Diorama = () => {
  const boxRef = useRef(null);
  const glRef = useRef(null);
  const [theme, setTheme] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "day" ? "day" : "night");
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    let renderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setFailed(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.className = "block size-full";
    el.append(canvas);

    const parts = model();
    const mats = {
      ground: new MeshBasicMaterial({ side: DoubleSide }),
      solid: new MeshBasicMaterial({ side: DoubleSide }),
      garage: new MeshBasicMaterial({ side: DoubleSide }),
      cuts: new MeshBasicMaterial({ side: DoubleSide, transparent: true, alphaTest: 0.02 }),
    };
    const scene = new Scene();
    const geometries = [];
    const add = (part, mat) => {
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(part.pos, 3));
      geo.setAttribute("uv", new Float32BufferAttribute(part.uv, 2));
      geometries.push(geo);
      scene.add(new Mesh(geo, mat));
    };
    add(parts.top, mats.ground);
    add(parts.sides, mats.solid);
    add(parts.things, mats.solid);
    add(parts.car, mats.solid);
    add(parts.garage, mats.garage);
    add(parts.cards, mats.cuts);

    // Night only: the mast's beacon blinks and the lamp throws its beam up.
    const night = new Group();
    const glowMap = new CanvasTexture(glow());
    const beacon = new Sprite(new SpriteMaterial({ map: glowMap, color: 0xff4632, blending: AdditiveBlending, depthWrite: false }));
    beacon.position.set(...at(293, 525, 300));
    beacon.scale.setScalar(110);
    const beamGeo = new CylinderGeometry(46, 9, 340 / C, 24, 1, true);
    const fadeMap = new CanvasTexture(fade());
    const beam = new Mesh(
      beamGeo,
      new MeshBasicMaterial({ map: fadeMap, color: 0xdfe6f5, transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }),
    );
    beam.position.set(...at(416, 707, 198 + 170));
    night.add(beacon, beam);
    scene.add(night);

    const camera = new OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 1, FAR * 3);
    const view = { ...START };
    const aim = { ...START };

    const textures = {};
    let gone = false;
    const show = async (t) => {
      if (!textures[t]) {
        const img = new Image();
        img.src = `/scene/${t}.webp`;
        await img.decode();
        if (gone) return;
        textures[t] = Object.fromEntries(
          Object.entries(pictures(img, parts, t === "night")).map(([key, c]) => {
            const tex = new CanvasTexture(c);
            tex.colorSpace = SRGBColorSpace;
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            return [key, tex];
          }),
        );
      }
      for (const key of Object.keys(mats)) {
        mats[key].map = textures[t][key];
        mats[key].needsUpdate = true;
      }
      night.visible = t === "night";
    };

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let turned = false; // the visitor has taken the block in hand: stop swaying it
    let drag = null;
    glRef.current = {
      show,
      reset: () => {
        view.az = ((((view.az + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI; // the short way round
        Object.assign(aim, START);
        turned = false;
      },
    };

    const resize = new ResizeObserver(() => renderer.setSize(el.clientWidth, el.clientHeight, false));
    resize.observe(el);

    const onDown = (e) => {
      drag = { x: e.clientX, y: e.clientY, az: aim.az, el: aim.el };
      turned = true;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!drag) return;
      aim.az = drag.az - (e.clientX - drag.x) * 0.006;
      aim.el = clamp(drag.el + (e.clientY - drag.y) * 0.004, 0.14, 1.3);
    };
    const onUp = () => {
      drag = null;
    };
    const onWheel = (e) => {
      e.preventDefault();
      aim.zoom = clamp(aim.zoom * Math.exp(-e.deltaY * 0.0012), 0.5, 3);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    // shortcut: draws every frame even at rest, stop the loop when nothing moves before this goes on the home page
    let raf;
    let last = performance.now();
    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      const k = 1 - Math.exp(-(t - last) / 70);
      last = t;
      if (!turned && !calm) aim.az = 0.35 * Math.sin(t / 2600);
      for (const key of Object.keys(view)) view[key] += (aim[key] - view[key]) * k;
      camera.position.set(Math.sin(view.az) * Math.cos(view.el) * FAR, Math.sin(view.el) * FAR, Math.cos(view.az) * Math.cos(view.el) * FAR);
      camera.lookAt(0, 0, 0);
      camera.zoom = view.zoom;
      camera.updateProjectionMatrix();
      // two short flashes every 5.6s, like the beacon on the home page
      const p = (t % 5600) / 5600;
      beacon.material.opacity = calm ? 0.6 : 0.3 + 0.7 * Math.max(Math.exp(-(((p - 0.03) / 0.018) ** 2)), Math.exp(-(((p - 0.13) / 0.018) ** 2)));
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      gone = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      Object.values(textures).forEach((set) => Object.values(set).forEach((tex) => tex.dispose()));
      Object.values(mats).forEach((mat) => mat.dispose());
      geometries.forEach((geo) => geo.dispose());
      glowMap.dispose();
      fadeMap.dispose();
      beacon.material.dispose();
      beamGeo.dispose();
      beam.material.dispose();
      renderer.dispose();
      canvas.remove();
      glRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!theme || !glRef.current) return;
    document.documentElement.dataset.theme = theme;
    glRef.current.show(theme);
  }, [theme]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid flex-1 place-items-center overflow-hidden">
        <div
          ref={boxRef}
          className="cursor-grab active:cursor-grabbing"
          style={{ width: "min(100vw, calc((100dvh - 120px) * 1.5))", aspectRatio: "3 / 2", touchAction: "none" }}
        >
          {failed ? <p className="p-5 text-dim">webgl is off in this browser, so there is nothing to show here.</p> : null}
        </div>
      </div>
      <div className="dock flex items-center gap-1 px-3 pt-2">
        <button type="button" className="ctl" onClick={() => setTheme(theme === "day" ? "night" : "day")}>
          {theme === "day" ? "night" : "day"}
        </button>
        <button type="button" className="ctl" onClick={() => glRef.current?.reset()}>
          reset view
        </button>
        <span className="ml-auto text-dim">drag to turn · wheel to zoom</span>
      </div>
    </div>
  );
};

export default Diorama;
