// PROTOTYPE shared widgets. Controls are shared chrome; variants rearrange them.
import { useState, type ReactNode } from 'react'
import { ColorRow, RangeRow, ToggleRow } from './fields'
import type { OptVal } from './state'
import { FIELDS, RANGES } from './state'

type Setter = (key: string, value: OptVal) => void

// ---- Generic grouped form. `groups` lets a variant show a subset; `collapsible`
// lets A/D/C decide how sections behave. Only the layout scaffold differs.
export function GroupedForm({
   opts,
   set,
   groups,
   collapsible = false,
   dense = false
}: {
   opts: Record<string, OptVal>
   set: Setter
   groups: string[]
   collapsible?: boolean
   dense?: boolean
}) {
   const [open, setOpen] = useState<Record<string, boolean>>({})
   return (
      <div className={dense ? 'form form--dense' : 'form'}>
         {groups.map((g) => {
            const fields = FIELDS.filter((f) => f.group === g)
            if (!fields.length) return null
            const pluginGroup = ['Timeline', 'Minimap', 'Hover'].includes(g)
            const enabledKey = pluginGroup
               ? g === 'Timeline'
                  ? 'timelineEnabled'
                  : g === 'Minimap'
                    ? 'minimapEnabled'
                    : 'hoverEnabled'
               : null
            const enabled = enabledKey ? !!opts[enabledKey] : true
            const isCollapsed = collapsible && open[g] === false
            return (
               <section
                  className="form-section"
                  key={g}>
                  <header
                     className="form-h"
                     onClick={collapsible ? () => setOpen((o) => ({ ...o, [g]: !o[g] })) : undefined}>
                     <h3>
                        {collapsible && <span className="caret">{isCollapsed ? '▸' : '▾'}</span>}
                        {g}
                     </h3>
                  </header>
                  {!isCollapsed && (
                     <div className="form-body">
                        {fields.map((f) => {
                           const control = controlFor(f.key, opts, set)
                           const hideRow = !enabled && pluginGroup && f.key !== enabledKey
                           return (
                              <div
                                 key={f.key}
                                 className={hideRow ? 'frow-hidden' : ''}
                                 title={f.hint || undefined}>
                                 {control}
                              </div>
                           )
                        })}
                     </div>
                  )}
               </section>
            )
         })}
      </div>
   )
}

function controlFor(key: string, opts: Record<string, OptVal>, set: Setter): ReactNode {
   const value = opts[key]
   const setv = (v: OptVal) => set(key, v)
   if (typeof value === 'boolean')
      return (
         <ToggleRow
            label={label(key)}
            value={value}
            onChange={setv}
         />
      )
   if (typeof value === 'number') {
      const r = RANGES[key] ?? { min: 0, max: 1, step: 1 }
      return (
         <RangeRow
            label={label(key)}
            value={value}
            {...r}
            onChange={setv}
         />
      )
   }
   return (
      <ColorRow
         label={label(key)}
         value={value}
         onChange={setv}
      />
   )
}

function label(key: string) {
   const f = FIELDS.find((x) => x.key === key)
   const l = f ? f.label : key
   return (
      <span className={l.length > 14 ? 'flabel-long' : undefined}>
         {l}
         <em>{f?.hint}</em>
      </span>
   )
}

// ---- Copyable options object output (ADR 0002). Editable flag lets Variant E
// treat the code as an input, not just an artifact. ----
export function CodePanel({
   code,
   editable = false,
   onEdit,
   onFocus,
   onBlur
}: {
   code: string
   editable?: boolean
   onEdit?: (c: string) => void
   onFocus?: () => void
   onBlur?: () => void
}) {
   const [copied, setCopied] = useState(false)
   return (
      <div className="code-panel">
         <div className="code-bar">
            <span className="code-title">Options object</span>
            <button
               className="copy"
               onClick={() => {
                  navigator.clipboard?.writeText(code).then(() => {
                     setCopied(true)
                     setTimeout(() => setCopied(false), 1200)
                  })
               }}>
               {copied ? 'Copied ✓' : 'Copy'}
            </button>
         </div>
         {editable ? (
            <textarea
               className="code-ta"
               spellCheck={false}
               value={code}
               onFocus={onFocus}
               onBlur={onBlur}
               onChange={(e) => onEdit?.(e.target.value)}
            />
         ) : (
            <pre className="code-pre">{code}</pre>
         )}
      </div>
   )
}

// ---- Presets + Source, both shared across variants (they may be placed anywhere). ----
export function PresetBar({
   presets,
   current,
   onPick,
   chips = false
}: {
   presets: string[]
   current: string
   onPick: (name: string) => void
   chips?: boolean
}) {
   return (
      <div className={chips ? 'preset-bar preset-bar--chips' : 'preset-bar'}>
         {presets.map((p) => (
            <button
               key={p}
               className={`preset ${p === current ? 'is-active' : ''}`}
               onClick={() => onPick(p)}>
               {p}
            </button>
         ))}
      </div>
   )
}

export function SourceBar({
   sources,
   current,
   onPick
}: {
   sources: { name: string; url: string }[]
   current: string
   onPick: (name: string) => void
}) {
   return (
      <div
         className="source-bar"
         role="group"
         aria-label="Source">
         <span className="source-label">Source</span>
         {sources.map((s) => (
            <button
               key={s.name}
               className={`source ${s.name === current ? 'is-active' : ''}`}
               onClick={() => onPick(s.name)}>
               {s.name}
            </button>
         ))}
      </div>
   )
}
