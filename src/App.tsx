// PROTOTYPE — five UI directions for the wavesurfer generator, switchable via
// ?variant=A..E (floating bottom bar or ←/→ arrow keys). Shared options state
// lives here, so flipping variants keeps your tweaks. Throwaway code.
import { useEffect, useState } from 'react'
import './App.css'
import './prototype/prototype.css'
import { DEFAULT_OPTS, GROUP_ORDER, PRESETS, SOURCES, buildCode, type OptVal } from './prototype/state'
import type { VariantProps } from './prototype/types'
import VariantA from './prototype/variantA'
import VariantB from './prototype/variantB'
import VariantC from './prototype/variantC'
import VariantD from './prototype/variantD'
import VariantE from './prototype/variantE'

const KEYS = ['A', 'B', 'C', 'D', 'E']
const NAMES: Record<string, string> = {
   A: 'Split studio',
   B: 'Stage',
   C: 'Guide',
   D: 'Spec sheet',
   E: 'Code-first'
}

function currentVariant(): string {
   const v = new URLSearchParams(window.location.search).get('variant')
   return v && KEYS.includes(v.toUpperCase()) ? v.toUpperCase() : 'A'
}

export default function App() {
   const [variant, setVariant] = useState(currentVariant)
   const [opts, setOpts] = useState<Record<string, OptVal>>({ ...DEFAULT_OPTS })
   const [sourceName, setSourceName] = useState<string>(SOURCES[0].name)

   const set = (key: string, value: OptVal) => setOpts((prev) => ({ ...prev, [key]: value }))

   const pickPreset = (name: string) => {
      const p = PRESETS.find((x) => x.name === name)
      if (p) setOpts({ ...DEFAULT_OPTS, ...p.overrides } as Record<string, OptVal>)
   }

   const activePreset =
      PRESETS.find((p) => {
         const full = { ...DEFAULT_OPTS, ...p.overrides }
         return Object.entries(full).every(([k, v]) => opts[k] === v)
      })?.name ?? null

   const code = buildCode(opts)

   const go = (v: string) => {
      setVariant(v)
      window.history.replaceState(null, '', `?variant=${v}`)
   }

   const cycle = (dir: 1 | -1) => {
      const i = KEYS.indexOf(variant)
      go(KEYS[(i + dir + KEYS.length) % KEYS.length])
   }

   useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
         const t = e.target as HTMLElement
         if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
         if (e.key === 'ArrowRight') cycle(1)
         if (e.key === 'ArrowLeft') cycle(-1)
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [variant])

   const props: VariantProps = {
      opts,
      set,
      pickPreset,
      activePreset,
      presets: PRESETS.map((p) => p.name),
      sourceName,
      onSource: setSourceName,
      code,
      groups: GROUP_ORDER
   }

   return (
      <>
         {variant === 'A' && <VariantA {...props} />}
         {variant === 'B' && <VariantB {...props} />}
         {variant === 'C' && <VariantC {...props} />}
         {variant === 'D' && <VariantD {...props} />}
         {variant === 'E' && <VariantE {...props} />}

         {import.meta.env.DEV && (
            <div className="proto-switch">
               <button
                  className="arr"
                  onClick={() => cycle(-1)}
                  title="previous (←)">
                  ←
               </button>
               <span className="vlabel">
                  <b>{variant}</b> · {NAMES[variant]}
               </span>
               <button
                  className="arr"
                  onClick={() => cycle(1)}
                  title="next (→)">
                  →
               </button>
            </div>
         )}
      </>
   )
}
