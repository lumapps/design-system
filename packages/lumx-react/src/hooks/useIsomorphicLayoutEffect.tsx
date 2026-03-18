import { useEffect, useLayoutEffect } from 'react';

/**
 * SSR-safe version of `useLayoutEffect`.
 * Uses `useLayoutEffect` on the client and `useEffect` on the server to avoid React SSR warnings.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
