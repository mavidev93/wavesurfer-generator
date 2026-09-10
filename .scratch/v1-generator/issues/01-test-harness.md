# 01: Test harness (Vitest + jsdom + React Testing Library)

**What to build:** the repo currently has no tests or test framework. Introduce Vitest with jsdom and React Testing Library, matching the existing Vite + React + TypeScript stack, so the options-model module (unit tests) and the app screen (component tests with the wavesurfer player mocked at its module boundary) can be written. Add a smoke test proving the toolchain runs and a runnable `test` script.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] `test` script runs and reports pass/fail cleanly
- [ ] A smoke test executes against the configured jsdom + RTL setup
- [ ] The toolchain is runnable for both pure unit tests and React component tests
