# Vague

A dark VS Code colour theme ported from [vague.nvim](https://github.com/vague-theme/vague.nvim). The palette matches the original; credit for the design goes to its authors.

## Try it

Open this folder in VS Code and press `F5` to launch an Extension Development Host, then pick **Vague** under *Preferences: Color Theme*.

To install it as a regular extension, package it with `npx @vscode/vsce package` and install the resulting `.vsix`.

## Development

The theme is generated, not hand-edited.

- `palette.json` is the single source of colours. `original` holds the values copied from vague.nvim (the commit is recorded under `source`); `derived` holds the few colours vague.nvim has no equivalent for, each with a reason.
- `scripts/generate.js` maps palette names to VS Code workbench keys, TextMate scopes and semantic tokens.
- `themes/vague-color-theme.json` is the generated output, committed so the extension works from a clone.

```sh
npm run build   # regenerate the theme from the palette
npm run check   # validate palette, references, and that the theme is up to date
```

`check` fails on invalid hex, unknown palette names, an Original palette colour the theme never uses, or a stale theme file. It only warns on WCAG contrast, because the original palette is authoritative (vague.nvim's `comment` colour is deliberately subdued).

### Syncing with upstream

Re-syncing is manual: copy the new values into `palette.json`, update `source.commit`, run `npm run build && npm run check`.

## Styling notes

Bold and italic follow vague.nvim's defaults (italic comments and strings, bold builtins). There is no transparent variant; use `editor.tokenColorCustomizations` to override anything.

## Licence

MIT. See `LICENSE`.
