import { test } from "node:test";
import assert from "node:assert/strict";
import { TEXTS, normalizeTexts } from "./feeds.js";

test("normalizeTexts falls back to the seed for junk, blanks and unknown keys", () => {
  assert.deepEqual(normalizeTexts(null), TEXTS);
  const t = normalizeTexts({
    dossier: { genre: "  trap  ", status: "   ", evil: "x" },
    spots: { merch: 42 },
    log: ["", "  one line ", 7],
  });
  assert.equal(t.dossier.genre, "trap");
  assert.equal(t.dossier.status, TEXTS.dossier.status);
  assert.equal("evil" in t.dossier, false);
  assert.equal(t.spots.merch, TEXTS.spots.merch);
  assert.deepEqual(t.log, ["one line"]);
  assert.deepEqual(normalizeTexts({ log: ["  "] }).log, TEXTS.log);
  assert.equal(normalizeTexts({ map: { state: "x".repeat(500) } }).map.state.length, 120);
});
