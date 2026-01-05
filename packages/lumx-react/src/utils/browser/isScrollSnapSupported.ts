import { WINDOW } from '@lumx/react/constants';

/** Check if browser supports CSS scroll-snap */
export function isScrollSnapSupported() {
    return WINDOW?.CSS?.supports?.('scroll-snap-type', 'x mandatory') ?? false;
}
