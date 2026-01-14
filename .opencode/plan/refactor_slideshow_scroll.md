# Refactor Slideshow Scroll Logic

## Goal

Simplify `useSlideScroll` hook using `scrollend` event.

## Strategy

Use a local helper to handle `scrollend` event with a fallback for older browsers, avoiding external polyfill dependencies.

## Steps

1.  **Create Helper**: `packages/lumx-react/src/utils/browser/onScrollEnd.ts`
    -   Implements `onScrollEnd` using native event or timeout fallback.
2.  **Refactor Hook**: `packages/lumx-react/src/components/slideshow/useSlideScroll.ts`
    -   Replace `debounce` and `scroll` listener with `onScrollEnd`.
    -   Simplify state synchronization logic.
