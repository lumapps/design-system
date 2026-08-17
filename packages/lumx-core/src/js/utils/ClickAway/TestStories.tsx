import { initDemoShadowDOMPortal } from '@lumx/core/stories/utils/initDemoShadowDOMPortal';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { expect, screen, userEvent } from 'storybook/test';

/**
 * Setup ClickAwayProvider stories for a specific framework (React or Vue).
 * Framework-specific components are injected via `components`.
 */
export function setup({
    component: ClickAwayProvider,
    components: { PortalProvider, ButtonWithCard },
}: SetupStoriesOptions<{
    components: {
        PortalProvider: any;
        /** A button that toggles a Card. Accepts: level, parentRef. */
        ButtonWithCard: any;
    };
}>) {
    const meta = {
        component: ClickAwayProvider,
        // Disables Chromatic snapshot (not relevant for this story).
        parameters: { chromatic: { disable: true } },
        // No need to snapshot these stories
        tags: ['!snapshot'],
    };

    /**
     * This story showcases the detection of click away inside a nested portal tree (i.e. not nested in the DOM)
     */
    const NestedClickAway = {
        render: () => (
            <>
                <p>Clicking inside a level should close all child levels but not parent levels</p>
                <ButtonWithCard level={0} />
            </>
        ),
    };

    /**
     * Testing close on click away for a popover rendered in a shadow DOM
     */
    const InShadowDOM = {
        render: () => (
            <PortalProvider value={initDemoShadowDOMPortal}>
                <p>Clicking inside a level should close all child levels but not parent levels</p>
                <ButtonWithCard level={0} />
            </PortalProvider>
        ),
    };

    /**
     * This story showcases how click away behaves around a scrollable container: scrolling a panel
     * is not a click away, whichever way you scroll it, while pressing content is.
     *
     * The scrollbar is forced to take layout space, so that the story still offers a gutter to press
     * on a system that draws overlay scrollbars.
     */
    const ScrollableClickAway = {
        render: () => (
            <>
                <style>{`
                    [data-demo-scroller]::-webkit-scrollbar { width: 15px; height: 15px; }
                    [data-demo-scroller]::-webkit-scrollbar-track { background: #eee; }
                    [data-demo-scroller]::-webkit-scrollbar-thumb { background: #888; }
                `}</style>
                <p>
                    Scrolling a panel is not a click away. Open a level, then scroll the panel below with the wheel, or
                    by dragging its grey scrollbar. The level stays open either way.
                </p>
                <p>
                    Pressing anything else closes the level: the panel content, and the thick borders of the two blocks
                    on the right. Those two blocks overflow their box without ever rendering a scrollbar.
                </p>
                {/* Every length carries an explicit unit: Vue does not append `px` to a bare number. */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                    <section
                        data-demo-scroller=""
                        style={{
                            height: '200px',
                            width: '320px',
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            padding: '8px',
                        }}
                    >
                        <ButtonWithCard level={0} />
                        {Array.from({ length: 30 }, (_, index) => (
                            <p key={index}>panel line {index + 1}</p>
                        ))}
                    </section>
                    <div style={{ width: '180px', border: '12px solid #999', padding: '8px' }}>
                        Block with a 12px border and no overflow.
                    </div>
                    <div
                        style={{
                            width: '180px',
                            border: '12px solid #999',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Truncated text that overflows its box without ever showing a scrollbar
                    </div>
                </div>
            </>
        ),
    };

    /**
     * Test: clicking outside closes the level
     */
    const TestClickAwayCloses = {
        render: () => (
            <>
                <p data-testid="outside">Outside content</p>
                <ButtonWithCard level={0} />
            </>
        ),
        async play() {
            // Open level 1
            await userEvent.click(screen.getByRole('button', { name: 'Open level 1' }));
            expect(screen.getByText('Level 1 -')).toBeInTheDocument();

            // Click outside should close level 1
            await userEvent.click(screen.getByTestId('outside'));
            expect(screen.queryByText('Level 1 -')).not.toBeInTheDocument();
        },
    };

    /**
     * Test: clicking inside a parent level closes child levels but not the parent
     */
    const TestNestedClickAway = {
        render: () => (
            <>
                <p data-testid="outside">Outside content</p>
                <ButtonWithCard level={0} />
            </>
        ),
        async play() {
            // Open level 1
            await userEvent.click(screen.getByRole('button', { name: 'Open level 1' }));
            expect(screen.getByText('Level 1 -')).toBeInTheDocument();

            // Open level 2
            await userEvent.click(screen.getByRole('button', { name: 'Open level 2' }));
            expect(screen.getByText('Level 2 -')).toBeInTheDocument();

            // Click on level 1 text should close level 2 but not level 1
            await userEvent.click(screen.getByText('Level 1 -'));
            expect(screen.queryByText('Level 2 -')).not.toBeInTheDocument();
            expect(screen.getByText('Level 1 -')).toBeInTheDocument();
        },
    };

    return { meta, NestedClickAway, InShadowDOM, ScrollableClickAway, TestClickAwayCloses, TestNestedClickAway };
}
