#!/usr/bin/env node
"use strict";

const fs = require("fs");
const { build, serialize, loadPalette, makeLookup, THEME_PATH } = require("./generate");

const HEX = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;
const failures = [];
const warnings = [];

const palette = loadPalette();

// 1. Every palette colour is valid hex.
const entries = [
  ...Object.entries(palette.original),
  ...Object.entries(palette.derived).map(([name, d]) => [name, d.value]),
];
for (const [name, value] of entries) {
  if (!HEX.test(value)) failures.push(`Palette colour "${name}" is not valid hex: ${value}`);
}

// 2. Derived colours name a real source, and alpha variants share its RGB.
for (const [name, d] of Object.entries(palette.derived)) {
  if (!d.reason) failures.push(`Derived colour "${name}" has no reason`);
  if (d.from === null) continue;
  if (!(d.from in palette.original)) {
    failures.push(`Derived colour "${name}" is from unknown colour "${d.from}"`);
  } else if (d.value.length === 9 && d.value.slice(0, 7).toLowerCase() !== palette.original[d.from].toLowerCase()) {
    failures.push(`Derived colour "${name}" does not share RGB with "${d.from}"`);
  }
}

// 3. No theme key references an undefined palette name (build throws on one).
let theme;
const used = new Set();
try {
  theme = build(palette, used);
  const c = makeLookup(palette);
  for (const name of Object.keys(palette.original)) c(name);
} catch (err) {
  failures.push(err.message);
}

// 3b. Every Original palette colour is used by the theme.
if (theme) {
  for (const name of Object.keys(palette.original)) {
    if (!used.has(name)) failures.push(`Original palette colour "${name}" is not used by the theme`);
  }
}

// 4. Every colour in the generated theme is valid hex.
if (theme) {
  const seen = [];
  Object.entries(theme.colors).forEach(([k, v]) => seen.push([`colors.${k}`, v]));
  theme.tokenColors.forEach((r) => r.settings.foreground && seen.push([`tokenColors.${r.name}`, r.settings.foreground]));
  Object.entries(theme.semanticTokenColors).forEach(([k, v]) => seen.push([`semanticTokenColors.${k}`, v.foreground || v]));
  for (const [where, value] of seen) {
    if (!HEX.test(value)) failures.push(`${where} is not valid hex: ${value}`);
  }
}

// 5. The committed theme file matches what the Generator would write.
if (theme) {
  const expected = serialize(theme);
  const actual = fs.existsSync(THEME_PATH) ? fs.readFileSync(THEME_PATH, "utf8") : null;
  if (actual !== expected) failures.push("themes/vague-color-theme.json is out of date; run `npm run build`");
}

// 6. Contrast: warn only, the Original palette is authoritative.
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
const o = palette.original;
const fgNames = ["fg", "comment", "builtin", "func", "string", "number", "property", "constant", "parameter", "error", "warning", "hint", "operator", "keyword", "type", "plus"];
for (const bgName of ["bg", "inactiveBg"]) {
  for (const fgName of fgNames) {
    const ratio = contrast(o[fgName], o[bgName]);
    if (ratio < 4.5) warnings.push(`${fgName} on ${bgName} is ${ratio.toFixed(2)}:1 (below WCAG AA 4.5:1)`);
  }
}

warnings.forEach((w) => console.warn(`warn: ${w}`));
if (failures.length) {
  failures.forEach((f) => console.error(`fail: ${f}`));
  process.exit(1);
}
console.log(`ok: palette and theme consistent (${warnings.length} contrast warning${warnings.length === 1 ? "" : "s"})`);
