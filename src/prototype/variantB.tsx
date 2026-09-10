// PROTOTYPE Variant B — "Stage". Preview-first: a big waveform floats on a dark
// stage, presets live over it, and the most-tweaked knobs ride a floating glass
// bar. The full form and code output hide in slide-over drawers.
import { useState, type ReactNode } from 'react'
import { ColorRow, RangeRow, ToggleRow } from './fields'
import { Preview } from './Preview'
import type { OptVal } from './state'
import { SOURCES } from './state'
import type { VariantProps } from './types'
import { CodePanel, GroupedForm, PresetBar, SourceBar } from './widgets'

export default function VariantB(props: VariantProps) {
   const src = SOURCES.find((s) => s.name === props.sourceName) ?? SOURCES[0]
   const [drawer, setDrawer] = useState<null | 'form' | 'code'>(null)

   const set = (k: string, v: OptVal) => props.set(k, v)

   return (
      <div className="vp vb">
         <header className="vb-top">
            <h1>
               Wave<b>Gen</b>
            </h1>
            <span className="vb-hint">pick a look — the waveform is the interface</span>
         </header>

         <main className="vb-stage">
            <div className="vb-stagebar">
               <PresetBar
                  chips
                  presets={props.presets}
                  current={props.activePreset ?? ''}
                  onPick={props.pickPreset}
               />
            </div>

            <div className="vb-canvas">
               <SourceBar
                  sources={SOURCES}
                  current={props.sourceName}
                  onPick={props.onSource}
               />
               <div className="vb-waves">
                  <Preview
                     opts={props.opts}
                     url={src.url}
                  />
               </div>
            </div>
         </main>

         {/* floating control bar — the primary tweak surface */}
         <div
            className="vb-knobs"
            role="group"
            aria-label="Primary options">
            <MiniRow
               label="Height"
               control={
                  <RangeRow
                     label=""
                     value={props.opts.height as number}
                     min={60}
                     max={400}
                     step={10}
                     onChange={(v) => set('height', v)}
                     unit="px"
                  />
               }
            />
            <MiniRow
               label="Bars"
               control={
                  <RangeRow
                     label=""
                     value={props.opts.barWidth as number}
                     min={0}
                     max={40}
                     step={1}
                     onChange={(v) => set('barWidth', v)}
                  />
               }
            />
            <MiniRow
               label="Fill"
               control={
                  <ToggleRow
                     label=""
                     value={!!props.opts.fillParent}
                     onChange={(v) => set('fillParent', v)}
                  />
               }
            />
            <MiniRow
               label="Color"
               control={
                  <ColorRow
                     label=""
                     value={props.opts.waveColor as string}
                     onChange={(v) => set('waveColor', v)}
                  />
               }
            />
            <button
               className="knob-btn"
               onClick={() => setDrawer('form')}>
               ☰ Options
            </button>
            <button
               className="knob-btn"
               onClick={() => setDrawer('code')}>
               {'</>'} Output
            </button>
         </div>

         {drawer && (
            <div
               className="vb-drawer"
               onClick={() => setDrawer(null)}>
               <div
                  className="vb-sheet"
                  onClick={(e) => e.stopPropagation()}>
                  <button
                     className="vb-close"
                     onClick={() => setDrawer(null)}>
                     ✕
                  </button>
                  {drawer === 'form' ? (
                     <>
                        <h3>All options</h3>
                        <GroupedForm
                           opts={props.opts}
                           set={props.set}
                           groups={props.groups}
                        />
                     </>
                  ) : (
                     <>
                        <h3>Copy this</h3>
                        <CodePanel code={props.code} />
                     </>
                  )}
               </div>
            </div>
         )}
      </div>
   )
}

function MiniRow({ label, control }: { label: string; control: ReactNode }) {
   return (
      <div className="minirow">
         {label && <span className="minirow-label">{label}</span>}
         {control}
      </div>
   )
}
