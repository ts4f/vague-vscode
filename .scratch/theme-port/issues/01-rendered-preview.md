Status: needs-triage

# Static HTML preview of the Theme

Optional. Came out of the session retro, not required by the spec.

## What

Generate a static HTML preview from the theme JSON, showing the **Palette** swatches and sample code coloured by the **Theme**, so the colours can be viewed in a browser without opening VS Code.

## Why

Whether the Theme looks right can only be judged by eye today, and that needs an Extension Development Host (F5). An agent can't do that at all. A browser-viewable preview gives an agent and a reviewer something to look at.

## Fit with the spec

This is a preview, not a screenshot test. The spec rules out automated screenshot tests ("No automated screenshot tests"), so a preview doesn't conflict with it. Like the Theme itself, it should be generated from the Palette, not hand-edited.

## Comments
