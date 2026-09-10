# wavesurfer.js v7 — research for the config playground/generator app

Research date: 2026-09-09. All facts verified against primary sources: the **published npm packages** (tarballs of `wavesurfer.js@7.12.11` and `@wavesurfer/react@1.0.12`, including their `.d.ts` type declarations and `package.json` exports maps), the GitHub repo `katspaugh/wavesurfer.js` (main branch), and the official docs/examples site. Anything not verified is explicitly flagged.

> **Domain note:** `wavesurfer-js.org` and `wavesurfer.xyz` serve byte-identical docs and examples pages (verified by fetching both). The GitHub README links **wavesurfer.xyz** as the official site. Content on both is treated as official below; could not verify who operates the `wavesurfer-js.org` domain itself (no whois/DNS proof) — flagged.

> **Branch note:** the GitHub `main` branch is **v8 development** (root contains `V8_REFACTORING_SPEC.md`; source comments reference v8 breaking changes). Everything version-specific below is pinned to the **published npm release 7.12.11**, whose types were extracted from the actual tarball.

---

## 1. Latest version & npm packages

| Package                 | Version     | Status                                                  | Notes                                                                                                                                               |
| ----------------------- | ----------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wavesurfer.js`         | **7.12.11** | Latest on npm (published 2026-07-17 per npm search API) | BSD-3-Clause, author/maintainer katspaugh, 0 dependencies, TypeScript types included. Docs prose says "targeted here, v7.12.6" (docs lag slightly). |
| `@wavesurfer/react`     | **1.0.12**  | **Official React wrapper — verified**                   | Published 2025-12-04. Author/maintainer: katspaugh. Repo: https://github.com/katspaugh/wavesurfer-react. Peer deps: `react ^18.2.0                  |     | ^19.0.0`, `wavesurfer.js >=7.7.14`. BSD-3-Clause. |
| `wavesurfer-multitrack` | 0.4.12      | Official "super-plugin" by katspaugh                    | Separate npm package, used by the multitrack example. Not part of `wavesurfer.js` core.                                                             |

Sources: https://registry.npmjs.org/wavesurfer.js/latest · https://registry.npmjs.org/@wavesurfer/react/latest · npm search API (`text=wavesurfer playground`, `text=wavesurfer generator`).

### Package entry points (verified from published `package.json` exports map of 7.12.11)

- `wavesurfer.js` → `dist/wavesurfer.esm.js` (import) / `dist/wavesurfer.cjs` (require), types `dist/wavesurfer.d.ts`
- `wavesurfer.js/plugins/*` → `dist/plugins/*.esm.js` (import) / `*.cjs` (require), types `dist/plugins/*.d.ts` — so `import Regions from 'wavesurfer.js/plugins/regions'` **works** in 7.12.11
- `wavesurfer.js/dist/plugins/*.js` and `wavesurfer.js/dist/*` also map correctly
- The current README and docs recommend the explicit form: `import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'`
- UMD builds: `dist/wavesurfer.min.js` (global `WaveSurfer`) + `dist/plugins/<name>.min.js` (globals `WaveSurfer.Regions`, `WaveSurfer.Timeline`, `WaveSurfer.Spectrogram`, `WaveSurfer.Minimap`, `WaveSurfer.Hover`, `WaveSurfer.Zoom`, `WaveSurfer.Record`, `WaveSurfer.Envelope`)
- Ships in 7.12.11 `dist/plugins/`: envelope, hover, minimap, record, regions, spectrogram, spectrogram-windowed (deprecated shim), timeline, zoom

### `@wavesurfer/react` 1.0.12 API (verified from published `dist/index.d.ts` + `dist/index.js`)

**Default export — `WavesurferPlayer` component** (a `React.memo`-wrapped component):

```ts
type WavesurferProps = Omit<WaveSurferOptions, 'container'> & {
   [K in keyof WaveSurferEvents as `on${Capitalize<K>}`]?: (wavesurfer: WaveSurfer, ...eventArgs) => void
}
```

- Every core `WaveSurferOptions` member **except `container`** becomes a prop.
- Every wavesurfer event becomes a prop: `ready` → `onReady`, `play` → `onPlay`, etc. Each handler receives the **WaveSurfer instance as the first argument**, then the event payload.
- The `plugins` prop **must be memoized** (`useMemo` or defined outside the component) — wavesurfer mutates plugin instances during init; a new array each render causes errors (per published README).

**Named export — `useWavesurfer` hook:**

```ts
useWavesurfer({ container: RefObject<HTMLDivElement | null>, ...options: Omit<WaveSurferOptions, 'container'> })
```

Returns `{ wavesurfer, isReady, isPlaying, hasFinished, currentTime }` — per the runtime implementation (verified in `dist/index.js`; the `.d.ts` type for the inner state hook omits `hasFinished` even though its own JSDoc mentions it — a type-declaration gap in 1.0.12, **flagged**).

**Community (NOT official) React wrappers found on npm** — for awareness, not recommendation:

- `wavesurfer-react` 3.0.5 (ShiiRochi) — "react wrapper for wavesurfer.js"
- `@dschoon/react-waves` 4.0.3 (dschoon)
- `videojs-wavesurfer` 3.10.0 (video.js plugin, targets older wavesurfer)

---

## 2. `WaveSurfer.create()` core options — complete list (published 7.12.11 `dist/wavesurfer.d.ts`)

`container` is the only required option. 34 options total, exact names and TypeScript types:

| Option           | Type                                                                              | Default (from `defaultOptions` / JSDoc)       |
| ---------------- | --------------------------------------------------------------------------------- | --------------------------------------------- |
| `container`      | `HTMLElement \| string`                                                           | **required**                                  |
| `height`         | `number \| 'auto'`                                                                | — (auto = fill container height)              |
| `width`          | `number \| string`                                                                | `100%` (any CSS value)                        |
| `waveColor`      | `string \| string[] \| CanvasGradient`                                            | `'#999'`                                      |
| `progressColor`  | `string \| string[] \| CanvasGradient`                                            | `'#555'`                                      |
| `cursorColor`    | `string`                                                                          | — (renderer falls back to `progressColor`)    |
| `cursorWidth`    | `number`                                                                          | `1`                                           |
| `barWidth`       | `number`                                                                          | — (unset = line waveform)                     |
| `barGap`         | `number`                                                                          | —                                             |
| `barRadius`      | `number`                                                                          | —                                             |
| `barHeight`      | `number`                                                                          | — (vertical scaling factor)                   |
| `barAlign`       | `'top' \| 'bottom'`                                                               | —                                             |
| `barMinHeight`   | `number`                                                                          | —                                             |
| `minPxPerSec`    | `number`                                                                          | `0` (zoom level)                              |
| `fillParent`     | `boolean`                                                                         | `true`                                        |
| `url`            | `string`                                                                          | —                                             |
| `peaks`          | `Array<Float32Array \| number[]>`                                                 | —                                             |
| `duration`       | `number`                                                                          | — (required with `peaks` and no `url`)        |
| `media`          | `HTMLMediaElement`                                                                | —                                             |
| `mediaControls`  | `boolean`                                                                         | —                                             |
| `autoplay`       | `boolean`                                                                         | —                                             |
| `interact`       | `boolean`                                                                         | `true`                                        |
| `dragToSeek`     | `boolean \| { debounceTime: number }`                                             | `false` (`true` = 200ms debounce)             |
| `hideScrollbar`  | `boolean`                                                                         | —                                             |
| `audioRate`      | `number`                                                                          | — (playback speed)                            |
| `autoScroll`     | `boolean`                                                                         | `true`                                        |
| `autoCenter`     | `boolean`                                                                         | `true`                                        |
| `sampleRate`     | `number`                                                                          | `8000` (decode-only, doesn't affect playback) |
| `splitChannels`  | `Array<Partial<WaveSurferOptions> & { overlay?: boolean }>`                       | — (per-channel option overrides)              |
| `normalize`      | `boolean`                                                                         | —                                             |
| `maxPeak`        | `number`                                                                          | — (fixed normalization peak)                  |
| `plugins`        | `GenericPlugin[]`                                                                 | —                                             |
| `renderFunction` | `(peaks: Array<Float32Array \| number[]>, ctx: CanvasRenderingContext2D) => void` | —                                             |
| `fetchParams`    | `RequestInit`                                                                     | —                                             |
| `backend`        | `'WebAudio' \| 'MediaElement'`                                                    | `'MediaElement'`                              |
| `cspNonce`       | `string`                                                                          | — (nonce for Shadow DOM `<style>`)            |
| `blobMimeType`   | `string`                                                                          | — (override fetched Blob MIME)                |

**Corrections to option names from the task brief:** there is **no `peaking`** option (it's `peaks` + `maxPeak`), and **no `channel`/`channels`** option. v7's `splitChannels` is an **array of per-channel option overrides**, not the v6 boolean. (v6→v7 migration doc: https://wavesurfer-js.org/docs/migrating-v6-v7/)

### Static vs dynamically settable (verified from published 7.12.11 `dist/wavesurfer.js` + `dist/renderer.js`)

`ws.setOptions(partial)` merges options and:

1. Rebuilds the decoded buffer if `duration` (alone or with `peaks`) is passed — no network fetch.
2. Calls `renderer.setOptions()` → **re-renders**, and **moves the DOM container if `container` changed**, re-inits drag listeners when `dragToSeek` changes.
3. Applies `audioRate` via `setPlaybackRate()`.
4. Applies `mediaControls` to the media element.

- **Dynamic via `setOptions`** (live re-render): `container`, `height`, `width`, `waveColor`, `progressColor`, `cursorColor`, `cursorWidth`, `barWidth`, `barGap`, `barRadius`, `barHeight`, `barAlign`, `barMinHeight`, `minPxPerSec`, `fillParent`, `normalize`, `maxPeak`, `splitChannels`, `hideScrollbar`, `autoScroll`, `autoCenter`, `dragToSeek`, `renderFunction`, `peaks`+`duration`, `audioRate`, `mediaControls`. Additionally `interact` is read live at event time (also has `ws.toggleInteraction(bool)`).
- **Not applied by `setOptions`** (constructor-time, or via dedicated APIs): `url` (use `ws.load(url)`), `media` (use `ws.setMediaElement(el)`), `backend`, `plugins` (use `ws.registerPlugin()` / `ws.unregisterPlugin()`), `autoplay`, `cspNonce`. `sampleRate`, `fetchParams`, `blobMimeType` are consumed at the **next `load()`**.

### Events (published `WaveSurferEvents`, useful for a generator's event-wiring UI)

`init`, `load [url]`, `loading [percent]`, `decode [duration]`, `ready [duration]`, `redraw`, `redrawcomplete`, `play`, `pause`, `finish`, `timeupdate [currentTime]`, `audioprocess [currentTime]`, `seeking [currentTime]`, `interaction [newTime]`, `click [relativeX, relativeY]`, `dblclick [relativeX, relativeY]`, `drag [relativeX]`, `dragstart [relativeX]`, `dragend [relativeX]`, `scroll [visibleStartTime, visibleEndTime, scrollLeft, scrollRight]`, `zoom [minPxPerSec]`, `destroy`, `error [Error]`, `resize`.

### Key methods (published d.ts)

`create`, `setOptions`, `load`, `loadBlob`, `play(start?, end?)`, `playPause`, `pause`, `stop`, `skip`, `setTime`, `seekTo`, `getCurrentTime`, `getDuration`, `isPlaying`, `isSeeking`, `zoom(minPxPerSec)`, `setVolume`/`getVolume`, `setMuted`/`getMuted`, `setPlaybackRate`/`getPlaybackRate`, `setSinkId`, `getMediaElement`, `setMediaElement`, `exportPeaks`, `getDecodedData`, `exportImage`, `empty`, `registerPlugin`, `unregisterPlugin`, `getActivePlugins`, `getScroll`/`setScroll`/`setScrollTime`, `toggleInteraction`, `destroy`. (7.12.11 already includes the reactive `getState()` and `getRenderer()` surface documented for v8 on main.)

---

## 3. Official plugins (8, all verified in published 7.12.11 tarball + docs)

Docs overview: https://wavesurfer-js.org/docs/plugins/ — "The eight official plugins are: Regions, Timeline, Spectrogram, Minimap, Hover, Zoom, Record, Envelope."

Registration: pass **instances** via `plugins: [RegionsPlugin.create()]` at `create()` time, or later via `ws.registerPlugin(plugin)` (returns the plugin; `ws.unregisterPlugin(plugin)` to remove; `ws.getActivePlugins()` to list).

### Regions — `regions`

- **Plugin options: none** (`RegionsPluginOptions = undefined`).
- Per-region params (`addRegion(options: RegionParams)`): `id?: string`, `start: number` (required, seconds), `end?: number`, `drag?: boolean`, `resize?: boolean`, `resizeStart?: boolean`, `resizeEnd?: boolean`, `color?: string`, `content?: string | HTMLElement`, `minLength?: number`, `maxLength?: number`, `channelIdx?: number`, `contentEditable?: boolean`.
- API: `addRegion`, `enableDragSelection(options, threshold?)` (returns disabler), `clearRegions`, `getRegions`; region objects have `play(stopAtEnd?)`, `setOptions(...)`, `setContent`, `remove`.
- Events: `region-initialized`, `region-created`, `region-update`, `region-updated`, `region-removed`, `region-clicked`, `region-double-clicked`, `region-in`, `region-out`, `region-content-changed`.

### Timeline — `timeline`

`height?: number` (default **20**), `container?: HTMLElement | string` (defaults to wavesurfer's container), `insertPosition?: InsertPosition` (`'beforebegin'` = on top), `duration?: number`, `timeInterval?: number` (seconds between ticks), `primaryLabelInterval?: number`, `secondaryLabelInterval?: number` (seconds), `primaryLabelSpacing?: number`, `secondaryLabelSpacing?: number` (in tick counts), `timeOffset?: number` (default **0**), `style?: Partial<CSSStyleDeclaration> | string`, `formatTimeCallback?: (seconds) => string`, `secondaryLabelOpacity?: number` (default **0.25**). Event: `ready`.

### Spectrogram — `spectrogram` (author @akreal)

`container?: string | HTMLElement`, `fftSamples?: number` (power of 2), `fftSize?: number` (zero-padded FFT length), `height?: number` (CSS px), `labels?: boolean`, `labelsBackground?: string`, `labelsColor?: string`, `labelsHzColor?: string`, `noverlap?: number`, `windowFunc?: 'bartlett' | 'bartlettHann' | 'blackman' | 'cosine' | 'gauss' | 'hamming' | 'hann' | 'lanczoz' | 'rectangular' | 'triangular'`, `alpha?: number`, `frequencyMin?: number`, `frequencyMax?: number`, `sampleRate?: number` (for pre-computed data), `scale?: 'linear' | 'logarithmic' | 'mel' | 'bark' | 'erb'`, `gainDB?: number`, `rangeDB?: number`, `preEmphasis?: number` (dB/oct), `autoGain?: boolean`, `colorMap?: number[][] | 'gray' | 'igray' | 'roseus'`, `splitChannels?: boolean`, `frequenciesDataUrl?: string`, `maxCanvasWidth?: number` (default 30000), `useWebWorker?: boolean` (default false), `workerTimeout?: number` (default 30000), `fallbackToMainThread?: boolean` (default true). Events: `ready`, `click [relativeX]`, `error`.

- **7.12.11 note:** the windowed renderer is a **separate plugin** `spectrogram-windowed.esm.js` in the published package. The merged `rendering: 'windowed'` option (deprecating the separate plugin) is documented in the **main-branch README (v8 dev)** — not present in the 7.12.11 `.d.ts`. **Flagged** as a v8-vs-7.12.11 difference.

### Minimap — `minimap`

`MinimapPluginOptions = { overlayColor?: string; insertPosition?: InsertPosition } & Partial<WaveSurferOptions>` — i.e. it accepts (nearly) **all core WaveSurferOptions** as well (e.g. its own `height`, `waveColor`, `barWidth`…). Published defaults: `height: 50`, `overlayColor: 'rgba(100, 100, 100, 0.1)'`, `insertPosition: 'afterend'`. Events mirror core (init, ready, timeupdate, click, drag…, see d.ts).

### Hover — `hover`

`lineColor?: string` (falls back to cursorColor/progressColor), `lineWidth?: string | number` (default **1**), `labelColor?: string`, `labelSize?: string | number` (default **11**), `labelBackground?: string`, `labelPreferLeft?: boolean` (default **false**), `formatTimeCallback?: (seconds) => string` (default m:ss). Event: `hover [relX]`.

### Zoom — `zoom` (scroll-wheel/pinch zoom)

`scale?: number` (default **0.5** — zoom per wheel step), `maxZoom?: number`, `deltaThreshold?: number` (default **5**), `exponentialZooming?: boolean` (default **false**), `iterations?: number` (default **20** — steps from initial zoom to maxZoom). No extra events.

### Record — `record`

`mimeType?: MediaRecorderOptions['mimeType']`, `audioBitsPerSecond?: number` (default **128000**), `renderRecordedAudio?: boolean` (default **true**), `scrollingWaveform?: boolean` (default **false**), `scrollingWaveformWindow?: number` (default **5** s), `continuousWaveform?: boolean` (default **false**), `continuousWaveformDuration?: number`, `mediaRecorderTimeslice?: number`. API: `startMic(options?)`, `stopMic()`, `startRecording(options?)`, `stopRecording()`, `pauseRecording()`, `resumeRecording()`, `isRecording()`, `isPaused()`, `isActive()`, `getDuration()`, static `getAvailableAudioDevices()`. Events: `record-start`, `record-pause [Blob]`, `record-resume`, `record-end [Blob]`, `record-progress [duration]`, `record-data-available [Blob]`.

### Envelope — `envelope`

`points?: EnvelopePoint[]` (`{ id?: string; time: number; volume: number }`, default `[]`), `volume?: number`, `lineWidth?: string` (default **4**), `lineColor?: string` (default **'rgba(0, 0, 255, 0.5)'**), `dragLine?: boolean`, `dragPointSize?: number` (default **10**), `dragPointFill?: string` (default **'rgba(255, 255, 255, 0.8)'**), `dragPointStroke?: string` (default **'rgba(255, 255, 255, 0.8)'**). API: `addPoint`, `removePoint`, `getPoints`, `setPoints`, `setVolume(0..1+)`, `getCurrentVolume`. Events: `points-change [points]`, `volume-change [volume]`.

---

## 4. The official examples page — mechanics and existing playground

URLs: https://wavesurfer-js.org/examples and https://wavesurfer.xyz/examples (identical). Built from the repo: root `index.html` + `examples/_preview.js` + `examples/*.js` + `examples/audio/*`.

**How it works (verified from `index.html` + `_preview.js` in the repo):**

- Sidebar of example links; selecting one (site uses `?file.js` query param; repo version uses `#file.js` hash) fetches `/examples/<file>.js` and shows its **source in an editable `<textarea>`**.
- The example runs in a **sandboxed iframe** (`sandbox="allow-scripts allow-same-origin"`) via `iframe.srcdoc`. `'wavesurfer.js'` imports are rewritten to `../dist/wavesurfer.esm.js`; if the source references `@babel` it's run as `text/babel` (this is how the React example works, with an importmap to esm.sh for react/react-dom).
- **The textarea is a live editor**: on `input`, after a **500ms debounce**, the preview re-runs (`loadPreview(e.target.value)`).

**Does it already have an options playground? YES — partially.** The **"Options" example** (`/examples?all-options.js`, source `examples/all-options.js`) is an interactive options playground:

- It defines an `options` object and **auto-generates a form input for every option**: `type="color"` for any key containing "Color", `type="range"` sliders (with a `schema` of min/max/step per option: height 10–512, width 10–2000, cursorWidth 0–10, minPxPerSec 1–1000, barWidth 1–30, barHeight 0.1–4, barGap 1–30, barRadius 1–30, audioRate 0.1–4, sampleRate 8000–48000 step 1000) for numbers, checkboxes for booleans, text/JSON inputs otherwise.
- On every input change it calls **`wavesurfer.setOptions(options)`** and updates a **read-only JSON `<textarea>`** with the current options — i.e. live JSON config output.
- Limitations (relevant to the generator app): core options only (no plugin options, no plugin enable/disable), no code/export beyond the JSON dump, no presets, no shareable URLs.

**Full example list (live site sidebar):**

- Basics: Basic (`basic.js`), **Options (`all-options.js`)**, Events (`events.js`), Zoom (`zoom.js`), Bars (`bars.js`), Web Audio (`webaudio.js`), React (`react.js`), Pre-decoded (`predecoded.js`), Video (`video.js`), Speed (`speed.js`)
- Plugins: Regions, Timeline, Timeline2 (`timeline-custom.js`), Minimap, Envelope, Spectrogram, Record, Zoom (`zoom-plugin.js`), Hover
- Customization: Custom CSS (`styling.js`), Gradients (`gradient.js`), Custom render (`custom-render.js`), Soundcloud (`soundcloud.js`)
- Experiments: Silence (`silence.js`), Pitch contour (`pitch.js`), Multi-track (`multitrack.js`), Vowels (`vowels.js`), FM synth (`fm-synth.js`)
- Extra example files in the repo not all shown in the sidebar: `spectrogram-windowed.js`, `split-channels.js`, `webaudio-shim.js`, `react-global-player.js`, `record-sync.js`, `pitch-worker.js`, `phase-vocoder/` (dir). Example audio files referenced: `/examples/audio/audio.wav`, `stereo.mp3`, `mono.mp3`, `librivox.mp3`.

---

## 5. Third-party config generators / playgrounds

**None found.** Searches performed: web ("wavesurfer.js config generator playground options editor", ""wavesurfer" playground interactive options demo app") and the npm registry search API (`text=wavesurfer playground`, `text=wavesurfer generator`). No standalone wavesurfer config-generator/playground app surfaced on npm or the searchable web. _(Absence of evidence — flagged; I can only report that searches found none, not that none exists.)_

Closest things found:

1. **Official "Options" example** (see §4) — an interactive core-options form + live JSON, embedded in the official examples page. The most direct "competitor"/reference for a generator app.
2. `captivus/wavesurf` (GitHub/PyPI) — a **Python wrapper** for wavesurfer.js with immutable builder methods (`.with_options(**kwargs)`, `.with_theme(...)`, `.with_plugins(...)`), snake_case kwargs for all 31 options, and HTML display helpers. Adjacent tool, not a web playground.
3. Community React wrappers (see §1) and `videojs-wavesurfer` — wrappers, not generators.
4. A v6-era options reference page at `uikit.webclown.net/wavesurfer/v6.6.4/docs/options.html` — a static v6 docs mirror, not v7, not interactive.

---

## 6. React usage — documented patterns

Official docs: https://wavesurfer-js.org/docs/frameworks/ ("Framework integration" — React / Angular / Vue / Next.js SSR).

**Option A — `@wavesurfer/react`** (official docs defer API details to the package README; verified from published README + d.ts):

```jsx
import WavesurferPlayer from '@wavesurfer/react'

;<WavesurferPlayer
   height={100}
   waveColor="violet"
   url="/my-server/audio.wav"
   onReady={(ws) => setWavesurfer(ws)}
   onPlay={() => setIsPlaying(true)}
   onPause={() => setIsPlaying(false)}
/>
```

```jsx
import { useRef } from 'react'
import { useWavesurfer } from '@wavesurfer/react'

const containerRef = useRef(null)
const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
   container: containerRef,
   url: '/my-server/audio.ogg',
   waveColor: 'purple',
   height: 100
})
```

Plugins via the `plugins` prop, **always memoized** (`useMemo` or module scope).

**Option B — manual `useRef` + `useEffect`** (documented on the frameworks page):

```jsx
const options = useMemo(() => ({ waveColor, height }), [waveColor, height])
useEffect(() => {
   if (!containerRef.current) return
   const ws = WaveSurfer.create({ container: containerRef.current, url, ...options })
   ws.on('ready', (duration) => {
      /* ... */
   })
   return () => ws.destroy() // required: React 18 StrictMode double-mounts
}, [url, options])
```

Documented pitfalls (frameworks page): always return `() => ws.destroy()`; **never** construct `plugins`/`peaks` arrays inline in `useEffect`/JSX (new references each render → infinite re-init or double plugin registration) — memoize; with `peaks`+`duration` (no `url`), `ready` fires in a microtask, so attach listeners synchronously; Next.js/SSR: wavesurfer is browser-only — use `dynamic(..., { ssr: false })` or a `typeof window` guard.

**Official React example** (`examples/react.js`, verified source): uses `useWavesurfer` with a memoized `Timeline.create()` plugin, cycles between 4 audio URLs, play/pause button, live `currentTime` display; rendered via Babel-standalone + esm.sh importmap. A second `examples/react-global-player.js` exists in the repo.

---

## Source index

- npm registry (latest manifests): https://registry.npmjs.org/wavesurfer.js/latest · https://registry.npmjs.org/@wavesurfer/react/latest
- Published tarballs (types, defaults, exports maps, README) — `wavesurfer.js@7.12.11` and `@wavesurfer/react@1.0.12`, extracted and read directly
- GitHub repo: https://github.com/katspaugh/wavesurfer.js (README, `src/wavesurfer.ts`, `src/renderer.ts`, `examples/` listing, root `index.html`, `examples/_preview.js`, `examples/all-options.js`, `examples/react.js` — main branch via raw/jsdelivr/GitHub API)
- Docs site (identical on both domains): https://wavesurfer-js.org/docs · /docs/core-concepts/ · /docs/plugins/ · /docs/frameworks/ · https://wavesurfer.xyz/docs
- Examples site: https://wavesurfer-js.org/examples · https://wavesurfer.xyz/examples
- React wrapper repo/README: https://github.com/katspaugh/wavesurfer-react · https://www.npmjs.com/package/@wavesurfer/react
- npm search API: `https://registry.npmjs.org/-/v1/search?text=wavesurfer%20playground` and `...wavesurfer%20generator`

## Flagged / could not verify

1. **Ownership of the `wavesurfer-js.org` domain** — its content is byte-identical to wavesurfer.xyz (docs + examples fetched and compared), and the GitHub README canonicalizes wavesurfer.xyz. I could not verify domain registration/whois.
2. **`@wavesurfer/react` `useWavesurfer` return type** — runtime returns `hasFinished` (verified in `dist/index.js` and mentioned in the d.ts JSDoc), but the exported TS type omits it (d.ts gap in 1.0.12).
3. **Spectrogram `rendering: 'windowed'`** — documented in the main-branch README (v8 dev); **not** in the published 7.12.11 types, which instead ship the separate `spectrogram-windowed` plugin. Depends which version the generator targets.
4. **Nonexistence of third-party playgrounds** — based on web + npm search only; cannot prove absence.
5. Docs site prose says it targets **v7.12.6** while npm latest is **7.12.11** — the options list was verified identical between main-branch source and the published 7.12.11 `wavesurfer.d.ts`, so this lag does not affect the option tables above.
