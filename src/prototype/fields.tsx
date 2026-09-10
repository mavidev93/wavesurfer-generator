// PROTOTYPE form primitives. These are shared chrome; variants re-arrange them
// into different layouts. Layout = the thing under test, controls are not.
import type { ReactNode } from 'react'

export function ColorRow({
   label,
   value,
   onChange
}: {
   label: ReactNode
   value: string
   onChange: (v: string) => void
}) {
   return (
      <label className="frow">
         <span className="fname">{label}</span>
         <span className="fctl">
            <input
               type="color"
               value={hex(value)}
               onChange={(e) => onChange(e.target.value)}
            />
            <code className="fval">{value}</code>
         </span>
      </label>
   )
}

export function RangeRow({
   label,
   value,
   min,
   max,
   step,
   onChange,
   unit = ''
}: {
   label: ReactNode
   value: number
   min: number
   max: number
   step: number
   onChange: (v: number) => void
   unit?: string
}) {
   return (
      <label className="frow">
         <span className="fname">{label}</span>
         <span className="fctl">
            <input
               type="range"
               min={min}
               max={max}
               step={step}
               value={value}
               onChange={(e) => onChange(Number(e.target.value))}
            />
            <code className="fval">
               {value}
               {unit}
            </code>
         </span>
      </label>
   )
}

export function ToggleRow({
   label,
   value,
   onChange
}: {
   label: ReactNode
   value: boolean
   onChange: (v: boolean) => void
}) {
   return (
      <label className="frow frow--toggle">
         <span className="fname">{label}</span>
         <span className="fctl">
            <input
               type="checkbox"
               checked={value}
               onChange={(e) => onChange(e.target.checked)}
            />
         </span>
      </label>
   )
}

function hex(c: string): string {
   if (/^#[0-9a-f]{3}$/i.test(c)) {
      return (
         '#' +
         c
            .slice(1)
            .split('')
            .map((h) => h + h)
            .join('')
      )
   }
   return c
}
