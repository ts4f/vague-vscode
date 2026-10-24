#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PALETTE_PATH = path.join(ROOT, "palette.json");
const THEME_PATH = path.join(ROOT, "themes", "vague-color-theme.json");

function loadPalette() {
  return JSON.parse(fs.readFileSync(PALETTE_PATH, "utf8"));
}

// Colour lookup by palette name. Throws on unknown names so a typo can never
// silently produce an undefined colour in the theme. The names looked up so far
// are exposed as `lookup.usedNames`.
function makeLookup(palette) {
  const usedNames = new Set();
  const lookup = (name) => {
    usedNames.add(name);
    if (name in palette.original) return palette.original[name];
    if (name in palette.derived) return palette.derived[name].value;
    throw new Error(`Unknown palette colour: "${name}"`);
  };
  lookup.usedNames = usedNames;
  return lookup;
}

function buildColors(c) {
  return {
    // Base
    foreground: c("fg"),
    focusBorder: c("search"),
    descriptionForeground: c("comment"),
    errorForeground: c("error"),
    "icon.foreground": c("operator"),
    "selection.background": c("search"),
    "widget.shadow": c("shadow"),
    "widget.border": c("line"),
    "sash.hoverBorder": c("search"),
    "toolbar.hoverBackground": c("line"),
    "progressBar.background": c("keyword"),
    "textLink.foreground": c("hint"),
    "textLink.activeForeground": c("builtin"),
    "textCodeBlock.background": c("line"),
    "textPreformat.foreground": c("constant"),
    "textBlockQuote.background": c("inactiveBg"),
    "textBlockQuote.border": c("line"),
    "textSeparator.foreground": c("line"),

    // Editor
    "editor.background": c("bg"),
    "editor.foreground": c("fg"),
    "editorCursor.foreground": c("fg"),
    "editor.lineHighlightBackground": c("line"),
    "editor.selectionBackground": c("visual"),
    "editor.inactiveSelectionBackground": c("visualSoft"),
    "editor.selectionHighlightBackground": c("visualSoft"),
    "editor.wordHighlightBackground": c("visualSoft"),
    "editor.wordHighlightStrongBackground": c("searchSoft"),
    "editor.findMatchBackground": c("search"),
    "editor.findMatchHighlightBackground": c("searchSoft"),
    "editor.findRangeHighlightBackground": c("visualSoft"),
    "editor.hoverHighlightBackground": c("searchSoft"),
    "editor.foldBackground": c("visualSoft"),
    "editor.stackFrameHighlightBackground": c("warningSoft"),
    "editor.focusedStackFrameHighlightBackground": c("warningSoft"),
    "editorLineNumber.foreground": c("comment"),
    "editorLineNumber.activeForeground": c("fg"),
    "editorIndentGuide.background1": c("visual"),
    "editorIndentGuide.activeBackground1": c("comment"),
    "editorWhitespace.foreground": c("visual"),
    "editorRuler.foreground": c("line"),
    "editorBracketMatch.background": c("visual"),
    "editorBracketMatch.border": c("comment"),
    "editorBracketHighlight.foreground1": c("keyword"),
    "editorBracketHighlight.foreground2": c("string"),
    "editorBracketHighlight.foreground3": c("parameter"),
    "editorBracketHighlight.foreground4": c("constant"),
    "editorBracketHighlight.foreground5": c("type"),
    "editorBracketHighlight.foreground6": c("func"),
    "editorBracketHighlight.unexpectedBracket.foreground": c("error"),
    "editorLink.activeForeground": c("hint"),
    "editorCodeLens.foreground": c("comment"),
    "editorInlayHint.foreground": c("comment"),
    "editorInlayHint.background": c("line"),
    "editorGutter.background": c("bg"),
    "editorGutter.modifiedBackground": c("delta"),
    "editorGutter.addedBackground": c("plus"),
    "editorGutter.deletedBackground": c("error"),
    "editorError.foreground": c("error"),
    "editorWarning.foreground": c("warning"),
    "editorInfo.foreground": c("hint"),
    "editorHint.foreground": c("hint"),
    "editorOverviewRuler.border": c("bg"),
    "editorOverviewRuler.errorForeground": c("error"),
    "editorOverviewRuler.warningForeground": c("warning"),
    "editorOverviewRuler.infoForeground": c("hint"),
    "editorOverviewRuler.modifiedForeground": c("delta"),
    "editorOverviewRuler.addedForeground": c("plus"),
    "editorOverviewRuler.deletedForeground": c("error"),

    // Diff editor
    "diffEditor.insertedLineBackground": c("diffAddBg"),
    "diffEditor.removedLineBackground": c("diffDeleteBg"),
    "diffEditor.insertedTextBackground": c("plusSoft"),
    "diffEditor.removedTextBackground": c("errorSoft"),
    "diffEditor.diagonalFill": c("line"),

    // Merge editor: vague.nvim's changed-line and changed-text colours have no
    // diff editor key, so they colour the regions both sides changed.
    "merge.currentContentBackground": c("diffChangeBg"),
    "merge.incomingContentBackground": c("diffChangeBg"),
    "merge.currentHeaderBackground": c("diffTextBg"),
    "merge.incomingHeaderBackground": c("diffTextBg"),

    // Widgets
    "editorWidget.background": c("inactiveBg"),
    "editorWidget.border": c("floatBorder"),
    "editorSuggestWidget.background": c("inactiveBg"),
    "editorSuggestWidget.border": c("floatBorder"),
    "editorSuggestWidget.foreground": c("fg"),
    "editorSuggestWidget.selectedBackground": c("visual"),
    "editorSuggestWidget.highlightForeground": c("hint"),
    "editorHoverWidget.background": c("inactiveBg"),
    "editorHoverWidget.border": c("floatBorder"),
    "peekView.border": c("search"),
    "peekViewEditor.background": c("inactiveBg"),
    "peekViewEditor.matchHighlightBackground": c("searchSoft"),
    "peekViewResult.background": c("inactiveBg"),
    "peekViewResult.selectionBackground": c("visual"),
    "peekViewResult.matchHighlightBackground": c("searchSoft"),
    "peekViewTitle.background": c("line"),
    "peekViewTitleLabel.foreground": c("fg"),
    "peekViewTitleDescription.foreground": c("comment"),

    // Inputs, buttons, dropdowns
    "input.background": c("inactiveBg"),
    "input.foreground": c("fg"),
    "input.border": c("line"),
    "input.placeholderForeground": c("comment"),
    "inputOption.activeBorder": c("search"),
    "inputOption.activeBackground": c("searchSoft"),
    "inputValidation.errorBorder": c("error"),
    "inputValidation.errorBackground": c("inactiveBg"),
    "inputValidation.warningBorder": c("warning"),
    "inputValidation.warningBackground": c("inactiveBg"),
    "inputValidation.infoBorder": c("hint"),
    "inputValidation.infoBackground": c("inactiveBg"),
    "dropdown.background": c("inactiveBg"),
    "dropdown.foreground": c("fg"),
    "dropdown.border": c("line"),
    "button.background": c("search"),
    "button.foreground": c("fg"),
    "button.hoverBackground": c("searchHover"),
    "button.secondaryBackground": c("line"),
    "button.secondaryForeground": c("fg"),
    "badge.background": c("search"),
    "badge.foreground": c("fg"),
    "checkbox.background": c("inactiveBg"),
    "checkbox.border": c("line"),

    // Lists and trees
    "list.activeSelectionBackground": c("visual"),
    "list.activeSelectionForeground": c("fg"),
    "list.inactiveSelectionBackground": c("line"),
    "list.inactiveSelectionForeground": c("fg"),
    "list.hoverBackground": c("line"),
    "list.focusBackground": c("visual"),
    "list.highlightForeground": c("hint"),
    "list.errorForeground": c("error"),
    "list.warningForeground": c("warning"),
    "tree.indentGuidesStroke": c("visual"),

    // Activity bar, side bar, title bar
    "activityBar.background": c("inactiveBg"),
    "activityBar.foreground": c("fg"),
    "activityBar.inactiveForeground": c("comment"),
    "activityBar.border": c("line"),
    "activityBar.activeBorder": c("keyword"),
    "activityBarBadge.background": c("search"),
    "activityBarBadge.foreground": c("fg"),
    "sideBar.background": c("inactiveBg"),
    "sideBar.foreground": c("fg"),
    "sideBar.border": c("line"),
    "sideBarTitle.foreground": c("fg"),
    "sideBarSectionHeader.background": c("inactiveBg"),
    "sideBarSectionHeader.foreground": c("fg"),
    "sideBarSectionHeader.border": c("line"),
    "titleBar.activeBackground": c("inactiveBg"),
    "titleBar.activeForeground": c("fg"),
    "titleBar.inactiveBackground": c("inactiveBg"),
    "titleBar.inactiveForeground": c("comment"),
    "titleBar.border": c("line"),

    // Tabs, groups, breadcrumbs
    "editorGroup.border": c("line"),
    "editorGroup.dropBackground": c("searchSoft"),
    "editorGroupHeader.tabsBackground": c("inactiveBg"),
    "editorGroupHeader.tabsBorder": c("line"),
    "tab.activeBackground": c("bg"),
    "tab.activeForeground": c("fg"),
    "tab.activeBorderTop": c("keyword"),
    "tab.inactiveBackground": c("inactiveBg"),
    "tab.inactiveForeground": c("comment"),
    "tab.unfocusedActiveForeground": c("comment"),
    "tab.unfocusedInactiveForeground": c("comment"),
    "tab.hoverBackground": c("line"),
    "tab.border": c("line"),
    "breadcrumb.foreground": c("comment"),
    "breadcrumb.focusForeground": c("fg"),
    "breadcrumb.activeSelectionForeground": c("fg"),
    "breadcrumbPicker.background": c("inactiveBg"),

    // Status bar
    "statusBar.background": c("inactiveBg"),
    "statusBar.foreground": c("fg"),
    "statusBar.border": c("line"),
    "statusBar.noFolderBackground": c("inactiveBg"),
    "statusBar.debuggingBackground": c("search"),
    "statusBar.debuggingForeground": c("fg"),
    "statusBarItem.hoverBackground": c("line"),
    "statusBarItem.prominentBackground": c("search"),
    "statusBarItem.remoteBackground": c("search"),
    "statusBarItem.remoteForeground": c("fg"),

    // Panel
    "panel.background": c("bg"),
    "panel.border": c("line"),
    "panelTitle.activeForeground": c("fg"),
    "panelTitle.activeBorder": c("keyword"),
    "panelTitle.inactiveForeground": c("comment"),

    // Terminal
    "terminal.background": c("bg"),
    "terminal.foreground": c("fg"),
    "terminal.selectionBackground": c("visual"),
    "terminalCursor.foreground": c("fg"),
    "terminal.ansiBlack": c("line"),
    "terminal.ansiRed": c("error"),
    "terminal.ansiGreen": c("plus"),
    "terminal.ansiYellow": c("warning"),
    "terminal.ansiBlue": c("keyword"),
    "terminal.ansiMagenta": c("parameter"),
    "terminal.ansiCyan": c("constant"),
    "terminal.ansiWhite": c("fg"),
    "terminal.ansiBrightBlack": c("comment"),
    "terminal.ansiBrightRed": c("ansiBrightRed"),
    "terminal.ansiBrightGreen": c("ansiBrightGreen"),
    "terminal.ansiBrightYellow": c("ansiBrightYellow"),
    "terminal.ansiBrightBlue": c("ansiBrightBlue"),
    "terminal.ansiBrightMagenta": c("ansiBrightMagenta"),
    "terminal.ansiBrightCyan": c("ansiBrightCyan"),
    "terminal.ansiBrightWhite": c("ansiBrightWhite"),

    // Git decorations
    "gitDecoration.modifiedResourceForeground": c("delta"),
    "gitDecoration.addedResourceForeground": c("plus"),
    "gitDecoration.untrackedResourceForeground": c("plus"),
    "gitDecoration.deletedResourceForeground": c("error"),
    "gitDecoration.conflictingResourceForeground": c("parameter"),
    "gitDecoration.ignoredResourceForeground": c("comment"),
    "gitDecoration.submoduleResourceForeground": c("constant"),

    // Scrollbars and minimap
    "scrollbar.shadow": c("shadow"),
    "scrollbarSlider.background": c("commentSoft"),
    "scrollbarSlider.hoverBackground": c("commentMid"),
    "scrollbarSlider.activeBackground": c("commentStrong"),
    "minimap.background": c("bg"),
    "minimap.selectionHighlight": c("visual"),
    "minimap.findMatchHighlight": c("search"),
    "minimap.errorHighlight": c("error"),
    "minimap.warningHighlight": c("warning"),
    "minimapSlider.background": c("commentSoft"),
    "minimapSlider.hoverBackground": c("commentMid"),
    "minimapSlider.activeBackground": c("commentStrong"),
    "minimapGutter.addedBackground": c("plus"),
    "minimapGutter.modifiedBackground": c("delta"),
    "minimapGutter.deletedBackground": c("error"),

    // Notifications
    "notifications.background": c("inactiveBg"),
    "notifications.foreground": c("fg"),
    "notifications.border": c("line"),
    "notificationCenterHeader.background": c("line"),
    "notificationCenterHeader.foreground": c("fg"),
    "notificationLink.foreground": c("hint"),
    "notificationsErrorIcon.foreground": c("error"),
    "notificationsWarningIcon.foreground": c("warning"),
    "notificationsInfoIcon.foreground": c("hint"),

    // Menus, quick input
    "menu.background": c("inactiveBg"),
    "menu.foreground": c("fg"),
    "menu.selectionBackground": c("visual"),
    "menu.selectionForeground": c("fg"),
    "menu.separatorBackground": c("line"),
    "menu.border": c("line"),
    "menubar.selectionBackground": c("visual"),
    "menubar.selectionForeground": c("fg"),
    "quickInput.background": c("inactiveBg"),
    "quickInput.foreground": c("fg"),
    "quickInputList.focusBackground": c("visual"),
    "quickInputList.focusForeground": c("fg"),
    "quickInputTitle.background": c("line"),
    "pickerGroup.foreground": c("keyword"),
    "pickerGroup.border": c("line"),

    // Settings UI
    "settings.headerForeground": c("fg"),
    "settings.modifiedItemIndicator": c("delta"),
    "settings.textInputBackground": c("inactiveBg"),
    "settings.textInputBorder": c("line"),
    "settings.checkboxBackground": c("inactiveBg"),
    "settings.checkboxBorder": c("line"),
    "settings.dropdownBackground": c("inactiveBg"),
    "settings.dropdownBorder": c("line"),
  };
}

function buildTokenColors(c) {
  const rule = (name, scope, foreground, fontStyle) => {
    const settings = {};
    if (foreground) settings.foreground = c(foreground);
    if (fontStyle) settings.fontStyle = fontStyle;
    return { name, scope, settings };
  };

  return [
    rule("Comment", ["comment", "punctuation.definition.comment"], "comment", "italic"),
    rule("String", ["string", "string.quoted", "punctuation.definition.string"], "string", "italic"),
    rule("Regexp", ["string.regexp"], "string"),
    rule("Escape", ["constant.character.escape"], "keyword"),
    rule("Number", ["constant.numeric"], "number"),
    rule("Language constant", ["constant.language", "support.constant.builtin"], "number", "bold"),
    rule("Constant", ["constant", "constant.other", "variable.other.constant", "support.constant"], "constant"),
    rule("Keyword", ["keyword", "keyword.control", "storage", "storage.type", "storage.modifier", "meta.preprocessor", "entity.name.function.preprocessor"], "keyword"),
    rule("Operator", ["keyword.operator"], "operator"),
    rule("Function", ["entity.name.function", "support.function"], "func"),
    rule("Function call", ["meta.function-call entity.name.function", "meta.function-call.generic"], "parameter"),
    rule("Builtin function", ["support.function.builtin", "support.function.magic"], "func"),
    rule("Type", ["entity.name.type", "entity.name.class", "support.type", "support.class", "entity.other.inherited-class"], "type"),
    rule("Builtin type", ["support.type.primitive", "support.type.builtin", "storage.type.primitive", "storage.type.built-in"], "builtin", "bold"),
    rule("Structure", ["entity.name.type.class", "entity.name.type.enum", "entity.name.type.interface", "entity.name.type.struct", "entity.name.type.type-parameter"], "constant"),
    rule("Namespace", ["entity.name.namespace", "entity.name.type.module"], "fg"),
    rule("Variable", ["variable", "variable.other"], "fg"),
    rule("Parameter", ["variable.parameter", "meta.parameter"], "parameter"),
    rule("Property", ["variable.other.property", "support.variable.property", "meta.object-literal.key", "support.type.property-name"], "property"),
    rule("Enum member", ["variable.other.enummember"], "builtin"),
    rule("Self reference", ["variable.language"], "builtin"),
    rule("Punctuation", ["punctuation", "meta.brace", "meta.delimiter"], "fg"),
    rule("Tag", ["entity.name.tag"], "builtin"),
    rule("Tag delimiter", ["punctuation.definition.tag"], "fg"),
    rule("Tag attribute", ["entity.other.attribute-name"], "constant"),
    rule("Heading", ["markup.heading", "entity.name.section"], "keyword", "bold"),
    rule("Bold", ["markup.bold"], null, "bold"),
    rule("Italic", ["markup.italic"], null, "italic"),
    rule("Link text", ["string.other.link", "markup.underline.link.image"], "string", "underline"),
    rule("Link URL", ["markup.underline.link", "string.other.link.description"], "func"),
    rule("List marker", ["punctuation.definition.list.begin", "markup.list"], "func"),
    rule("Inline code", ["markup.inline.raw", "markup.fenced_code", "markup.raw"], "constant"),
    rule("Quote", ["markup.quote"], "comment"),
    rule("Inserted", ["markup.inserted"], "plus"),
    rule("Changed", ["markup.changed"], "delta"),
    rule("Deleted", ["markup.deleted"], "error"),
    rule("Invalid", ["invalid", "invalid.illegal"], "error"),
  ];
}

function buildSemanticTokenColors(c) {
  const style = (foreground, fontStyle) => (fontStyle ? { foreground: c(foreground), fontStyle } : c(foreground));
  return {
    class: style("constant"),
    enum: style("constant"),
    interface: style("constant"),
    struct: style("constant"),
    type: style("type"),
    typeParameter: style("constant"),
    namespace: style("fg"),
    enumMember: style("builtin"),
    function: style("parameter"),
    "function.declaration": style("func"),
    "function.defaultLibrary": style("func"),
    method: style("type"),
    macro: style("keyword"),
    parameter: style("parameter"),
    selfParameter: style("builtin"),
    property: style("type"),
    variable: style("constant"),
    "variable.declaration": style("property"),
    "variable.defaultLibrary": style("number", "bold"),
    "variable.readonly": style("constant"),
    comment: style("comment", "italic"),
    string: style("string", "italic"),
    number: style("number"),
    keyword: style("keyword"),
    operator: style("operator"),
    regexp: style("string"),
    builtinType: style("builtin", "bold"),
    builtinConstant: style("number", "bold"),
  };
}

// The theme, plus the palette names it referenced.
function buildWithUsage(palette = loadPalette()) {
  const c = makeLookup(palette);
  const theme = {
    $schema: "vscode://schemas/color-theme",
    name: "Vague",
    type: "dark",
    semanticHighlighting: true,
    colors: buildColors(c),
    tokenColors: buildTokenColors(c),
    semanticTokenColors: buildSemanticTokenColors(c),
  };
  return { theme, usedNames: c.usedNames };
}

function build(palette) {
  return buildWithUsage(palette).theme;
}

function serialize(theme) {
  return JSON.stringify(theme, null, 2) + "\n";
}

if (require.main === module) {
  fs.mkdirSync(path.dirname(THEME_PATH), { recursive: true });
  fs.writeFileSync(THEME_PATH, serialize(build()));
  console.log(`Wrote ${path.relative(ROOT, THEME_PATH)}`);
}

module.exports = { build, buildWithUsage, serialize, loadPalette, THEME_PATH };
