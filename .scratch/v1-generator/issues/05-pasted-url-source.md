# 05: Pasted-URL Source

**What to build:** let the user point the app at their own audio by pasting a URL that becomes the Source, so they can tune Options against the audio they actually ship (US 24). Switching to a pasted-URL Source preserves their current Options, and the Preview receives that URL.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] A pasted URL can be set as the Source
- [ ] The Preview plays the audio at that URL
- [ ] Switching Source (bundled or URL) preserves the current Options
- [ ] The emitted Options object is unaffected by Source choice
