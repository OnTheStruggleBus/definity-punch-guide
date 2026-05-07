# Definity Punchdown Reference — Claude Code Guide

## Project Overview

An interactive single-page reference app for Avaya Definity PBX MDF wiring.
Built with React + Vite. Deployed via Docker/nginx or GitHub Pages.

**Purpose:** Field reference for punching down DCP, analog, and BRI S/T station
wiring across Cat5 jacks, 110 AC2-300SBM/6 MDF blocks, and 66 blocks.

---

## Tech Stack

- **Framework:** React 18 + Vite 5
- **Styling:** Inline styles only — no CSS files, no Tailwind, no CSS modules
- **Fonts:** Google Fonts (Share Tech Mono, Barlow Condensed) via CDN import in component
- **State:** React useState only — no Redux, no Context, no external state library
- **Build output:** Static HTML/CSS/JS in `dist/`
- **Deployment:** Docker + nginx (local network) or GitHub Pages (public)

---

## Project Structure

```
definity-guide/
├── CLAUDE.md                  ← you are here
├── index.html                 ← Vite entry point
├── vite.config.js
├── package.json
├── Dockerfile                 ← multi-stage: node build → nginx serve
├── docker-compose.yml         ← exposes port 3000
├── nginx.conf                 ← SPA routing + gzip + cache headers
├── README.md
├── .github/
│   └── workflows/
│       ├── deploy.yml         ← GitHub Pages deployment on push to main
│       └── claude.yml         ← Claude Code PR assistance (@claude mentions)
└── src/
    ├── main.jsx               ← ReactDOM.createRoot entry
    └── App.jsx                ← ENTIRE application (single file, ~1400 lines)
```

---

## Single-File Architecture

**App.jsx contains everything:**
- All data constants (PORT_TYPES, PIN_DATA, PAIR_25, CARD_MAPS, SIG_STYLES)
- All helper components (WireStripe, SHdr, JackDiagram, Block110, MDFMapVisual, etc.)
- Main export default PunchGuide component

**Do not split into multiple files** — the single-file approach is intentional for
portability. The whole app can be dropped into any React project as one file.

**Do not add CSS files or external component libraries.** All styling is inline.

---

## Data Structures

### PORT_TYPES
Defines each port type (dcp2, dcp1, analog, bri). Each entry has:
- `pins[]` — which RJ45 pins are active (T568B)
- `pairsUsed` — how many 25-pair Amphenol pairs consumed per port
- `conductors[]` — per-conductor signal label, wire color, jack pin, pair reference
- `maxPorts` — max port number for the port selector (default 8, 12 for BRI)
- `noSkip` — true for BRI (no pair skipping), not set for analog (skip every other)

### CARD_MAPS
MDF pair map data for 14 TN card types. Each card has:
- `pairs[]` — array of 25 objects, each: `{port: N, type: 'TR'|'TX'|'PX'|'GND'}` or `null`
- Generated using the `mk(type, port)` helper function

### PIN_DATA
8-element array for the RJ45 jack visual, one per pin 1-8. T568B color scheme.

### PAIR_25
25-element array for the full 25-pair color sequence with hex colors for swatches.

---

## Tabs

| Tab ID | Content |
|--------|---------|
| `jack` | Cat5 T568B jack diagram + full pin reference table |
| `b110` | 110 AC2-300SBM/6 MDF block diagram with clip visualization |
| `b66` | 66 block row sequence + conductor-to-Amphenol mapping |
| `pairs` | Full 25-pair color reference with per-port highlighting |
| `mdfmap` | MDF pair map for TN cards (visual 25-square grid) |
| `labels` | Cable label anatomy + port type color key + 66 block labeling guide |

---

## Key Technical Notes

### DCP 2-pair (TN754, TN2182, TN2224)
- Jack pins 1, 2, 3, 5 — NOT the standard Ethernet 1,2,3,4,5,6
- Pin 4 (Bu/W) is explicitly NOT connected
- Source: Avaya J.Neuhaus diagram 12 Jan 2008 (8400-series 4-wire)
- Orange pair (pins 1,2) = TXT/TXR | Non-standard mix (pins 3,5) = PXT/PXR

### BRI S/T (TN556C/D)
- Jack pins 3, 4, 5, 6 — all four used
- Blue pair (pins 4,5) = PXT/PXR (PBX transmit)
- Green pair translated (pins 3,6) = TXT/TXR (Terminal transmit)
- Color translation at 66 block: 25-pair W-O/O-W → Cat5 W/Gn, Gn/W
- NO pair skipping on 66 block (unlike Audix analog ports)
- 100Ω terminating resistor required — 440A4 adapter or Avaya 110RA1-12 block
- Source: Avaya 555-245-773 Issue 4.1 June 2005 (TN556D, C variant assumed equivalent)

### Analog Audix ports (TN793, TN2182)
- Non-consecutive port assignment required: use ports 1, 3, 5, 7 only
- Skip even ports to avoid Dialogic card contention and false seizures

### 110 Block
- Avaya 110 AC2-300SBM/6 — prewired, clips pre-installed, do not remove
- 12 rows × 25 pairs = 300 pairs total
- Cross-connect wire from spool is single twisted pair blue/white-blue only
- White-dominant = always Tip, Solid color = always Ring — non-negotiable

---

## Development Commands

```bash
npm install          # install dependencies
npm run dev          # dev server at localhost:5173
npm run dev:host     # dev server exposed on local network (0.0.0.0)
npm run build        # production build to dist/
npm run preview      # preview production build on network
```

### Docker
```bash
docker compose up -d          # build and run at :3000
docker compose up -d --build  # rebuild after App.jsx changes
docker compose down           # stop
```

---

## GitHub Pages Deployment

The `deploy.yml` workflow builds and deploys to GitHub Pages on every push to `main`.

**Important:** If the repo is NOT at `username.github.io` (i.e. it has a path like
`/definity-punchdown-guide/`), set the `base` in `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPO-NAME/',  // add this line
})
```

The workflow sets `VITE_BASE_URL` to handle this automatically using the repo name.

---

## Claude Code GitHub Integration

The `claude.yml` workflow enables @claude mentions in PRs and issues.

**Trigger:** Comment `@claude` in any PR or issue with a task description.

**Example tasks:**
- `@claude review this PR for any signal label errors in the BRI wiring data`
- `@claude add a new port type for TN762 hybrid card`
- `@claude update the MDF pair map to add TN2182 as a separate card entry`
- `@claude fix the color contrast issue on the WireStripe component`

**Permissions:** Claude can read files and suggest changes via PR. It cannot
push directly to main — all changes go through a PR for human review.

---

## Coding Standards

- **No TypeScript** — plain JSX only
- **Inline styles only** — no className, no CSS files
- **Mono font:** `'Share Tech Mono', monospace` for all technical labels
- **Display font:** `'Barlow Condensed', sans-serif` for headers and labels
- **Dark theme only** — background #0A0E1A, never light mode
- **Color palette:** Use existing PORT_TYPES colors for consistency
  - DCP 2-pair: #0D47A1 (blue)
  - DCP 1-pair: #4A148C (purple)
  - Analog: #BF360C (orange-red)
  - BRI S/T: #00695C (teal)
- **Wire swatches:** Always use WireStripe component, never raw divs for wires
- **Section headers:** Always use SHdr component
- **No external UI libraries** — lucide-react, shadcn, etc. are not available

---

## Adding a New Port Type

1. Add entry to `PORT_TYPES` array with all required fields
2. Add corresponding entry to `CARD_MAPS` if it's a TN card type
3. Add to Labels tab port color key (search for `BLOCK: DCP-2P` pattern)
4. Update port selector max buttons if needed (`maxPorts` field)
5. Verify signal labels against official Avaya documentation before committing

## Adding a New TN Card to MDF Map

1. Add entry to `CARD_MAPS` array using `mk(type, port)` helper
2. Follow the 25-pair sequential pattern from Avaya 555-245-773
3. Use `null` for unused pair positions
4. `GND` type for ground pairs (typically pair 25 or pairs 49/50)
5. Card color should be distinct from existing cards for visual clarity

---

## Source Documentation

| Reference | Content |
|-----------|---------|
| Avaya 555-245-773 Issue 4.1 Jun 2005 | TN556D BRI pinout (Table 7) |
| Avaya J.Neuhaus diagram 12 Jan 2008 | 8400-series 4-wire DCP jack wiring |
| Avaya KLC 063097 | MDF cross-connect pair map (all TN cards) |
| Tek-Tips community (verified) | BRI S/T 66 block color translation |
| Avaya official install docs | 110RA1-12 terminating resistor requirement |
