# Public poster theme

The public content uses an opt-in `.poster-theme` wrapper. Its palette pairs ivory rice-paper surfaces with charcoal ink and crimson accents. Navigation, footer, authentication, account, administration, payment and private confirmation screens retain their dark treatment.

## Design tokens

| Token | Color | Purpose |
| --- | --- | --- |
| `--poster-paper` | `#faf7f2` | Main ivory background |
| `--poster-beige` | `#efe7db` | Beige paper accents |
| `--poster-surface` | `#fffdf9` | Cards and fields |
| `--poster-ink` | `#242321` | Headings and primary text |
| `--poster-muted` | `#625b50` | Supporting text |
| `--poster-red` | `#c91524` | Primary actions and accents |
| `--poster-red-dark` | `#a90c1a` | Red text and hover state |
| `--poster-line` | `#d6cbbd` | Paper borders and table dividers |

These tokens are defined in `src/app/globals.css`. The scoped utility bridge adapts existing public-page color classes without rewriting factual copy or changing layouts. New reusable UI should prefer semantic classes and these tokens rather than adding more legacy-color mappings.

## Invariants and exclusions

- The homepage's complete first hero remains outside `.poster-theme`: its photo, overlays, text, positioning, dimensions and buttons are unchanged. Do not move the wrapper above the hero or change the global `.hero-title` style for poster-specific typography.
- `.poster-preserve` excludes an element and all descendants from palette remapping. Use it for authentic photograph overlays/captions or true-color swatches requiring their original appearance. Its default foreground is light for dark photographic treatments; white/yellow swatches still need an explicit dark label if added.
- `[role="dialog"]` and all descendants retain the original dark palette. Document images and PDF content are never recolored; only surrounding public-page controls use the poster palette.
- `.poster-card` provides the softly raised paper card treatment. `.poster-art-frame` provides the ivory illustration frame. Shared `SectionHeading` and `ButtonLink` semantic hooks only acquire their new styles inside the theme.
- Do not use global color inversion or filter authentic photos, certificate images, logos, QR codes, or supplied grading diagrams.

## Verification

`npm.cmd run test:design -- http://localhost:3101` verifies the original hero file hash and complete hero JSX, 16 512px WebP assets, asset delivery, and same-origin embedding for the public grading PDF while normal pages remain protected. `npm.cmd run test:seo -- http://localhost:3101` checks all 41 public pages and seven private routes.

Check desktop and narrow-screen layouts, primary/secondary buttons, keyboard focus, form labels and placeholders, validation and success states, filters, tables, photo captions, document dialogs and grading images. Compare the first homepage hero before and after any changes.

Run targeted ESLint, the build, and `git diff --check`. On Windows PowerShell installations that block `.ps1` shims, use `npx.cmd` and `npm.cmd` without changing the machine execution policy.

## Artwork and exact generation prompts

All 16 unique illustrations were generated using the built-in image generation tool with the supplied poster as a style reference and the official academy logo as a branding reference. They replace the small feature/program/athlete graphics and are reused decoratively in coach highlight cards. Authentic photographs, certificate scans, official belt diagrams and the syllabus remain unchanged.

Final workspace assets (512px WebP, about 1.11 MB total):

- `public/images/poster-cards/features/`: `professional-shotokan.webp`, `olympic-style-karate.webp`, `kata.webp`, `kumite.webp` — [exact prompts and original sources](poster-feature-art.md).
- `public/images/poster-cards/programs/`: `kids-shotokan.webp`, `teen-shotokan.webp`, `adult-shotokan.webp`, `competition-training.webp` — [exact prompts and original sources](poster-program-art.md).
- `public/images/poster-cards/athletes/`: `advanced-kata.webp`, `advanced-kumite.webp`, `competition-strategy.webp`, `athletic-conditioning.webp`, `performance-analysis.webp`, `competition-rules.webp`, `mental-preparation.webp`, `individual-coaching.webp` — [exact prompts and original sources](poster-athlete-art.md).

The PNG copies in `public` were conversion intermediates and removed after inspection. Original generated PNGs remain at the source paths recorded in the manifests. To update artwork, copy the new selected PNGs into the corresponding card folder, run `node scripts/optimize-poster-art.mjs`, inspect the complete uncropped output, then retain only the final WebP delivery assets. AI-rendered chest-emblem micro-lettering is approximate, not a pixel-perfect reproduction of the official logo.
