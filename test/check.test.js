"use strict";

const { test, after } = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

const projectDirs = [];
after(() => projectDirs.forEach((dir) => fs.rmSync(dir, { recursive: true, force: true })));

// A throwaway copy of the project, so tests can change the palette and run the
// real scripts exactly as `npm run build` / `npm run check` do.
function makeProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "vague-"));
  projectDirs.push(dir);
  fs.cpSync(path.join(ROOT, "scripts"), path.join(dir, "scripts"), { recursive: true });
  fs.cpSync(path.join(ROOT, "themes"), path.join(dir, "themes"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "palette.json"), path.join(dir, "palette.json"));
  return {
    dir,
    editPalette(edit) {
      const file = path.join(dir, "palette.json");
      const palette = JSON.parse(fs.readFileSync(file, "utf8"));
      edit(palette);
      fs.writeFileSync(file, JSON.stringify(palette, null, 2));
    },
    run(script) {
      const result = spawnSync(process.execPath, [path.join(dir, "scripts", `${script}.js`)], { encoding: "utf8" });
      return { status: result.status, output: result.stdout + result.stderr };
    },
    // Regenerates the theme and returns the file's contents.
    generate() {
      this.run("generate");
      return fs.readFileSync(path.join(dir, "themes", "vague-color-theme.json"), "utf8");
    },
  };
}

test("an Original palette colour the Theme never uses fails the check", () => {
  const project = makeProject();
  project.editPalette((p) => {
    p.original.unusedColour = "#123456";
  });
  project.generate();

  const result = project.run("check");

  assert.strictEqual(result.status, 1);
  assert.match(result.output, /unusedColour/);
});

test("the committed project passes the check", () => {
  const result = makeProject().run("check");

  assert.strictEqual(result.status, 0, result.output);
});

test("regenerating gives byte-identical output", () => {
  const project = makeProject();
  const first = project.generate();

  assert.strictEqual(project.generate(), first);
});

test("the Theme does not depend on palette key order", () => {
  const project = makeProject();
  const before = project.generate();
  const reversed = (obj) => Object.fromEntries(Object.entries(obj).reverse());
  project.editPalette((p) => {
    p.original = reversed(p.original);
    p.derived = reversed(p.derived);
  });

  assert.strictEqual(project.generate(), before);
});
