# Target wavesurfer.js v7.12.x stable, not the v8 dev branch

The options form schema (names, types, defaults, static-vs-dynamic split) is version-locked to wavesurfer.js, and GitHub `main` is unreleased v8 development with breaking option changes. We target the latest published stable — `wavesurfer.js@7.12.11` with the official React wrapper `@wavesurfer/react@1.0.12` (peer dep `wavesurfer.js >=7.7.14`) — which is also what the official docs site targets. Revisit when v8 ships.
