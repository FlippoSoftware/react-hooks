# @flippo-software/react-hooks

Generic React hooks: DOM and browser APIs, events, focus, layout, timers, state and lifecycle helpers. Used by
[`@flippo-software/react-components`](https://github.com/FlippoSoftware/flippo-ui/tree/main/packages/react-components)
and by apps.

> **Status: not yet released.** Formerly `@flippo-ui/hooks`, then a package of the
> [flippo-ui](https://github.com/FlippoSoftware/flippo-ui) monorepo. The React adapter of the store (`useStore`,
> `ReactStore`) moved to
> [`@flippo-software/react-store`](https://github.com/FlippoSoftware/flippo-ui/tree/main/packages/react-store).

## Install

```sh
pnpm add @flippo-software/react-hooks
```

React 19 (`react`, `react-dom`) is a peer dependency.

## Import

```tsx
import { useMediaQuery, useMergedRef } from '@flippo-software/react-hooks';

// Or one hook per entry point (kebab-case names):
import { useMediaQuery } from '@flippo-software/react-hooks/use-media-query';
```

## Hooks

| Area | Hooks |
| --- | --- |
| State and refs | `useControlledState`, `usePreviousValue`, `useValueChanged`, `useLatestRef`, `useLazyRef`, `useValueAsRef`, `useRefAsState`, `useMergedRef`, `useForcedRerendering`, `useLocalStorage` |
| Callbacks and effects | `useEventCallback`, `useStableCallback`, `useEnhancedEffect`, `useIsoLayoutEffect`, `useDidUpdate`, `useOnMount`, `useOnFirstRender`, `useIsFirstRender`, `useUnmount`, `useTimeout`, `useInterval`, `useAnimationFrame` |
| Events and input | `useEventListener`, `useWindowEvent`, `useClickOutside`, `useEnhancedClickHandler`, `useHotkeys`, `useHover`, `useLongPress`, `useMouse`, `useMove`, `useDragGesture`, `useTextSelection` |
| Focus | `useFocus`, `useFocusWithin`, `useFocusTrap`, `useFocusReturn`, `useOpenInteractionType` |
| Layout and viewport | `useMediaQuery`, `useViewportSize`, `useWindowScroll`, `useScrollIntoView`, `useScrollLock`, `useScrollSpy`, `useResizeObserver`, `useMutationObserver`, `useIntersection`, `useInViewport`, `useOrientation` |
| Transitions | `useTransitionStatus`, `useStatusTransition`, `useAnimationsFinished`, `useOpenChangeComplete` |
| Browser | `useClipboard`, `useColorSchema`, `useDocumentTitle`, `useFavicon`, `useFileDialog`, `useEyeDropper`, `useFullscreen`, `useHash`, `useIdle`, `useNetwork`, `useOs`, `useSsr`, `useId` |

Examples:

```tsx
const isWide = useMediaQuery('(min-width: 60rem)');

const [open, setOpen] = useControlledState({ prop: props.open, defaultProp: false, onChange: props.onOpenChange });

const ref = useMergedRef(forwardedRef, localRef);

useHotkeys([['mod+K', openSearch]]);
```

## Development

```sh
pnpm install
pnpm build        # Vite, then scripts/generate-exports.js (one entry point per hook in package.json `exports`)
pnpm lint:check   # Biome and API Extractor (the public API report is etc/react-hooks.api.md)
pnpm typecheck
pnpm api:report   # after an intended API change: rewrites etc/react-hooks.api.md
```

The types are built with TypeScript 5 (`vite-plugin-dts`). Releases: release-please from conventional commits, then
the Release workflow publishes. [`AGENTS.md`](./AGENTS.md) maps the source.
