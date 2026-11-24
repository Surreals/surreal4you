"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CanvasTexture, LinearFilter, Mesh, PlaneGeometry, Scene, ShaderMaterial, TextureLoader, Vector2, WebGLRenderer } from "three";
import { SCENE_H, SCENE_W, SLAB, THINGS } from "../../lib/walk";

// How far the nearest and the farthest point drift apart at full tilt, as a
// share of the picture's width and height.
const REACH = [0.02, 0.012];
const WALL = 140; // the stone side under the front edge, px of the picture
// Two things stand on the block that the walker never hides behind, so THINGS
// does not have them. The floodlight's foot is behind the stands.
const FLOOD = { shape: [[590, 126], [674, 126], [674, 182], [640, 182], [640, 300], [618, 300], [618, 182], [590, 182]], base: [[590, 336], [674, 336]] };
// The lamp's beam and the smoke over it lean with the lamp. Night only: by day the lamp is off.
const BEAM = {
  shape: [[399, 507], [435, 507], [430, 330], [450, 300], [467, 270], [467, 115], [365, 115], [365, 270], [380, 300], [392, 330]],
  base: [[402, 713], [430, 713]],
};

// The depth of the block, drawn from the outlines the walker already uses:
// white is near. The ground comes nearer down the picture; every upright thing
// (and the wall under the front edge) takes the depth of the ground along its
// base, so it leans as one flat card standing on that line.
const depthMap = (beam) => {
  const canvas = document.createElement("canvas");
  canvas.width = SCENE_W / 2;
  canvas.height = SCENE_H / 2;
  const g = canvas.getContext("2d");
  g.scale(0.5, 0.5);

  const ys = SLAB.map(([, y]) => y);
  const far = Math.min(...ys);
  const near = Math.max(...ys);
  const grey = (y) => {
    const v = Math.round(255 * Math.min(1, Math.max(0, (y - far) / (near - far))));
    return `rgb(${v}, ${v}, ${v})`;
  };
  // left to right: under each x, the depth of the base line there
  const along = (base) => {
    const x0 = base[0][0];
    const x1 = base.at(-1)[0];
    const grad = g.createLinearGradient(x0, 0, x1, 0);
    base.forEach(([x, y]) => grad.addColorStop((x - x0) / (x1 - x0), grey(y)));
    return grad;
  };
  const fill = (shape, style) => {
    g.fillStyle = style;
    g.beginPath();
    shape.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.fill();
    // the outlines hug the things; 3px more keeps a stray edge from staying behind
    g.strokeStyle = style;
    g.lineWidth = 6;
    g.lineJoin = "round";
    g.stroke();
  };

  const ground = g.createLinearGradient(0, far, 0, near);
  ground.addColorStop(0, grey(far));
  ground.addColorStop(1, grey(near));
  g.fillStyle = ground;
  g.fillRect(0, 0, SCENE_W, SCENE_H);

  // SLAB runs clockwise, so the edges that head left are the front ones
  SLAB.forEach((a, i) => {
    const b = SLAB[(i + 1) % SLAB.length];
    if (b[0] < a[0]) fill([a, b, [b[0], b[1] + WALL], [a[0], a[1] + WALL]], along([b, a]));
  });

  const front = (t) => Math.max(...t.base.map(([, y]) => y));
  [...THINGS, FLOOD, ...(beam ? [BEAM] : [])].sort((a, b) => front(a) - front(b)).forEach((t) => fill(t.shape, along(t.base)));
  return canvas;
};

const VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const FRAGMENT = `
uniform sampler2D map;
uniform sampler2D depth;
uniform vec2 tilt;
uniform float showDepth;
varying vec2 vUv;
const int STEPS = 28;
void main() {
  // Every point slides by its own depth. Walk from the nearest depth to the
  // farthest and stop at the first point that lands here, so a near thing
  // covers what is behind it instead of doubling over it. Landing means the
  // walk has just passed the depth of the point under it; if that point is
  // clear, it is sky inside a thing's outline and the walk goes on through.
  float s = -1.0;
  float sPrev = 1.0;
  float hPrev = -1.0;
  for (int i = 0; i < STEPS; i++) {
    float si = 1.0 - float(i) / float(STEPS - 1);
    vec2 p = vUv - tilt * (si - 0.5);
    float h = texture2D(depth, p).r - si;
    if (hPrev < 0.0 && h >= 0.0 && texture2D(map, p).a > 0.1) {
      // On a slope, land between the two steps. A jump means the walk ran
      // into a thing from behind: things are flat cards, not solid blocks,
      // so show the last point beside it rather than its smeared edge.
      s = h - hPrev > 0.1 ? sPrev : mix(si, sPrev, h / (h - hPrev));
      break;
    }
    sPrev = si;
    hPrev = h;
  }
  if (s < 0.0) {
    // nothing lands here: open sky
    gl_FragColor = showDepth > 0.5 ? vec4(vec3(texture2D(depth, vUv).r), 1.0) : vec4(0.0);
    return;
  }
  vec2 uv = vUv - tilt * (s - 0.5);
  vec4 c = texture2D(map, uv);
  gl_FragColor = showDepth > 0.5 ? vec4(vec3(texture2D(depth, uv).r), 1.0) : vec4(c.rgb * c.a, c.a);
}`;

// The painted block with depth. The picture is the same one the home page
// shows; three.js draws it on one flat plane and a shader slides each pixel by
// its depth as the pointer moves (or on its own, while nobody does). On its
// own page it brings its controls; given a `theme` it is only the block, lit
// the way its host says and filling the box it is put in.
const Block3D = ({ theme: given }) => {
  const boxRef = useRef(null);
  const glRef = useRef(null);
  const [own, setOwn] = useState(null);
  const [showDepth, setShowDepth] = useState(false);
  const [failed, setFailed] = useState(false);
  const theme = given ?? own;

  useEffect(() => {
    setOwn(document.documentElement.dataset.theme === "day" ? "day" : "night");
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    let renderer;
    try {
      renderer = new WebGLRenderer({ alpha: true });
    } catch {
      setFailed(true);
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.className = "block size-full";
    box.append(canvas);

    // no mipmaps: the shader reads both textures at points that jump at outlines
    const plain = (texture) => {
      texture.generateMipmaps = false;
      texture.minFilter = LinearFilter;
      return texture;
    };
    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: { map: { value: null }, depth: { value: null }, tilt: { value: new Vector2() }, showDepth: { value: 0 } },
      transparent: true,
    });
    const scene = new Scene();
    scene.add(new Mesh(new PlaneGeometry(2, 2), material));
    const camera = new Camera();

    let stale = true; // something other than the tilt changed: draw the next frame
    const redraw = () => {
      stale = true;
    };
    const loader = new TextureLoader();
    const maps = {};
    glRef.current = {
      material,
      redraw,
      show: (t) => {
        maps[t] ??= [plain(loader.load(`/scene/${t}.webp`, redraw)), plain(new CanvasTexture(depthMap(t === "night")))];
        [material.uniforms.map.value, material.uniforms.depth.value] = maps[t];
        redraw();
      },
    };

    const resize = new ResizeObserver(() => {
      renderer.setSize(box.clientWidth, box.clientHeight, false);
      redraw();
    });
    resize.observe(box);

    // The pointer leads while it is over the block; otherwise the block sways
    // slowly on its own (not for visitors who asked for less motion).
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const aim = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let led = false;
    const onMove = (e) => {
      const r = box.getBoundingClientRect();
      aim.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      aim.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      led = true;
    };
    const onLeave = () => {
      led = false;
      if (calm) aim.x = aim.y = 0;
    };
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    box.addEventListener("pointercancel", onLeave);

    let raf;
    let last = performance.now();
    const frame = (t) => {
      raf = requestAnimationFrame(frame);
      const k = 1 - Math.exp(-(t - last) / 160);
      last = t;
      if (!led && !calm) {
        aim.x = Math.sin(t / 1700) * 0.8;
        aim.y = Math.sin(t / 2300) * 0.5;
      }
      // at rest there is nothing new to draw
      if (!stale && Math.abs(aim.x - now.x) + Math.abs(aim.y - now.y) < 1e-4) return;
      stale = false;
      now.x += (aim.x - now.x) * k;
      now.y += (aim.y - now.y) * k;
      // the camera goes where the pointer goes, so near things go the other way
      material.uniforms.tilt.value.set(-now.x * REACH[0], now.y * REACH[1]);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("pointercancel", onLeave);
      Object.values(maps).flat().forEach((m) => m.dispose());
      material.dispose();
      renderer.dispose();
      canvas.remove();
      glRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!theme || !glRef.current) return;
    if (!given) document.documentElement.dataset.theme = theme;
    glRef.current.show(theme);
  }, [theme, given]);

  useEffect(() => {
    if (!glRef.current) return;
    glRef.current.material.uniforms.showDepth.value = showDepth ? 1 : 0;
    glRef.current.redraw();
  }, [showDepth]);

  const stage = (
    <div ref={boxRef} className={given ? "size-full" : undefined} style={given ? undefined : { width: "min(100vw, calc((100dvh - 120px) * 1.5))", aspectRatio: "3 / 2" }}>
      {failed ? <p className="p-5 text-dim">webgl is off in this browser, so there is nothing to show here.</p> : null}
    </div>
  );
  if (given) return stage;

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid flex-1 place-items-center overflow-hidden">{stage}</div>
      <div className="dock flex items-center gap-1 px-3 pt-2">
        <button type="button" className="ctl" onClick={() => setOwn(theme === "day" ? "night" : "day")}>
          {theme === "day" ? "night" : "day"}
        </button>
        <button type="button" className="ctl" aria-pressed={showDepth} onClick={() => setShowDepth(!showDepth)}>
          {showDepth ? "picture" : "depth map"}
        </button>
        <span className="ml-auto text-dim">move the pointer over the block</span>
      </div>
    </div>
  );
};

export default Block3D;
