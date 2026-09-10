# 06: Local-file Source

**What to build:** let the user load a local audio file as the Source, so they can tune against audio they can't host publicly (US 25). The file is turned into an object URL that drives the Preview; the object URL is cleaned up when switching away, and Options are preserved across the switch.

**Blocked by:** 05.

**Status:** ready-for-agent

- [ ] A local audio file can be chosen and becomes the Source
- [ ] The Preview plays the selected local file
- [ ] Options are preserved when switching Sources
- [ ] The object URL is released when the Source is switched away
