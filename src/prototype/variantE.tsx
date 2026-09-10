// PROTOTYPE Variant E — "Code is the control". The Options object is an editable,
// two-way surface on the left: edit the literal and the waveform beside it updates.
// A collapse-able form underneath is the escape hatch for people who hate typing.
import { useRef, useState } from 'react'
import { Preview } from './Preview'
import type { OptVal } from './state'
import { SOURCES } from './state'
import type { VariantProps } from './types'
import { CodePanel, GroupedForm, PresetBar } from './widgets'

type Pair = [key: string, value: OptVal]

function parseEdits(text: string): Pair[] {
   const out: Pair[] = []
   const has = (needle: string) => text.includes(needle)
   // plugin presence drives the enable flags (absent line = plugin off)
   out.push(['timelineEnabled', has('TimelinePlugin.create')])
   out.push(['minimapEnabled', has('MinimapPlugin.create')])
   out.push(['hoverEnabled', has('HoverPlugin.create')])
   if (has('MinimapPlugin.create')) {
      const ov = text.match(/overlayColor:\s*'([^']+)'/)
      if (ov) out.push(['minimapOverlay', ov[1]])
   }

   const known = [
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
   for (const line of text.split('\n')) {
      const m = line.match(/^\s*(bar\w+|wave\w+|progress\w+|cursor\w+|minPxPerSec|height|fillParent):\s*(.+?),?\s*$/)
      if (!m) continue
      const key = m[1]
      if (!known.includes(key)) continue
      const raw = m[2].trim()
      let val: OptVal = raw
      if (/^'.*'$/.test(raw)) val = raw.slice(1, -1)
      else if (raw === 'true') val = true
      else if (raw === 'false') val = false
      else if (raw !== '' && !Number.isNaN(Number(raw))) val = Number(raw)
      out.push([key, val])
   }
   return out
}

export default function VariantE(props: VariantProps) {
   const src = SOURCES.find((s) => s.name === props.sourceName) ?? SOURCES[0]
   const [draft, setDraft] = useState(props.code)
   const [editing, setEditing] = useState(false)
   const timer = useRef<number | undefined>(undefined)

   // mirror external changes (e.g. a preset pick) unless the user is mid-edit
   if (!editing && props.code !== draft) setDraft(props.code)

   const apply = (text: string) => {
      const pairs = parseEdits(text)
      if (!pairs.length) return
      for (const [k, v] of pairs) props.set(k, v)
   }

   const onChange = (text: string) => {
      setDraft(text)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => apply(text), 300)
   }

   return (
      <div className="vp ve">
         <header className="ve-top">
            <h1>
               Wave<b>Gen</b>
            </h1>
            <span className="tag">edit the literal — the preview obeys the code</span>
            <PresetBar
               chips
               presets={props.presets}
               current={props.activePreset ?? ''}
               onPick={props.pickPreset}
            />
         </header>

         <main className="ve-main">
            <section className="ve-code">
               <div className="ve-editor">
                  <CodePanel
                     code={draft}
                     editable
                     onEdit={onChange}
                     onFocus={() => setEditing(true)}
                     onBlur={() => {
                        apply(draft)
                        setEditing(false)
                     }}
                  />
               </div>
               <details className="ve-form">
                  <summary>…or use the form instead</summary>
                  <GroupedForm
                     opts={props.opts}
                     set={props.set}
                     groups={props.groups}
                  />
               </details>
            </section>

            <section className="ve-side">
               <div className="ve-source">
                  {SOURCES.map((s) => (
                     <button
                        key={s.name}
                        className={`ve-src ${s.name === props.sourceName ? 'is-on' : ''}`}
                        onClick={() => props.onSource(s.name)}>
                        {s.name}
                     </button>
                  ))}
               </div>
               <div className="ve-canvas">
                  <Preview
                     opts={props.opts}
                     url={src.url}
                  />
               </div>
               <p className="ve-tip">
                  Two-way: change a value here and it rewrites the literal; edit the literal and the waveform follows.
               </p>
            </section>
         </main>
      </div>
   )
}
