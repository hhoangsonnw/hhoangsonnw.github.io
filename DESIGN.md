# Design System

## Impeccable Direction

This pass applies the local Impeccable method as a design-system layer:

- `/impeccable init`: document the site as a personal evidence archive.
- `/impeccable critique`: remove obvious AI tells: Inter everywhere, neon-purple cyber gradients, side-stripe blockquotes, repetitive cards.
- `/impeccable colorize`: move to a restrained vault palette: ink, oxidized green, sodium amber, sealed red.
- `/impeccable typeset`: use native serif/sans/mono contrast instead of a single generic font family.
- `/impeccable layout`: build archive-like rhythm with tighter controls and more deliberate section spacing.
- `/impeccable animate`: keep motion brief and functional.
- `/impeccable harden`: improve wrapping, focus states, responsive constraints, and Markdown media handling.

## Palette

- Ink: the dominant background and text anchor.
- Oxidized green: navigation, links, primary actions.
- Sodium amber: metadata, focus warmth, reading accents.
- Sealed red: danger/error tone.
- Bone: light-mode surface.

Colors are defined as CSS custom properties in OKLCH where possible.

## Typography

- Display: native editorial serif stack for the hero and article headings.
- Body: native UI sans stack for reliable reading.
- Mono: platform monospace stack for evidence, code, labels, and metadata.

## Components

- `terminal-panel` remains as the compatibility class, but its visual meaning is now "vault panel": sober borders, subtle inset depth, no default glassmorphism.
- `cyber-border` becomes a fine archival sheen, not a generic glow.
- Markdown renderer keeps React Markdown functionality and receives improved code, table, quote, and image treatments.
