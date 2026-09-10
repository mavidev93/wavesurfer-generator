// PROTOTYPE Variant D — "Spec sheet". One continuous, never-collapsed document
// of every option, read like a spec/audit, with a sticky right rail holding the
// live preview and the output. Nothing is hidden behind a fold or a drawer.
import { Preview } from './Preview'
import { SOURCES } from './state'
import type { VariantProps } from './types'
import { CodePanel, GroupedForm, PresetBar, SourceBar } from './widgets'

export default function VariantD(props: VariantProps) {
   const src = SOURCES.find((s) => s.name === props.sourceName) ?? SOURCES[0]
   return (
      <div className="vp vd">
         <header className="vd-top">
            <h1>
               Wave<b>Gen</b>
            </h1>
            <span className="vd-rule">every option, visible at once</span>
            <PresetBar
               presets={props.presets}
               current={props.activePreset ?? ''}
               onPick={props.pickPreset}
            />
         </header>

         <div className="vd-toolbar">
            <SourceBar
               sources={SOURCES}
               current={props.sourceName}
               onPick={props.onSource}
            />
         </div>

         <main className="vd-main">
            <section className="vd-doc">
               <GroupedForm
                  opts={props.opts}
                  set={props.set}
                  groups={props.groups}
                  dense
               />
            </section>

            <aside className="vd-aside">
               <div className="vd-card">
                  <div className="card-title">Preview</div>
                  <Preview
                     opts={props.opts}
                     url={src.url}
                  />
               </div>
               <div className="vd-card">
                  <div className="card-title">Options object</div>
                  <CodePanel code={props.code} />
               </div>
            </aside>
         </main>
      </div>
   )
}
