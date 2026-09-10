// PROTOTYPE shared live preview. One real wavesurfer instance reused by every
// variant so they only differ in layout, not in whether the waveform works.
import WavesurferPlayer from '@wavesurfer/react'
import { useMemo } from 'react'
import Hover from 'wavesurfer.js/plugins/hover'
import Minimap from 'wavesurfer.js/plugins/minimap'
import Timeline from 'wavesurfer.js/plugins/timeline'
import type { OptVal } from './state'
import { coreWsOptions } from './state'

interface Props {
   opts: Record<string, OptVal>
   url: string
}

export function Preview({ opts, url }: Props) {
   // plugins must be memoized or wavesurfer re-inits every render.
   const plugins = useMemo(() => {
      const p = []
      if (opts.timelineEnabled) p.push(Timeline.create({ height: opts.timelineHeight as number }))
      if (opts.minimapEnabled)
         p.push(
            Minimap.create({
               height: opts.minimapHeight as number,
               overlayColor: opts.minimapOverlay as string
            })
         )
      if (opts.hoverEnabled) p.push(Hover.create({ lineColor: opts.hoverLineColor as string }))
      return p
   }, [
      opts.timelineEnabled,
      opts.timelineHeight,
      opts.minimapEnabled,
      opts.minimapHeight,
      opts.minimapOverlay,
      opts.hoverEnabled,
      opts.hoverLineColor
   ])

   const wsOpts = coreWsOptions(opts)

   return (
      <WavesurferPlayer
         height={opts.height as number}
         url={url}
         waveColor={opts.waveColor as string}
         progressColor={opts.progressColor as string}
         cursorColor={opts.cursorColor as string}
         barWidth={(wsOpts.barWidth as number) || undefined}
         barGap={(wsOpts.barGap as number) || undefined}
         barRadius={(wsOpts.barRadius as number) || undefined}
         barHeight={(wsOpts.barHeight as number) || undefined}
         barMinHeight={(wsOpts.barMinHeight as number) || undefined}
         fillParent={opts.fillParent as boolean}
         minPxPerSec={opts.minPxPerSec as number}
         autoCenter={true}
         plugins={plugins}
      />
   )
}
