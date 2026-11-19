# Ranklit brand: logo use

There are two logo families. Both use the same custom-drawn wordmark, and both are always kept up to date.

| Family | Idea | Status |
| --- | --- | --- |
| **folded-map** | A three-panel folded map. The lit purple middle panel holds your spot. Reads as "local maps" at a glance. | Backup |
| **lit-r** | The r reaches out and lights up your spot. The same lit dot is the dot on the *i* in the wordmark. | **Active** |

All logo shapes are custom-drawn filled outlines. No font is used, so there are no font licences to worry about.

## Files
`public/brand/` holds the **active** family. `public/brand/folded-map/` and `public/brand/lit-r/` each hold a complete kit, including `ranklit-app-icon-180.png`.

| File | Use |
| --- | --- |
| `ranklit-lockup.svg` | Default. Symbol + wordmark, on light backgrounds |
| `ranklit-lockup-white.svg` | On ink or dark photos |
| `ranklit-lockup-ink.svg` | One colour: fax, stamps, engraving, embroidery |
| `ranklit-symbol.svg` | Avatars, social, stickers |
| `ranklit-symbol-small.svg` | Under 32 px (thicker border). Used as `src/app/icon.svg` |
| `ranklit-symbol-ink.svg` / `-white.svg` | One-colour symbol without the tile |
| `ranklit-wordmark*.svg` | Where the symbol already appears nearby |
| `ranklit-app-icon.svg` | App stores / iOS (full bleed, the OS rounds the corners). Copied to `src/app/apple-icon.png` |

In code, use `<Logo />`, `<LogoMark />` and `<Wordmark />` from `src/components/logo.tsx`. That file is generated for the active family.

## Colours
| Name | HEX | RGB | CMYK (approx.) |
| --- | --- | --- | --- |
| Ink | `#1a1523` | 26 21 35 | 26 40 0 86 |
| Lit purple | `#9b47cc` | 155 71 204 | 24 65 0 20 |
| Lime | `#c6f432` | 198 244 50 | 19 0 80 4 |

The CMYK values are a plain conversion. Get a printed proof before any print run, and choose Pantone matches from a physical swatch book.

## Rules
- **Clear space:** keep at least 22% of the symbol's height free on every side. That is the lit dot's diameter, or one map panel's width.
- **Minimum size:**
  - Symbol: 16 px / 4 mm
  - Lockup: 20 px / 6 mm tall
  - Wordmark: 14 px tall
- **Backgrounds:** cream, white, ink or brand purple. On busy photos, use the white lockup on a solid ink panel.
- **Don't:**
  - stretch, rotate or re-colour outside this palette
  - add gradients, glows or outlines
  - retype "ranklit" in a font
  - put the dot in the wrong place
  - put the old map pin back

## Switch logos, edit, re-export
The geometry lives in two files:
- `scripts/brand/gen.py`: the wordmark and lit-r
- `scripts/brand/gen_alt.py`: folded-map and the unused shop concept

Grid rules: unit 8, stroke 40 for the wordmark and 48 for the symbols, angles of 0, 45 and 90° only.

```
python3 scripts/brand/kit.py --active folded-map   # or: --active lit-r
cp public/brand/<family>/ranklit-app-icon-180.png src/app/apple-icon.png
```
If you change a symbol's geometry, re-render its app icon:
```
google-chrome --headless=new --default-background-color=00000000 --window-size=180,180 \
  --screenshot=public/brand/<family>/ranklit-app-icon-180.png "file://$PWD/public/brand/<family>/ranklit-app-icon.svg"
```

## Before you file a trademark
The design was checked for resemblance to common category marks: map pins, the Wi-Fi icon, the Google Maps pin. Folded-map icons are generic; the lit middle panel and spot are the distinctive part. It was also turned and mirrored to check for unwanted readings.

That is **not legal clearance**. Before you register or spend money on signage:
1. Search the name "Ranklit" and the logo on the USPTO and EUIPO databases, and in every country you sell in. Use class 42 (SaaS) and class 35 (marketing services).
2. Run a reverse image search on `ranklit-symbol.svg`.
3. Have a trademark attorney confirm the results.

**For a vector editor:** each part of the symbol and wordmark is a separate closed path. They render correctly as they are. If you want one compound shape, run Unite or Pathfinder in Illustrator, Figma or Inkscape.
