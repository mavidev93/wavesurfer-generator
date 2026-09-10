# V1 generator app: promote prototype Variant A ("Split studio") into the real app

**Status:** ready-for-agent

## Problem Statement

A developer who wants a custom-styled wavesurfer.js player in their project has no interactive way to discover and tune the Options. They read the options docs, hand-write a config, reload their app, and repeat — slow and error-prone. The official examples page does include a core-options playground, but it exposes no plugin Options, no plugin enable/disable, no Presets, and its output is a read-only JSON dump that isn't paste-runnable. No third-party wavesurfer config generator exists (research, 2026-09-09). So the user tunes wavesurfer blind, and the resulting config is easy to get wrong.

## Solution

An interactive playground — the app itself — on the prototype's validated Variant A "Split studio" layout: three always-visible panes you scan at once, IDE style. A grouped options form rail on the left, a live Preview in the middle that redraws on every change, and the always-complete, copy-ready Options object on the right. Preset chips in the header give curated starting points; the Source can be switched between audio samples. When the look is right, the user copies the Options object into their own project.

## User Stories

1. As a developer integrating wavesurfer.js, I want the options form, the live Preview, and the Options object visible side by side at all times, so that I can see the effect of every tweak without switching views.
2. As a developer, I want Preset chips in the header, so that I can start from a curated look in one click.
3. As a developer, I want each Option rendered as the appropriate control — color picker for colors, slider for numbers, checkbox for booleans — so that I never have to remember types or type raw values.
4. As a developer, I want each numeric Option constrained to a sensible range, so that I can't drag an Option into a broken value.
5. As a developer, I want every Option's current value displayed beside its control, so that I can read exact values (hex codes, numbers) without consulting the output pane.
6. As a developer, I want a one-line hint per Option, so that I learn what each Option does as I tweak.
7. As a developer, I want Options grouped into sections (Appearance, Waveform, Timeline, Minimap, Hover), so that related Options sit together.
8. As a developer, I want each plugin's section headed by its enable toggle, so that switching a plugin on or off is itself an Option I can flip.
9. As a developer, I want a disabled plugin's sub-Options hidden, so that the form only shows inputs that currently matter.
10.   As a developer, I want groups to be collapsible, so that sections I'm not adjusting don't crowd the rail.
11.   As a developer, I want the Preview to redraw instantly when any Option changes, so that feedback is immediate.
12.   As a developer, I want the Preview to correctly apply or tear down plugins when I toggle them, so that enable/disable states preview faithfully.
13.   As a developer, I want to play and pause the Preview and seek by clicking the waveform, so that I can judge progress, cursor, and hover behavior during real playback.
14.   As a developer, I want the Options object to contain every in-scope Option's current value, defaults included, so that it doubles as reference material and I discover Options I didn't know about (ADR 0002).
15.   As a developer, I want `container: '#waveform'` as the placeholder for the target element, so that the artifact tells me exactly what to substitute in my project.
16.   As a developer, I want the required import lines prepended when plugins are enabled, so that the copied artifact is runnable as-is (ADR 0002).
17.   As a developer, I want bar-related Options omitted from the Options object while bars are off, so that the artifact never carries keys that would render differently from the Preview.
18.   As a developer, I want a Copy button with clear "Copied" feedback, so that moving the config into my project is a single action.
19.   As a developer, I want picking a Preset to overwrite the entire form with its values, so that Presets are true starting points rather than partial merges.
20.   As a developer, I want the active Preset highlighted while my Options exactly match it, so that I always know which Preset I'm looking at.
21.   As a developer, I want the Preset highlight to clear the moment I tweak any Option, so that the highlight never misrepresents a modified state.
22.   As a developer, I want to switch the Source between bundled audio samples, so that I can check how my Options look on different audio material.
23.   As a developer, I want switching the Source to preserve my Options, so that changing what I listen to never loses what I configured.
24.   As a developer, I want to point the app at my own audio via a pasted URL, so that I can tune Options against the audio I actually ship.
25.   As a developer, I want to load a local audio file as the Source, so that I can tune against audio I can't host publicly.
26.   As a developer, I want only the curated, form-friendly Options in scope (core set + Timeline/Minimap/Hover), so that the form never offers inputs that produce confusing or broken configs (ADR 0003).
27.   As a developer, I want the app to track wavesurfer.js v7 stable, so that the emitted artifact matches the version I install (ADR 0001).
28.   As a maintainer, I want the variant switcher and prototype layouts B–E removed, so that the shipped app is a single coherent UI.
29.   As a maintainer, I want the options model (defaults, field metadata, Presets, artifact emission) kept separate from the layout, so that a future plugin (Spectrogram in v2) extends the app without touching UI code.

## Implementation Decisions

- **Layout**: promote prototype Variant A "Split studio" — a header (title, tagline, Preset chips), a left rail (Source switcher + collapsible grouped form), a center Preview stage, and a right pane holding the live Options object. Delete the variant switcher, the `?variant=` param routing, and variant layouts B–E.
- **Options model**: promote the prototype's shared state layer into a dedicated module as the single source of truth — defaults for all in-scope Options, field metadata (label, group, hint, control kind, numeric range), Preset definitions, and Source definitions. The flat Options record keyed by Option name is retained.
- **Options object emission** (ADR 0002): the artifact is an always-complete object literal — the `container: '#waveform'` placeholder, every in-scope core Option at its current value (defaults included), bar-related keys omitted while `barWidth` is 0, and the plugin import lines prepended only when at least one plugin is enabled.
- **Presets**: applying a Preset merges its overrides over the full defaults, so the form is always whole. Active-Preset detection compares every Option against defaults-plus-overrides and clears on any manual tweak.
- **Preview**: the official React wrapper renders the live instance; plugin instances are memoized on their enabling Options (a wavesurfer constraint verified in research), and enabled plugins are constructed from their current Option values.
- **Bar-mode derivation**: while `barWidth` is 0, the bar-related Options are excluded from what both the Preview and the artifact receive.
- **Sources**: bundled samples ship first; pasted-URL and local-file Sources are later slices (a local file becomes an object URL). None of these affect the options model.
- **Playback**: minimal controls — the interactive waveform (click/drag to seek) plus a simple play/pause control near the Preview.
- **Option scope** (ADR 0003): the 11 core form-friendly Options (waveColor, progressColor, cursorColor, height, fillParent, minPxPerSec, barWidth, barGap, barRadius, barHeight, barMinHeight) plus Timeline (enable, height), Minimap (enable, height, overlayColor), and Hover (enable, lineColor).
- **Stack**: the existing Vite + React + TypeScript app; no new runtime dependencies. wavesurfer.js 7.12.x and the official React wrapper stay pinned (ADR 0001).

## Testing Decisions

- **What makes a good test**: assert external behavior only — what a user can observe (the rendered artifact, the props handed to the player) — never how state is wired internally.
- **Prior art**: none — the repo has no tests or test framework. Introduce Vitest with jsdom and React Testing Library (matching the Vite/React stack) alongside this work.
- **Seam 1 — the options-model module** (pure functions, user-confirmed): defaults are complete for every field in the form; Preset application produces a whole Options record; the emitted artifact is always-complete, carries the container placeholder, omits bar-related keys while bars are off, and prepends plugin imports exactly when plugins are enabled; active-Preset detection matches exactly and breaks on any tweak.
- **Seam 2 — the app screen** (the highest seam, user-confirmed): rendered in jsdom with the third-party wavesurfer player mocked at its module boundary. Form interactions update the artifact pane; picking a Preset overwrites the form and is reflected in the controls; the active Preset highlight clears on tweak; switching Source passes the right URL to the player mock; toggling plugins changes the plugin instances the player mock receives; Copy writes the artifact to the clipboard.
- The real Preview rendering (canvas/WebAudio) is deliberately not automated — it is the third-party boundary, verified by eye in dev.

## Out of Scope

- Variants B–E and the variant switcher (removed, not kept as a preference).
- The Spectrogram plugin (the intended first v2 addition) and all other plugins — Regions, Record, Envelope, Zoom (ADR 0003).
- Form-hostile core Options: renderFunction, peaks, duration, media, splitChannels, fetchParams, cspNonce, blobMimeType (ADR 0003).
- Shareable URLs, persisted Options state (localStorage), undo/history.
- wavesurfer v8 migration (ADR 0001 revisit trigger).
- Responsive/narrow-viewport redesign beyond what the promoted styles give for free.

## Further Notes

- Primary sources: `docs/research-wavesurfer-v7.md` (verified v7 facts) and ADRs 0001–0003 bind all decisions above.
- The prototype under `src/prototype` is throwaway; promote its validated decisions and structure, not necessarily its files verbatim.
- The prototype validated the layout question only — Variant A "Split studio" was chosen over four alternatives (Stage, Guide, Spec sheet, Code-first).
- Vocabulary follows `CONTEXT.md`: Option, Options object, Preset, Preview, Source.
