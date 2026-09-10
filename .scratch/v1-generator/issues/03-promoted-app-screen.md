# 03: Promoted "Split studio" app screen

**What to build:** promote the validated Variant A "Split studio" layout into the real, single app and remove the prototype's variant switcher, `?variant=` routing, and layouts B–E (US 28). The screen is a header (title, tagline, Preset chips), a left rail (Source switcher for the bundled samples plus a collapsible grouped form whose plugin sections are headed by their enable toggle and hide a disabled plugin's sub-Options), a center live Preview built from the Options model, and a right pane with the always-complete Options object and a Copy button with "Copied" feedback. Every form change updates the artifact and redraws the Preview instantly (US 1, 2, 7, 8, 9, 10, 11, 18). Picking a Preset overwrites the entire form, the active Preset stays highlighted only while the Options exactly match it, and the highlight clears on any manual tweak (US 19, 20, 21). Switching bundled Sources passes the right URL to the player and preserves Options (US 22, 23).

**Blocked by:** 02.

**Status:** ready-for-agent

- [ ] The three panes (grouped form / Preview / Options object) are visible at once and edits flow through to the artifact and Preview
- [ ] Plugin sections have enable toggles and hide sub-Options while disabled; groups are collapsible
- [ ] The Copy button writes the artifact and gives clear "Copied" feedback
- [ ] Picking a Preset overwrites the whole form; the active Preset highlight matches exactly and clears on any manual tweak
- [ ] Switching bundled Sources passes the right URL and preserves Options
- [ ] The variant switcher, `?variant=` param, and layouts B–E are gone
- [ ] Screen tests mock the wavesurfer player and assert artifact updates, Preset behavior, Source URL, and plugin instances the mock receives; real rendering is verified by eye in dev
