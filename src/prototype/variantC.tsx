// PROTOTYPE Variant C — "Guide". A linear wizard — Source → Look → Extras →
// Copy — one decision at a time, while a persistent preview strip under the
// step reflects every change live.
import { useState } from 'react'
import { Preview } from './Preview'
import { SOURCES } from './state'
import type { VariantProps } from './types'
import { CodePanel, GroupedForm, PresetBar } from './widgets'

const STEPS = ['Source', 'Look', 'Extras', 'Copy']

export default function VariantC(props: VariantProps) {
   const src = SOURCES.find((s) => s.name === props.sourceName) ?? SOURCES[0]
   const [step, setStep] = useState(0)

   const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
   const back = () => setStep((s) => Math.max(s - 1, 0))

   return (
      <div className="vp vc">
         <header className="vc-top">
            <h1>
               Wave<b>Gen</b>
            </h1>
            <div className="vc-stepper">
               {STEPS.map((s, i) => (
                  <button
                     key={s}
                     className={`step ${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`}
                     onClick={() => setStep(i)}>
                     <span className="dot">{i + 1}</span>
                     {s}
                  </button>
               ))}
            </div>
         </header>

         <main className="vc-body">
            {step === 0 && (
               <section className="vc-pick">
                  <h2>What are you listening to?</h2>
                  <p>Pick a starting Source. You can swap it again later without losing your options.</p>
                  <div className="card-row">
                     {SOURCES.map((s) => (
                        <button
                           key={s.name}
                           className={`pickcard ${s.name === props.sourceName ? 'is-on' : ''}`}
                           onClick={() => props.onSource(s.name)}>
                           <span className="pick-emblem">{s.name === SOURCES[0].name ? '🎵' : '🎙️'}</span>
                           <span className="pick-name">{s.name}</span>
                           <span className="pick-url">{s.url}</span>
                        </button>
                     ))}
                  </div>
               </section>
            )}

            {step === 1 && (
               <section className="vc-pick">
                  <h2>Make it look how you like</h2>
                  <p>Start from a Preset, then fine-tune colors and the waveform shape.</p>
                  <div className="preset-row">
                     <PresetBar
                        presets={props.presets}
                        current={props.activePreset ?? ''}
                        onPick={props.pickPreset}
                     />
                  </div>
                  <GroupedForm
                     opts={props.opts}
                     set={props.set}
                     groups={['Appearance', 'Waveform']}
                  />
               </section>
            )}

            {step === 2 && (
               <section className="vc-pick">
                  <h2>Layer extras on</h2>
                  <p>Timeline, Minimap and Hover are off by default — switch each on as you want it.</p>
                  <GroupedForm
                     opts={props.opts}
                     set={props.set}
                     groups={['Timeline', 'Minimap', 'Hover']}
                  />
               </section>
            )}

            {step === 3 && (
               <section className="vc-pick vc-copy">
                  <h2>Grab your options</h2>
                  <p>
                     This is the complete Options object — defaults included — matching exactly what you built in the
                     previous steps.
                  </p>
                  <CodePanel code={props.code} />
               </section>
            )}
         </main>

         {/* persistent preview strip — reflects the current state no matter the step */}
         <div className="vc-strip">
            <span className="strip-label">
               live · {props.sourceName}
               {props.activePreset ? ` · ${props.activePreset}` : ''}
            </span>
            <div className="strip-wave">
               <Preview
                  opts={props.opts}
                  url={src.url}
               />
            </div>
         </div>

         <footer className="vc-foot">
            <button
               disabled={step === 0}
               onClick={back}>
               ← Back
            </button>
            <span className="vc-count">
               Step {step + 1} of {STEPS.length}
            </span>
            <button
               disabled={step === STEPS.length - 1}
               onClick={next}
               className="primary">
               Next →
            </button>
         </footer>
      </div>
   )
}
