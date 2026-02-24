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

    return { meta, NestedClickAway, InShadowDOM, TestClickAwayCloses, TestNestedClickAway };
}
