# Claros Design Spec (LLM Optimized)

## Purpose

Single source of truth for UI/UX behavior in Claros. This file is optimized for agent use: concise constraints, explicit contracts, and current implementation reality.

## LLM Editing Policy

### MUST

- Favor shortest correct wording and low-token structures.
- Update aggressively when reality changes; do not preserve stale design intent.
- Keep this file as executable constraints, not storytelling.

### SHOULD

- Use compact bullets with one constraint per line.
- Prefer defaults + exceptions over exhaustive prose.

### AVOID

- Repeating rules across sections.
- Decorative copy that does not change implementation decisions.

## Scope

- App: Next.js App Router
- Routes: `/`, `/loans`, `/tax`, `/legal`
- Screen width target: mobile-first, max content width 400px

## Non-Negotiables

### MUST

- Keep interactions scrub-first and consequence-first (EMI/take-home before form details).
- Keep canvas theme colors sourced from `THEMES_CANVAS` in JS, not DOM reads.
- Keep animation loops cleaned up with `cancelAnimationFrame`.
- Keep Indian number formatting and parsing (`en-IN`, `L`, `Cr`).
- Keep minimum touch target at least 44px.

### SHOULD

- Prefer subtle motion using `cubic-bezier(0.16, 1, 0.3, 1)`.
- Keep visuals low-noise: muted labels, stronger numeric hierarchy.
- Keep progressive disclosure via collapsibles.

### AVOID

- Blanket transitions on broad selectors.
- Third-party animation/component/state libraries unless explicitly requested.
- Replacing scrub interactions with sliders.

## Brand Contract

- Name: `Claros`
- Tagline: `Financial clarity, one decision at a time.`
- India badge: tricolor SVG + text `Designed in Bengaluru, India`
- Signature mood: calm, premium, precise, non-gamified

## Typography Contract

- Font stack: `'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`
- Hero numbers: 36-40px, weight 200, negative tracking, tabular nums
- Control values: 24px, weight 200
- Labels/meta: 9-12px with uppercased microcopy where appropriate
- Legal body: 12px with ~1.7 line height

## Color Contract

### CSS tokens

- Core: `--bg`, `--text-primary`, `--text-secondary`
- Muted scale: `--text-muted`, `--text-muted-mid`, `--text-muted-strong`, `--text-muted-faint`
- Semantic: `--warn`, `--text-positive`
- Structural: `--card-bg`, `--home-card-bg`, `--border`, `--border-strong`
- Interactive: `--track-*`, `--bar-*`, `--tab-*`, `--toggle-*`

### Canvas tokens

```js
dark:  ringRGB [232,228,222], warnRGB [255,180,160], particleRGB [232,228,222]
light: ringRGB [80,68,52],    warnRGB [168,72,40],   particleRGB [120,100,80]
```

## Motion Contract

- Primary easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Keyframes in use: `homeIn`, `legalIn`, `navIn`, `rip`, `hintFade`
- Theme transitions: around 700ms for color/background/border/shadow
- Press feedback: scale to around `0.97`
- Numeric smoothing: rAF interpolation with adaptive catch-up; avoid decorative scale pulses on live amounts

## Interaction Contracts

### ScrubValue

- Enter scrub at movement >5px
- Vertical scroll wins until horizontal intent is clear; use `touch-action: pan-y`
- Delta formula should be step-aware, not dominated by full control range
- Small drags favor precision; larger swipes earn acceleration gradually instead of staying fully linear
- Visible control value should glide toward the target with rAF smoothing, while derived outputs keep up with committed ticks
- Money controls stay compact at rest and reveal full INR precision while actively scrubbing
- Ease movement near min/max bounds; avoid hard-stop feel during drag
- Tick crossing: pulse + light haptic + optional tick callback
- Momentum is subtle, time-based, and suppressed at bounds / short ranges
- Tap behavior: switch to text input
- Amount input supports commas + `L`/`Cr` parsing

### Loans ring

- Canvas ring is live at 60fps with layered glow/ghost/principal/interest rendering
- Ring states: solo size 260, compare size 140
- Solo center cycles 3 views: EMI/month, principal+interest breakdown, total payable
- Compare mode pins prior scenario and shows deltas

### Tax hero

- Tappable hero cycles 3 views: monthly take-home, new regime, old regime
- Two scrub controls: gross income, deductions
- Includes proportional new-vs-old comparison bar

### Haptics

- Implementation: `navigator.vibrate` + iOS checkbox fallback + 40ms throttle
- Current app wiring: light and medium used widely; heavy currently unused in modules

## Screen Contracts

- Welcome overlay is gated via localStorage key `claros_welcomed`
- Home has two cards (Loans, Income Tax) and About & Legal link
- Loans includes tabs, ring, pin/share actions, 3 controls, amortization collapse, disclaimer
- Tax includes FY badge, hero cycle, comparison bar, 2 controls, slab collapse, disclaimer
- Legal includes sections: About, Privacy, Disclaimer, Accuracy, Terms, Contact

## Data/Privacy Reality

- Theme persisted via `localStorage` key `claros_theme`
- Welcome acceptance persisted via `localStorage` key `claros_welcomed`
- Loan share links include only `a`, `r`, `t` parameters
- Vercel Analytics is currently enabled in app layout

Any legal/privacy copy must stay aligned with this reality.

## Performance Guardrails

1. No DOM style reads in canvas loops.
2. Always clean up `requestAnimationFrame` and event listeners.
3. Ring canvas should re-init on explicit `size` changes.
4. Avoid broad transitions that animate entire subtrees.
5. Keep per-frame work lightweight (particles and embers capped).
