import { WINDOW } from '@lumx/react/constants';

/** Check if user prefers reduced motion */
export function isReducedMotion() {
    return WINDOW?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
