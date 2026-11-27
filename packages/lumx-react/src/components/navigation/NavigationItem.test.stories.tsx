import { expect, screen } from 'storybook/test';

import { Navigation } from '@lumx/react';

export default {
    title: 'LumX components/navigation/NavigationItem/Tests',
    component: Navigation.Item,
    tags: ['!snapshot'],
    parameters: { chromatic: { disableSnapshot: true } },
};

const LONG_LABEL = 'Some very very very very very very very very very very very very very very very very long text';

/**
 * A label that overflows only once its container becomes visible should still get a tooltip at the first hover.
 */
export const TestTooltipOnHiddenMount = {
    render() {
        return (
            <div data-testid="hidden-mount-container" style={{ display: 'none', width: 120 }}>
                <Navigation aria-label="navigation">
                    <Navigation.Item label={LONG_LABEL} href="#" />
                </Navigation>
            </div>
        );
    },
    async play({ canvas, userEvent }: any) {
        const container = canvas.getByTestId('hidden-mount-container');
        container.style.display = 'block';

        await userEvent.hover(canvas.getByRole('link', { name: LONG_LABEL }));

        expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_LABEL);
    },
};
