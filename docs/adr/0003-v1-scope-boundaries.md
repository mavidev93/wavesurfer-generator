# V1 scope: form-friendly core options + Timeline/Minimap/Hover plugins, everything else out

These are deliberate no-s — future readers should not "fix" them without a new decision:

- **Form-hostile core options are omitted entirely** (not in the form, not in the copied object): `renderFunction`, `peaks`, `duration`, `media`, `splitChannels`, `fetchParams`, `cspNonce`, `blobMimeType`. They take functions, DOM elements, or nested data that has no reasonable form input; exposing them as raw JSON textareas was considered and rejected for v1.
- **Plugins in v1 are Timeline, Minimap, and Hover only.** Regions was dropped entirely (it has no plugin options — its value is runtime region-drawing, which doesn't fit the options-object artifact). Spectrogram is deferred to v2 (25+ options, heaviest to wire). Record, Envelope, and Zoom are out of scope.

## Status

accepted

## Consequences

- The promise "all options can be seen" means _all form-friendly options_, not all 34 core options.
- Spectrogram is the intended next plugin when v2 happens; the option-curation pattern should make adding it straightforward.
