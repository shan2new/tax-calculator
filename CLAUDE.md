# Claros Engineering Contract (LLM Optimized)

## Purpose

Execution contract for coding agents working on this repo. Keep this concise, implementation-accurate, and aligned with `DESIGN.md`.

## Source of Truth

- Visual/interaction behavior: `DESIGN.md`
- Cursor enforcement: `.cursor/rules/design-guidance.mdc`
- If implementation diverges from docs, update both `CLAUDE.md` and `DESIGN.md` in the same change.

## Agent Execution Mode

### MUST

- Ruthlessly simplify and update stale docs/code guidance when touching related areas.
- Optimize for token efficiency in all agent outputs and doc updates.
- Prefer compact lists/tables/contracts over long prose.
- Remove redundant, repeated, or aspirational text that is not implemented.
- Keep guidance implementation-first and directly actionable.

### SHOULD

- Collapse repeated rules into single canonical bullets.
- Replace paragraph explanations with short constraint statements.
- Keep "why" to one line unless behavior is non-obvious.

### AVOID

- Verbose restatements of the same rule.
- Long narrative sections with low execution value.
- Keeping outdated notes "for history" inside active instruction files.

## Stack Reality

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind 4 installed, but UI is mostly inline style objects + CSS variables
- Canvas 2D powers visual components (`Ring`, `Particles`, `BrandMark`, `Mini*`)
- Motion is custom (`requestAnimationFrame`, CSS transitions/keyframes)
- `@vercel/analytics` currently enabled in `src/app/layout.tsx`

## Architecture Map

```txt
src/app/              routes + shell wiring
src/components/       shared UI + canvas primitives
src/modules/          loans and tax feature modules
src/screens/          home, legal, welcome surfaces
src/hooks/            haptics + ripples
src/lib/              pure calc/format/theme logic
src/styles/           tokens + keyframes
```

## Behavior Reality

- Theme persistence: `localStorage` key `claros_theme`
- Welcome gating: `localStorage` key `claros_welcomed`
- Share deeplink params: `a`, `r`, `t`
- Analytics is present; legal/privacy text must not claim zero analytics unless removed

## Coding Rules

### MUST

- Use functional components + hooks.
- Keep calculations in client-side pure utilities where possible.
- Keep India-first formatting/parsing (`toLocaleString("en-IN")`, `L`/`Cr` input support).
- Keep touch targets >=44px for interactive controls.
- Keep canvas colors from JS theme objects (`THEMES_CANVAS`).
- Clean up every animation loop/event listener.

### SHOULD

- Keep module logic in `src/modules/*` and utility math in `src/lib/*`.
- Reuse interaction vocabulary already in app (scrub, tap-to-cycle, collapsible detail).
- Keep transitions property-specific and subtle.

### AVOID

- DOM style reads inside render loops (`getComputedStyle` in rAF loops).
- Blanket CSS transitions across broad selectors.
- New UI libraries, animation libraries, or global state libraries unless explicitly requested.
- Replacing scrub controls with sliders.

## Route Entrance Motion (Current)

- `AppShell` container: `0.4s` for Home, `0.25s` for all sub-pages
- `NavHeader`: `navIn 0.55s 50ms both` on every sub-page
- Modules: 3-stage `navIn` stagger — hero viz `150ms`, controls `280ms`, secondary `420ms`
- SEO zones: `navIn 0.5s 560ms both`
- Detail pages: insert insights `120ms` + label `260ms` before the module stages
- `Home` and `Legal` keep their bespoke `homeIn`/`legalIn` stagger — do not replace
- All section animations use `animation-fill-mode: both` (element starts invisible before delay; no flash on SSR)

## Interaction Constants (Current)

- Loan amount: sensitivity `1.8`, tick by loan-type `tickStep`
- Interest rate: sensitivity `0.35`, tick `1`
- Tenure: sensitivity `0.25`, tick `1`
- Gross income: sensitivity `2`, tick `500000`
- Deductions: sensitivity `1`, tick `50000`
- Scrub gestures: horizontal intent only; keep vertical page scroll intact until scrub is committed
- Scrub bounds: ease near edges; momentum stays subtle and should not fire at limits or tiny ranges
- Scrub response: use a step-aware baseline; accelerate only after deliberate horizontal travel
- Scrub display: animate visible value toward target, but keep derived outputs in step with committed ticks
- Money scrubs: compact at rest, full INR precision while dragging

## Haptics (Current Wiring)

- `light`: first drag, scrub ticks, momentum release, expand/collapse, nav taps
- `medium`: theme toggle, card open, loan type switch, tap-to-type, pin/share, welcome accept
- `heavy`: available but currently not used in modules

## Performance Guardrails

1. Never read computed styles inside canvas animation loops.
2. Always cancel `requestAnimationFrame` on cleanup.
3. `Ring` must re-init on `size` changes.
4. `SmoothNumber` remains rAF-based with adaptive catch-up; no scale pulse, not CSS digit-roll.
5. Keep per-frame work lightweight (particle/ember count discipline).

## New Module Checklist

1. Add pure logic in `src/lib/`.
2. Build module UI in `src/modules/`.
3. Add route at `src/app/<module>/page.tsx` with `NavHeader`.
4. Add card entry on `src/screens/Home.tsx` (prefer mini viz).
5. Add disclaimer copy for module outputs.
6. Reconcile docs after implementation (`CLAUDE.md` + `DESIGN.md`).
