"use client";

import { useEffect, useRef, useState } from "react";
import { START, THINGS, behind, nearDoor, route, step } from "../../lib/walk";

const SPEED = 150; // scene px per second
const FPS = 10;
// public/scene/walker.png: 6 columns (idle + 5 walk frames) x 2 rows (front,
// back), drawn facing left; facing right is the same frame mirrored.
const COLS = 6;
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"; // --ease-out in globals.css
const MOVE = {
  arrowup: [0, -1],
  w: [0, -1],
  arrowdown: [0, 1],
  s: [0, 1],
  arrowleft: [-1, 0],
  a: [-1, 0],
  arrowright: [1, 0],
  d: [1, 0],
};

// Keys only count on the page itself, the block or the switch between its
// views (focus stays on that switch after a click), never inside a window.
const onScene = (e) => e.target === document.body || e.target?.closest?.(".scene, .views");

// The subject, loose on the block: arrows / WASD or a click on the ground,
// e (or Enter) opens the spot he stands at. Position lives in a ref and goes
// straight to the DOM each frame; React only hears which door is near.
// Things he is behind get their cut-out (Scene's .occluder) switched on.
// `stage` is how the block is shown now (FLAT in lib/walk.js, or what a view
// with a canvas put in its place). Such a view draws him itself, from
// `stage.who`; here he is then only the mark and the hint at his feet.
const Walker = ({ sceneRef, wrapRef, stage, view, spots, onOpen, onNear }) => {
  const outerRef = useRef(null);
  const bodyRef = useRef(null);
  const tagRef = useRef(null);
  const markRef = useRef(null);
  const [near, setNear] = useState(() => nearDoor(...START));
  const st = useRef({ x: START[0], y: START[1], path: [], held: new Set(), back: false, flip: false, col: 0, mark: null, t: 0, near, raf: 0 });
  const nearRef = useRef(onNear);
  nearRef.current = onNear;
  const openRef = useRef(onOpen);
  openRef.current = onOpen;

  useEffect(() => {
    const s = st.current;
    const scene = sceneRef.current;
    const wrap = wrapRef.current;
    stage.who = s;
    nearRef.current(s.near);
    // only the flat picture has the cut-outs
    const covers = THINGS.map((t) => [t, scene.querySelector(`[data-thing="${t.id}"]`)]);

    const put = (el, x, y) => {
      const [fx, fy] = stage.project(x, y);
      el.style.left = `${fx * 100}%`;
      el.style.top = `${fy * 100}%`;
    };
    // Everything of him that is DOM goes where the view shows his feet. A view
    // with a canvas asks for this again after each frame it draws.
    const place = () => {
      put(outerRef.current, s.x, s.y);
      put(tagRef.current, s.x, s.y);
      if (s.mark) put(markRef.current, ...s.mark);
      for (const [t, cover] of covers) cover?.toggleAttribute("data-on", behind(t, s.x, s.y));
    };
    const draw = (moving) => {
      const body = bodyRef.current;
      s.col = moving ? 1 + (Math.floor(s.t * FPS) % (COLS - 1)) : 0;
      body.style.backgroundPosition = `${(s.col / (COLS - 1)) * 100}% ${s.back ? 100 : 0}%`;
      body.style.transform = s.flip ? "scaleX(-1)" : "";
      place();
      stage.redraw();
    };

    // Narrow screens pan the block; keep the walker inside the visible part.
    const follow = () => {
      if (wrap.scrollWidth <= wrap.clientWidth + 1) return;
      const px = stage.project(s.x, s.y)[0] * scene.offsetWidth;
      const pad = wrap.clientWidth * 0.2;
      if (px - wrap.scrollLeft < pad) wrap.scrollLeft = px - pad;
      else if (px - wrap.scrollLeft > wrap.clientWidth - pad) wrap.scrollLeft = px - wrap.clientWidth + pad;
    };

    let last = 0;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const reach = SPEED * dt;
      let dx = 0;
      let dy = 0;
      for (const k of s.held) {
        dx += MOVE[k][0];
        dy += MOVE[k][1];
      }
      let nx = s.x;
      let ny = s.y;
      if (dx || dy) {
        s.path = [];
        const len = Math.hypot(dx, dy);
        // "up" is up on the screen, whichever way the block is turned
        const [ux, uy] = stage.steer(dx / len, dy / len);
        [nx, ny] = step(s.x, s.y, ux * reach, uy * reach);
      } else if (s.path.length) {
        const [tx, ty] = s.path[0];
        dx = tx - s.x;
        dy = ty - s.y;
        const d = Math.hypot(dx, dy);
        if (d <= reach) {
          [nx, ny] = [tx, ty];
          s.path.shift();
        } else [nx, ny] = [s.x + (dx / d) * reach, s.y + (dy / d) * reach];
      }
      const moving = nx !== s.x || ny !== s.y;
      if (moving) {
        // He faces the way he goes on the screen: a turned model swaps far and near.
        const [ax, ay] = stage.project(s.x, s.y);
        const [bx, by] = stage.project(nx, ny);
        if (Math.abs(by - ay) > 6e-6) s.back = by < ay;
        if (Math.abs(bx - ax) > 6e-6) s.flip = bx > ax;
        s.x = nx;
        s.y = ny;
        s.t += dt;
        follow();
      } else s.t = 0;
      draw(moving);
      const n = nearDoor(s.x, s.y);
      if (n !== s.near) {
        s.near = n;
        setNear(n);
        nearRef.current(n);
      }
      s.raf = moving || s.held.size || s.path.length ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (s.raf) return;
      last = performance.now();
      s.raf = requestAnimationFrame(tick);
    };

    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || !onScene(e)) return;
      const k = e.key.toLowerCase();
      if (MOVE[k]) {
        e.preventDefault();
        s.held.add(k);
        wake();
      } else if (s.near && (k === "e" || (k === "enter" && e.target === document.body))) {
        e.preventDefault();
        openRef.current(s.near, true);
      }
    };
    const onKeyUp = (e) => s.held.delete(e.key.toLowerCase());
    const onBlur = () => s.held.clear();
    const onClick = (e) => {
      if (e.target.closest(".spot, .walker-hint")) return;
      const r = scene.getBoundingClientRect();
      const to = stage.pick((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      if (!to) return;
      s.path = route([s.x, s.y], to);
      // Mark where he is headed (the end of the route, not the click: a click
      // on a roof sends him to the nearest ground). No route, no mark.
      const end = s.path[s.path.length - 1];
      const mark = markRef.current;
      if (end && mark) {
        s.mark = end;
        put(mark, ...end);
        const grow = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? ["none", "none"] : ["scale(0.5)", "scale(1.8)"];
        mark.animate(
          [
            { opacity: 1, transform: grow[0] },
            { opacity: 0, transform: grow[1] },
          ],
          { duration: 450, easing: EASE_OUT },
        );
      }
      wake();
    };

    draw(false);
    if (s.path.length) wake(); // the view changed under him mid-walk
    stage.subs.add(place);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    scene.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      stage.subs.delete(place);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      scene.removeEventListener("click", onClick);
    };
  }, [sceneRef, wrapRef, stage, view]);

  const spot = near ? spots.find((x) => x.id === near) : null;
  return (
    <>
      <span ref={markRef} className="walk-mark" aria-hidden="true" />
      <div ref={outerRef} className="walker" aria-hidden="true">
        <span ref={bodyRef} className="walker-body" />
      </div>
      {/* a sibling, not a child: buildings drawn over the walker must not cover it */}
      <div ref={tagRef} className="walker-tag">
        {spot ? (
          <button type="button" className="walker-hint" onClick={() => onOpen(spot.id)} aria-label={`${spot.place}: open`}>
            {spot.place}
            <kbd>e</kbd>
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Walker;
