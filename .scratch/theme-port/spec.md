Status: ready-for-agent

# Vague VS Code theme port

## Problem Statement

A developer who uses the vague.nvim colourscheme in Neovim has no matching theme in VS Code. They want the same palette and feel in the editor they use for other work, without hand-tuning a theme or accepting a loose approximation.

## Solution

A VS Code extension shipping one dark **Theme**, ported from vague.nvim. Its colours match the **Original palette** exactly, colours vague.nvim lacks are **Derived colours** computed from it, and the Theme is produced by a **Generator** from a single **Palette**, so the two never drift apart. It installs locally as a `.vsix` first.

## User Stories

1. As a vague.nvim user, I want the same colours in VS Code, so that my editors look consistent.
2. As a user, I want every colour vague.nvim defines to appear with its exact value, so that the port is faithful.
3. As a user, I want a dark theme selectable as "Vague" in the colour theme picker, so that I can switch to it easily.
4. As a user, I want comments and strings to be italic and builtins to be bold as in vague.nvim, so that the syntax emphasis matches.
5. As a user, I want syntax highlighting without needing a language server, so that it works in every file type.
6. As a user with a language server, I want semantic highlighting to refine token colours the way vague.nvim's LSP groups do, so that coloured roles are consistent.
7. As a user, I want the editor, tabs, sidebar, activity bar, status bar, panel and title bar themed, so that no surface clashes with the rest.
8. As a user, I want the terminal's 16 ANSI colours taken from vague.nvim, so that terminal output matches Neovim's terminal.
9. As a user, I want git decorations (added, modified, deleted, untracked, ignored) coloured from the palette, so that file status is readable at a glance.
10. As a user, I want diff editor backgrounds to match vague.nvim's diff colours, so that diffs look like they do in Neovim.
11. As a user, I want inline diff text highlights that layer over the line background, so that changed words stand out.
12. As a user, I want suggest, hover, peek, notification and quick-input widgets themed, so that popups fit the theme.
13. As a user, I want inputs, buttons, dropdowns, badges, menus and the settings UI themed, so that configuration screens match.
14. As a user, I want scrollbars and the minimap to use translucent palette-derived colours, so that they are visible without being loud.
15. As a user, I want bracket pair colours drawn from the palette, so that nested brackets are distinguishable.
16. As a user, I want the selection, find match and word highlight colours to be clearly distinct, so that I can see what is selected and what matched.
17. As a user, I want to override any colour with `editor.tokenColorCustomizations` or `workbench.colorCustomizations`, so that I can adjust the theme to my taste.
18. As a maintainer, I want one `palette.json` as the only place colours are defined, so that I change a colour in one place.
19. As a maintainer, I want the theme JSON generated from the palette, so that it cannot drift from it.
20. As a maintainer, I want the palette to record the upstream repo and commit it was copied from, so that I know what to re-sync against.
21. As a maintainer, I want each Derived colour to name its source colour and give a reason, so that I can tell it apart from an upstream value.
22. As a maintainer, I want a check that fails on invalid hex, so that a typo cannot ship.
23. As a maintainer, I want a check that fails when a theme key names an undefined palette colour, so that a rename cannot silently drop a colour.
24. As a maintainer, I want a check that fails when the committed theme is stale, so that I never publish an out-of-date file.
25. As a maintainer, I want contrast problems reported as warnings only, so that deliberately subdued upstream colours do not block a build.
26. As a contributor, I want to run the extension from a clone with F5, so that I can see changes immediately.
27. As a contributor, I want the generated theme committed, so that the extension works straight from a clone.
28. As a maintainer, I want to build a `.vsix` locally, so that I can install the theme before it is published.
29. As a maintainer, I want the licence to credit vague.nvim's author, so that attribution is correct.
30. As a maintainer, I want the build and check to need no dependencies, so that a clone works without installing anything.

## Implementation Decisions

- One dark **Variant** only. No light or low-contrast variants, and no transparent option.
- **Palette**: a single JSON file with `original` colours (copied exactly from vague.nvim, covering its named colours, terminal ANSI bright colours and diff backgrounds), `derived` colours (each with a value, a source colour and a reason), and a `source` block recording upstream repo, commit and files.
- **Original palette** is authoritative. It is never adjusted for accessibility.
- **Derived colours** are limited to gaps upstream does not cover: translucent variants of `plus`, `error`, `warning`, `search`, `visual` and `comment`, a shadow, and a lightened `search` for button hover. A translucent Derived colour must share its source's RGB.
- **Generator**: plain Node, no dependencies. It looks colours up by palette name and throws on an unknown name. It maps names onto workbench colour keys, TextMate scopes, and semantic token colours, and enables semantic highlighting in the Theme.
- Syntax uses generic TextMate scopes, with no per-language rules at first. Per-language fixes are added only when a real mis-colouring appears.
- Semantic token colours follow vague.nvim's LSP group links, including `variable` using the `constant` colour and `function` using the `parameter` colour.
- Bold and italic follow vague.nvim defaults: italic comments and strings, bold language constants and builtin types, bold headings.
- Upstream's changed-line and changed-text diff colours (`diffChangeBg`, `diffTextBg`) have no diff editor key, so they colour the merge editor's current and incoming regions. This keeps every Original palette colour in use.
- Workbench coverage: the mainstream surfaces listed in the user stories. Niche surfaces such as the debug toolbar and notebooks are deferred.
- The generated Theme file is committed so the extension works from a clone.
- Extension manifest targets VS Code `^1.90.0`. The publisher id is a placeholder until publishing.
- The repo is MIT-licensed, with the licence and README crediting vague.nvim.
- Distribution is a local `.vsix` first. Marketplace and Open VSX publishing comes later.

## Testing Decisions

- A good test checks external behaviour: given a palette, the generated Theme is correct and consistent. It does not assert on how individual scope rules are written, because those are expected to change as colouring is tuned.
- One seam: `palette.json` in, generated theme JSON out, exercised through the existing `npm run check`. Extend that script rather than adding a test framework or dependency.
- Checks to keep or add through that seam: valid hex across palette and theme; unknown palette names fail the build; Derived colours name a real source and a reason, and translucent ones share the source's RGB; every Original palette colour is looked up by the Generator; the committed Theme equals the Generator's output; contrast reports warnings and never failures. Determinism is not checked separately: the Generator is deterministic by construction, so a check could not realistically fail.
- Visual quality is verified manually in an Extension Development Host across sample files in several languages, the diff editor, the terminal and the settings UI. No automated screenshot tests. There is no separate test harness: the checks are small enough to try by hand when changed, and a harness can be added if `check.js` grows more rules.
- Prior art: `scripts/check.js` already covers hex validity, derived-colour consistency, undefined names, staleness and contrast.

## Out of Scope

- Light, low-contrast or transparent variants.
- Per-language scope tuning before a mis-colouring is observed.
- Niche workbench surfaces: debug toolbar, notebooks and similar.
- Marketplace and Open VSX publishing, marketplace icon and gallery banner.
- Automated screenshot or visual-regression tests.
- Automation of upstream syncing. Re-syncing with vague.nvim stays manual.
- Accessibility adjustments to the Original palette.

## Further Notes

- The palette was verified against vague.nvim at commit `73f8aaa866bf3d14dd0b0ab9e48c11794c1cb7ab`. The upstream repo has moved to the `vague-theme` organisation.
- `comment` on `bg` is 3.02:1 and on `inactiveBg` 2.78:1, below WCAG AA. This is deliberate upstream and reported as a warning only.
- Upstream `variable` semantic colouring (`constant`, `#aeaed1`) differs from `fg`, so variables in language-server files will look lilac. Kept for faithfulness; revisit if it looks wrong in practice.
- No existing VS Code port of vague.nvim was found, though the search was not conclusive. Worth re-checking before publishing.
