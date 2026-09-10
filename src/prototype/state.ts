// PROTOTYPE state layer — shared across all five UI variants so each only
// changes *layout*, not data. Throwaway: see docs/research-wavesurfer-v7.md + ADR 0002.

export type OptVal = string | number | boolean

// Complete, always-emitted form surface (curated subset; ADR 0001/0003 scope).
export const DEFAULT_OPTS: Record<string, OptVal> = {
   waveColor: '#999',
   progressColor: '#555',
   cursorColor: '#555',
   height: 120,
   barWidth: 0, // 0 = line waveform (bar* group omitted from output)
   barGap: 0,
   barRadius: 0,
   barHeight: 1,
   barMinHeight: 0,
   fillParent: true,
   minPxPerSec: 0,
   timelineEnabled: false,
   timelineHeight: 20,
   minimapEnabled: false,
   minimapHeight: 50,
   minimapOverlay: 'rgba(100,100,100,0.1)',
   hoverEnabled: false,
   hoverLineColor: '#555'
}

// Merge a partial preset over the full defaults -> the form is always whole.
export function preset(partial: Partial<Record<string, OptVal>>) {
   return { ...DEFAULT_OPTS, ...partial }
}

export interface Preset {
   name: string
   blurb: string
   overrides: Partial<Record<string, OptVal>>
}

export const PRESETS: Preset[] = [
   { name: 'Clean line', blurb: 'Defaults, nothing on', overrides: {} },
   {
      name: 'Bar graph',
      blurb: 'Rounded purple bars',
      overrides: {
         waveColor: '#7c3aed',
         progressColor: '#f59e0b',
         barWidth: 3,
         barGap: 2,
         barRadius: 3,
         barHeight: 0.6
      }
   },
   {
      name: 'Broadcast',
      blurb: 'Timeline + minimap',
      overrides: {
         waveColor: '#0ea5e9',
         cursorColor: '#0ea5e9',
         timelineEnabled: true,
         minimapEnabled: true,
         height: 160
      }
   },
   {
      name: 'Hover play',
      blurb: 'Hover cue, taller',
      overrides: {
         hoverEnabled: true,
         hoverLineColor: '#f43f5e',
         cursorColor: '#f43f5e',
         height: 160,
         barWidth: 2,
         barGap: 1
      }
   }
]

export interface Source {
   name: string
   url: string
}
export const SOURCES: Source[] = [
   { name: 'Jazz loop', url: '/audio-jazz.wav' },
   { name: 'Audiobook', url: '/audio-speech.mp3' }
]

// Grouped field ordering shared so every variant shows the same Options, just laid out differently.
export const GROUP_ORDER = ['Appearance', 'Waveform', 'Timeline', 'Minimap', 'Hover']

export const FIELDS: { key: string; label: string; group: string; hint: string }[] = [
   { key: 'waveColor', label: 'Wave color', group: 'Appearance', hint: 'Idle waveform fill' },
   { key: 'progressColor', label: 'Progress color', group: 'Appearance', hint: 'Played portion' },
   { key: 'cursorColor', label: 'Cursor color', group: 'Appearance', hint: 'Playhead + click cue' },
   { key: 'height', label: 'Height', group: 'Waveform', hint: 'px, waveform area' },
   { key: 'fillParent', label: 'Fill parent', group: 'Waveform', hint: 'Stretch to full width' },
   { key: 'minPxPerSec', label: 'Zoom (px/sec)', group: 'Waveform', hint: '0 = fit whole file' },
   { key: 'barWidth', label: 'Bar width', group: 'Waveform', hint: '0 = solid line' },
   { key: 'barGap', label: 'Bar gap', group: 'Waveform', hint: 'Spacing between bars' },
   { key: 'barRadius', label: 'Bar radius', group: 'Waveform', hint: 'Rounded bar corners' },
   { key: 'barHeight', label: 'Bar height', group: 'Waveform', hint: 'Vertical scale 0.1–4' },
   { key: 'barMinHeight', label: 'Bar min height', group: 'Waveform', hint: 'px floor per bar' },
   { key: 'timelineEnabled', label: 'Show timeline', group: 'Timeline', hint: 'Tick ruler' },
   { key: 'timelineHeight', label: 'Timeline height', group: 'Timeline', hint: 'px' },
   { key: 'minimapEnabled', label: 'Show minimap', group: 'Minimap', hint: 'Overview strip' },
   { key: 'minimapHeight', label: 'Minimap height', group: 'Minimap', hint: 'px' },
   { key: 'minimapOverlay', label: 'Overlay color', group: 'Minimap', hint: 'Viewport tint' },
   { key: 'hoverEnabled', label: 'Show hover cue', group: 'Hover', hint: 'Time line on mousemove' },
   { key: 'hoverLineColor', label: 'Hover line color', group: 'Hover', hint: '' }
]

export const RANGES: Record<string, { min: number; max: number; step: number }> = {
   height: { min: 60, max: 400, step: 10 },
   minPxPerSec: { min: 0, max: 600, step: 10 },
   barWidth: { min: 0, max: 40, step: 1 },
   barGap: { min: 0, max: 40, step: 1 },
   barRadius: { min: 0, max: 30, step: 1 },
   barHeight: { min: 0.1, max: 4, step: 0.1 },
   barMinHeight: { min: 0, max: 20, step: 1 },
   timelineHeight: { min: 10, max: 80, step: 2 },
   minimapHeight: { min: 20, max: 200, step: 5 }
}

// ---- Derived: the live preview ignores bar* keys while bars are off. ----
export function coreWsOptions(o: Record<string, OptVal>) {
   const c = { ...o } as Record<string, OptVal>
   if (!c.barWidth) {
      delete c.barWidth
      delete c.barGap
      delete c.barRadius
      delete c.barHeight
      delete c.barMinHeight
   }
   return c
}

// ---- Code output (ADR 0002: always-complete options object literal). ----
const fmt = (v: OptVal) => (typeof v === 'string' ? `'${v}'` : String(v))

export function buildCode(o: Record<string, OptVal>): string {
   const plugins = []
   const lines: string[] = []
   if (o.timelineEnabled) plugins.push(`TimelinePlugin.create({ height: ${o.timelineHeight} })`)
   if (o.minimapEnabled)
      plugins.push(`MinimapPlugin.create({ height: ${o.minimapHeight}, overlayColor: '${o.minimapOverlay}' })`)
   if (o.hoverEnabled) plugins.push(`HoverPlugin.create({ lineColor: '${o.hoverLineColor}' })`)

   if (plugins.length)
      lines.push(
         `import TimelinePlugin from 'wavesurfer.js/plugins/timeline';\n` +
            `import MinimapPlugin from 'wavesurfer.js/plugins/minimap';\n` +
            `import HoverPlugin from 'wavesurfer.js/plugins/hover';`
      )

   const coreKeys = [
      'waveColor',
      'progressColor',
      'cursorColor',
      'height',
      'barWidth',
      'barGap',
      'barRadius',
      'barHeight',
      'barMinHeight',
      'fillParent',
      'minPxPerSec'
   ]
   const body: string[] = []
   body.push(`  container: '#waveform',`)
   for (const k of coreKeys) {
      if (k.startsWith('bar') && !o.barWidth) continue
      body.push(`  ${k}: ${fmt(o[k])},`)
   }
   if (plugins.length) body.push(`  plugins: [${plugins.join(', ')}],`)
   const code = lines.length
      ? lines.join('\n') + '\n\nconst wavesurfer = WaveSurfer.create({\n' + body.join('\n') + '\n})'
      : 'const wavesurfer = WaveSurfer.create({\n' + body.join('\n') + '\n})'
   return code
}

// ---- For the on-page "changed count" affordance in some variants. ----
export function diffCount(o: Record<string, OptVal>): number {
   return Object.entries(DEFAULT_OPTS).filter(([k, v]) => o[k] !== v).length
}
