import { expect, waitFor, fn } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { INFINITE_SCROLL_CLASSNAME } from '.';

/** Style for the fixed-height scrollable container used in scroll zone tests. */
const SCROLL_ZONE_STYLE = { height: '200px', overflowY: 'auto', border: '1px solid #ccc', resize: 'vertical' } as const;

/** Number of fake items rendered inside the scroll zone to generate enough scrollable content. */
const SCROLL_ZONE_ITEM_COUNT = 20;

/**
 * Setup InfiniteScroll test stories for a specific framework (React or Vue).
 *
 * @param component      The framework InfiniteScroll component.
 * @param components     Framework-specific components:
 *   - ScrollZone: a pre-wired component rendering a fixed-height scrollable container
 *     with tall fake content and InfiniteScroll at the bottom. Accepts:
 *       - `onLoad` callback (called when the sentinel intersects)
 *       - `data-testid` forwarded to the scroll container div
 */
export function setup({ component: InfiniteScroll }: SetupStoriesOptions) {
    const meta = {
        component: InfiniteScroll,
        tags: ['!snapshot'],
        parameters: { chromatic: { disableSnapshot: true } },
        args: { callback: () => {} },
    };

    /** Test: renders the sentinel div with the correct class, style and aria-hidden */
    const TestRendersSentinelDiv = {
        render: (args: any) => <InfiniteScroll {...args} />,
        async play({ canvasElement }: any) {
            const sentinel = canvasElement.querySelector(`.${INFINITE_SCROLL_CLASSNAME}`);
            expect(sentinel).not.toBeNull();
            expect(sentinel.getAttribute('aria-hidden')).toBe('true');
            expect(sentinel.style.height).toBe('4px');
        },
    };

    const ScrollZone = ({ callback }: any) => (
        <div data-testid="scroll-zone" style={SCROLL_ZONE_STYLE}>
            {Array.from({ length: SCROLL_ZONE_ITEM_COUNT }, (_, i) => (
                <p key={i} style={{ margin: '8px' }}>
                    Item {i + 1}
                </p>
            ))}
            <InfiniteScroll callback={callback} />
        </div>
    );

    /**
     * Test: callback is triggered when scrolling to the bottom of a scroll zone.
     * The ScrollZone component is pre-wired with a fixed-height scrollable container,
     * tall fake content, and InfiniteScroll at the bottom using the container as root.
     */
    const TestDetectsScrollEnd = {
        render: ScrollZone,
        args: { callback: fn() },
        async play({ canvas, args }: any) {
            expect(args.callback).not.toHaveBeenCalled();

            const container = canvas.getByTestId('scroll-zone');

            // Scroll to the bottom of the container to trigger intersection
            container.scrollTop = container.scrollHeight;

            // Wait for the IntersectionObserver to fire and invoke the callback
            await waitFor(() => {
                expect(args.callback).toHaveBeenCalled();
            });
        },
    };

    /**
     * Test: callback is NOT called when the sentinel stays out of view (no scroll).
     * Verifies there are no false positives — the sentinel is below the scroll viewport.
     */
    const TestNoCallbackWithoutScroll = {
        render: ScrollZone,
        args: { callback: fn() },
        async play({ canvas, args }: any) {
            const container = canvas.getByTestId('scroll-zone');

            // Ensure the container is scrolled to the top (sentinel out of view)
            container.scrollTop = 0;

            // Poll to ensure no intersection fires
            await waitFor(
                () => {
                    expect(args.callback).not.toHaveBeenCalled();
                },
                { timeout: 200 },
            );
        },
    };

    /**
     * Test: callback is triggered again on subsequent scrolls.
     * Scrolls to bottom, scrolls back up, then scrolls to bottom again — verifying re-trigger.
     */
    const TestRetriggersOnSubsequentScrolls = {
        render: ScrollZone,
        args: { callback: fn() },
        async play({ canvas, args }: any) {
            const container = canvas.getByTestId('scroll-zone');

            // First scroll to bottom
            container.scrollTop = container.scrollHeight;
            await waitFor(() => {
                expect(args.callback).toHaveBeenCalled();
            });

            // Scroll back to top
            container.scrollTop = 0;
            // Wait for 2 frame (better than arbitrary setTimeout) to let the browser apply scroll
            await new Promise((resolve) => {
                requestAnimationFrame(() => requestAnimationFrame(resolve));
            });

            // Scroll to bottom again and wait for the callback to re-trigger
            container.scrollTop = container.scrollHeight;
            await waitFor(() => {
                expect(args.callback).toHaveBeenCalledTimes(2);
            });
        },
    };

    return {
        meta,
        TestRendersSentinelDiv,
        TestDetectsScrollEnd,
        TestNoCallbackWithoutScroll,
        TestRetriggersOnSubsequentScrolls,
    };
}
