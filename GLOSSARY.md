# Vague VS Code

A VS Code colour theme extension ported from the vague.nvim Neovim colorscheme, so the same look carries over to VS Code.

## Language

**Theme**:
The shipped VS Code colour theme: one dark variant covering workbench UI, syntax tokens, and semantic tokens.
_Avoid_: Colorscheme (that is the Neovim term), skin

**Palette**:
The single source of truth for every colour in the Theme, defined once and referenced by name.
_Avoid_: Colours file, swatches

**Original palette**:
The colours that vague.nvim itself defines. The Theme matches these values exactly.
_Avoid_: Upstream colours

**Derived colour**:
A colour vague.nvim does not define (for example diff backgrounds or terminal ANSI colours), computed from the Original palette to fill a VS Code need.
_Avoid_: Invented colour, extra colour

**Generator**:
The script that turns the Palette into the Theme's JSON file, so the two never drift apart.
_Avoid_: Build script, compiler

**Variant**:
A distinct Theme flavour (such as light or low-contrast). Only one Variant, dark, is in scope.
_Avoid_: Mode, flavour
