# Wavesurfer Generator

An interactive playground for wavesurfer.js: tweak options in a form, watch the waveform update live beside it, and copy the resulting configuration into your own project.

## Language

**Option**:
A single wavesurfer.js `create()` parameter (or setting of an enabled plugin) exposed as an input in the form.
_Avoid_: Setting, field, prop

**Options object**:
The copyable artifact: an always-complete object of every Option's current value, defaults included.
_Avoid_: Config, settings, JSON dump

**Preset**:
A named combination of Option values offered as a starting point; choosing one overwrites the form.
_Avoid_: Template, theme

**Preview**:
The live wavesurfer instance that renders the current Options beside the form.
_Avoid_: Demo, player (except where "player" refers to playback controls)

**Source**:
The audio the Preview plays: a bundled sample, a pasted URL, or an uploaded local file.
_Avoid_: Track, file
