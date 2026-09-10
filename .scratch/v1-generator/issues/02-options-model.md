# 02: Options model module

**What to build:** a dedicated module that is the single source of truth for the app, kept separate from any layout (US 29). It holds complete defaults for every in-scope Option, field metadata (group, label, hint, control kind, numeric range), the curated Presets, the bundled Sources, and the group ordering. It exposes pure functions that the form, Preview, and artifact all consume: applying a Preset (merge its overrides over the full defaults so the form is always whole), detecting the active Preset (exact match that breaks on any manual tweak), deriving bar-mode (omit the bar-related Options while `barWidth` is 0, feeding both Preview and artifact), and emitting the always-complete Options object (`container: '#waveform'` placeholder, every in-scope core Option at its current value including defaults, bar-related keys omitted while bars are off, and the plugin `import` lines prepended exactly when at least one plugin is enabled).

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] Defaults are complete for every Option field rendered by the form
- [ ] Applying a Preset produces a whole Options record (defaults plus its overrides)
- [ ] Active-Preset detection matches exactly and clears when any Option is tweaked
- [ ] The emitted artifact is always-complete, carries the container placeholder, omits bar-related keys while bars are off, and prepends plugin imports exactly when plugins are enabled
