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
const GLARE = [[384, 468], [450, 468], [470, 299], [360, 334]]; // and across the stands
const CAMERAS = [
  [[683, 350], [722, 350], [726, 372], [726, 445], [731, 447], [731, 454], [708, 454], [708, 424], [713, 420], [713, 380], [683, 380]], // on the booth
  [[1070, 250], [1107, 250], [1115, 266], [1117, 355], [1100, 355], [1102, 276], [1070, 276]], // on the garage
];
const CUTS = [
  shape("lamp"),
  shape("board"),
  [[285, 214], [301, 214], [305, 250], [325, 440], [330, 545], [266, 545], [278, 250]], // mast
  [[590, 126], [674, 126], [674, 182], [640, 182], [640, 336], [618, 336], [618, 182], [590, 182]], // floodlight
  ...CAMERAS,
];
// The car's outline. Its solid is a rough hull, and whatever of the hull falls
// outside this line is left clear, so no asphalt or brick rides on the car.
const CAR_CUT = [[936, 554], [939, 537], [982, 507], [987, 500], [1016, 476], [1058, 467], [1111, 470], [1155, 486], [1166, 490], [1170, 512], [1161, 532], [1143, 551], [1085, 571], [1046, 588], [1032, 586], [1022, 583], [946, 571]];

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
      quad(m.car, [pt(t0, 1, 0), pt(t1, 1, 0), pt(t1, 1, h1), pt(t0, 1, h0)]);
      quad(m.car, [pt(t0, 0, h0), pt(t1, 0, h1), pt(t1, 1, h1), pt(t0, 1, h0)]); // bonnet, glass, roof, boot
    });
    quad(m.car, [pt(0, 0, 0), pt(0, 1, 0), pt(0, 1, 30), pt(0, 0, 30)]);
    quad(m.car, [pt(1, 0, 0), pt(1, 1, 0), pt(1, 1, 44), pt(1, 0, 44)]);
  }

  quad(m.cards, [at(899, 767), at(1022, 784), at(1022, 784, 182), at(899, 767, 182)]); // notice board: flat as it is

  // The thin things are flat cut-outs, each turning on its foot to face whoever
  // looks: [foot x, foot y, half width, height, height of the roof it stands on].
  m.turning = [
    [417, 717, 20, 212], // lamp
    [294, 525, 36, 340], // mast
    [629, 336, 45, 210], // floodlight
    [719.5, 606, 37, 104, 152], // camera on the booth
    [1108.5, 513, 39, 105, 158], // camera on the garage
  ].map(([x, y, half, h, base = 0]) => {
    const foot = at(x, y, base);
    const sheet = [at(x - half, y, base), at(x + half, y, base), at(x + half, y, base + h), at(x - half, y, base + h)];
    const part = bin();
    quad(part, move(sheet, sub([0, 0, 0], foot)), sheet);
    return { part, foot };
  });
  return m;
};

// The four pictures the model wears, made from the painting. `day` is the day
// painting, which the night one borrows from where the lamp's beam is in the way.
const pictures = (img, day, m, night) => {
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
  const fill = (g, pts) => {
    g.beginPath();
    path(g, pts);
    g.fill();
    g.stroke();
  };
  // everything a solid hides from the painter
  const cover = (g, { pos }) => {
    for (let i = 0; i < pos.length; i += 9) fill(g, [0, 3, 6].map((k) => seen(pos.slice(i + k, i + k + 3))));
  };
  // `src` with what `rub` draws taken out and the holes closed from what lies
  // around them: the picture is halved until the holes shut, then the sizes
  // are laid back over one another, smallest first.
  const heal = (src, rub) => {
    const sizes = [
      sheet(W, H, (g) => {
        g.drawImage(src, 0, 0);
        g.globalCompositeOperation = "destination-out";
        g.lineWidth = 3;
        rub(g);
      }),
    ];
    for (let w = W / 2; w >= 6; w /= 2) {
      const last = sizes[sizes.length - 1];
      sizes.push(sheet(w, (w * H) / W, (g) => g.drawImage(last, 0, 0, w, (w * H) / W)));
    }
    return sheet(W, H, (g) => sizes.reverse().forEach((s) => g.drawImage(s, 0, 0, W, H)));
  };

  // At night the lamp's beam is painted across the stands and would stay there
  // when the lamp moves away: take that strip from the day, dimmed to the night wall.
  const painted = night
    ? sheet(W, H, (g) => {
        g.drawImage(img, 0, 0);
        g.beginPath();
        path(g, GLARE);
        g.clip();
        g.drawImage(day, 0, 0);
        g.globalCompositeOperation = "multiply";
        g.fillStyle = "#a8a8aa";
        g.fill();
      })
    : img;
  // the solids, without the cameras painted across two of the roofs
  const solid = heal(painted, (g) => CAMERAS.forEach((pts) => fill(g, pts)));
  // the garage without the car parked across its door
  const garage = heal(solid, (g) => cover(g, m.car));
  // The ground, without anything that stood on it. The closed holes come out
  // smooth, so the grain of the open asphalt is pressed back into them.
  const stood = (g) => {
    g.lineWidth = 3;
    [m.things, m.car, m.garage].forEach((part) => cover(g, part));
    [...THINGS.map((t) => t.shape), ...CUTS, ...(night ? [BEAM] : [])].forEach((pts) => fill(g, pts));
  };
  const grain = sheet(240, 160, (g) => {
    [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => {
      g.setTransform(sx, 0, 0, sy, 120, 80);
      g.drawImage(img, 450, 570, 120, 80, 0, 0, 120, 80);
    });
    g.resetTransform();
    g.fillStyle = "rgba(255, 255, 255, 0.18)"; // lifted to a middle grey, which "overlay" leaves as it was
    g.fillRect(0, 0, 240, 160);
  });
  const ground = sheet(W, H, (g) => {
    g.drawImage(heal(img, stood), 0, 0);
    g.globalCompositeOperation = "overlay";
    g.drawImage(
      sheet(W, H, (p) => {
        stood(p);
        p.globalCompositeOperation = "source-in";
        p.fillStyle = p.createPattern(grain, "repeat");
        p.fillRect(0, 0, W, H);
      }),
      0,
      0,
    );
  });
  // only the cut-outs and the car, the rest clear
  const cuts = sheet(W, H, (g) => {
    g.save();
    g.beginPath();
    CUTS.forEach((pts) => path(g, pts));
    g.clip();
    g.drawImage(img, 0, 0);
    g.drawImage(img, 618, 262, 22, 38, 618, 298, 22, 38); // the floodlight's pole, carried on down where the stands hid it
    g.restore();
    g.beginPath();
    path(g, CAR_CUT);
    g.clip();
    g.fillStyle = "#0e0e10"; // the night painting has holes in the car's glass and wheel arches
    g.fill();
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
      const mesh = new Mesh(geo, mat);
      scene.add(mesh);
      return mesh;
    };
    add(parts.top, mats.ground);
    add(parts.sides, mats.solid);
    add(parts.things, mats.solid);
    add(parts.car, mats.cuts);
    add(parts.garage, mats.garage);
    add(parts.cards, mats.cuts);
    const turning = parts.turning.map(({ part, foot }) => {
      const mesh = add(part, mats.cuts);
      mesh.position.set(...foot);
      return mesh;
    });

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
    const load = async (t) => {
      const img = new Image();
      img.src = `/scene/${t}.webp`;
      await img.decode();
      return img;
    };
    const show = async (t) => {
      if (!textures[t]) {
        const day = await load("day");
        const img = t === "day" ? day : await load(t);
        if (gone) return;
        textures[t] = Object.fromEntries(
          Object.entries(pictures(img, day, parts, t === "night")).map(([key, c]) => {
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
      turning.forEach((mesh) => (mesh.rotation.y = view.az));
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
