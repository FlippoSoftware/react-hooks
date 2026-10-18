# @flippo-software/react-hooks — notes for agents

Generic React hooks used by `@flippo-software/react-components` (flippo-ui monorepo) and apps. Peer dependencies:
React 19. A repository of its own (formerly `packages/react-hooks` of flippo-ui; the store adapter moved to
`@flippo-software/react-store` there). `README.md` is the user documentation; this file is the
map.

## Layout

```
src/hooks/<useName>/index.ts + <useName>.ts   one folder per hook; each is an entry point `@flippo-software/react-hooks/use-name`
src/hooks/index.ts                            re-exports every hook
src/lib/                                      small DOM/utility helpers (owner, contains, detectBrowser, clamp…)
scripts/generate-exports.js                   writes package.json `exports` from the built hooks
```

Hooks: animation frame/finished, click outside, clipboard, color scheme, controlled state, did update, document
title, drag gesture, event callback, event listener, eye dropper, favicon, file dialog, focus (+ return, trap,
within), forced rerendering, fullscreen, hash, hotkeys, hover, id, idle, in viewport, intersection, interval,
first render, iso layout effect, latest/lazy refs, local storage, long press, media query, merged ref, mouse, move,
mutation observer, network, on mount/first render, open change complete, open interaction type, orientation, OS,
previous value, ref as state, resize observer, scroll into view, scroll lock, scroll spy, SSR, stable callback,
status/transition status, text selection, timeout, unmount, value as ref, value changed, viewport size,
window event, window scroll.

## Rules

- Build: `pnpm build` = Vite + `scripts/generate-exports.js` (exports use kebab-case names). No test script yet.
- `pnpm lint:check` = Biome + API Extractor: an intended public API change needs `pnpm api:report` and the updated
  `etc/react-hooks.api.md`.
- react-components (flippo-ui) depends on the published package: a breaking change is a major release. Never commit,
  push or publish unless asked.
