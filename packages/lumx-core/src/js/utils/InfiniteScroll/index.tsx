import type { CommonRef } from '../../types';

export { setupInfiniteScrollObserver } from './setupInfiniteScrollObserver';

export const INFINITE_SCROLL_CLASSNAME = 'lumx-infinite-scroll-anchor';

export interface InfiniteScrollProps {
    /** Callback when infinite scroll component is in view */
    // eslint-disable-next-line react/no-unused-prop-types
    callback: (evt?: Event) => void;
    /** Customize intersection observer option */
    // eslint-disable-next-line react/no-unused-prop-types
    options?: IntersectionObserverInit;
}

/**
 * Framework-agnostic InfiniteScroll sentinel component.
 *
 * Renders a tiny invisible div that triggers a callback when it enters the viewport
 * (or intersects its root element) via IntersectionObserver.
 *
 * The div has a small height (4px) to avoid issues when a browser zoom is applied,
 * where a zero-height element might not trigger IntersectionObserver reliably.
 */
export const InfiniteScroll = ({ ref }: { ref?: CommonRef }) => (
    // In order to avoid issues when a zoom is added to the browser, we add a small height to the div so that
    // the intersection has a higher chance of working correctly.
    <div ref={ref} aria-hidden="true" className={INFINITE_SCROLL_CLASSNAME} style={{ height: '4px' }} />
);
