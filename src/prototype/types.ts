import type { OptVal } from './state'

export interface VariantProps {
   opts: Record<string, OptVal>
   set: (key: string, value: OptVal) => void
   pickPreset: (name: string) => void
   activePreset: string | null
   presets: string[]
   sourceName: string
   onSource: (name: string) => void
   code: string
   groups: string[]
}
