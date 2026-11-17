import { test } from "node:test";
import assert from "node:assert/strict";
import { DOORS, START, THINGS, behind, nearDoor, route, step, walkable } from "./walk.js";

test("start and every door are on free ground", () => {
  assert.ok(walkable(...START));
  for (const [id, p] of Object.entries(DOORS)) assert.ok(walkable(...p), id);
});

test("nothing is near at the start; each door is near itself", () => {
  assert.equal(nearDoor(...START), null);
  for (const [id, p] of Object.entries(DOORS)) assert.equal(nearDoor(...p), id);
});

test("a route reaches every door and never crosses a block", () => {
  for (const [id, p] of Object.entries(DOORS)) {
    const pts = route(START, p);
    assert.deepEqual(pts.at(-1), p, id);
    let prev = START;
    for (const q of pts) {
      for (let t = 0; t <= 1; t += 0.1) assert.ok(walkable(prev[0] + (q[0] - prev[0]) * t, prev[1] + (q[1] - prev[1]) * t), `${id} at ${q}`);
      prev = q;
    }
  }
});

test("a click inside a building ends next to it; off the block, nowhere new", () => {
  const pts = route(START, [700, 480]); // the booth
  assert.ok(pts.length && walkable(...pts.at(-1)));
  assert.ok(!walkable(20, 20));
});

test("step slides along a wall instead of stopping", () => {
  // just in front of the booth, pushing up into it and a little right
  assert.ok(walkable(700, 630));
  assert.deepEqual(step(700, 630, 5, -20), [705, 630]);
});

test("behind a thing means above its base, and only where the base runs", () => {
  const booth = THINGS.find((t) => t.id === "booth");
  assert.ok(walkable(700, 400) && behind(booth, 700, 400));
  assert.ok(!behind(booth, 700, 640));
  assert.ok(!behind(booth, 900, 400));
});

test("no footprint can be stood on", () => {
  for (const { id, base } of THINGS) {
    const [x, y] = base.reduce(([a, b], [c, d]) => [a + c / base.length, b + d / base.length], [0, 0]);
    assert.ok(!walkable(x, y - 3), id);
  }
});
