// PROTOTYPE Variant A — "Split studio". Three always-visible panes (form rail |
// preview | live output) you can scan at once, IDE style.
import { Preview } from './Preview'
import { SOURCES } from './state'
import type { VariantProps } from './types'
import { CodePanel, GroupedForm, PresetBar, SourceBar } from './widgets'

export default function VariantA(props: VariantProps) {
   const src = SOURCES.find((s) => s.name === props.sourceName) ?? SOURCES[0]
   return (
      <div className="vp va">
         <header className="va-top">
            <h1>
               Wave<b>Gen</b>
            </h1>
            <span className="tag">three-pane split · form ⇄ preview ⇄ output, all at once</span>
            <PresetBar
               chips
               presets={props.presets}
               current={props.activePreset ?? ''}
               onPick={props.pickPreset}
            />
         </header>

         <main className="va-main">
            <nav className="va-nav">
               <SourceBar
                  sources={SOURCES}
                  current={props.sourceName}
                  onPick={props.onSource}
               />
               <GroupedForm
                  opts={props.opts}
                  set={props.set}
                  groups={props.groups}
                  collapsible
               />
            </nav>

            <section className="va-preview">
               <div className="stage-label">Preview — {props.sourceName}</div>
               <div className="stage-canvas">
                  <Preview
                     opts={props.opts}
                     url={src.url}
                  />
               </div>
               <p className="stage-tip">
                  Every change in the left rail redraws here instantly. The right pane always holds the full, copy-ready
                  Options object.
               </p>
            </section>

            <aside className="va-out">
               <CodePanel code={props.code} />
            </aside>
         </main>
      </div>
   )
}
