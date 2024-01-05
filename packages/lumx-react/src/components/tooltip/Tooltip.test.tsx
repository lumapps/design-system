import React from 'react';

import { Button } from '@lumx/react';
import { screen, render, waitFor } from '@testing-library/react';
import { queryAllByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';

import { Tooltip, TooltipProps } from './Tooltip';

const CLASSNAME = Tooltip.className as string;

jest.mock('uid', () => ({ uid: () => 'uid' }));
// Skip delays
jest.mock('@lumx/react/constants', () => ({
    ...jest.requireActual('@lumx/react/constants'),
    TOOLTIP_HOVER_DELAY: { open: 0, close: 0 },
}));

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = async (propsOverride: Partial<TooltipProps> = {}) => {
    const props: any = { forceOpen: true, label: 'Tooltip label', children: 'Anchor', ...propsOverride };
    render(<Tooltip {...props} />);
    const tooltip = screen.queryByRole('tooltip', { name: props.label });
    const anchorWrapper = queryByClassName(document.body, 'lumx-tooltip-anchor-wrapper');
    return { props, tooltip, anchorWrapper };
};

describe(`<${Tooltip.displayName}>`, () => {
    describe('render', () => {
        it('should not render with empty label', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: undefined,
                forceOpen: true,
            });
            expect(tooltip).not.toBeInTheDocument();
            expect(anchorWrapper).not.toBeInTheDocument();
        });

        it('should wrap unknown children', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: 'Tooltip label',
                children: 'Anchor',
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            expect(anchorWrapper).toBeInTheDocument();
            expect(anchorWrapper).toHaveAttribute('aria-describedby', tooltip?.id);
        });

        it('should not wrap Button', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: 'Tooltip label',
                children: <Button>Anchor</Button>,
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            expect(anchorWrapper).not.toBeInTheDocument();
            const button = screen.queryByRole('button', { name: 'Anchor' });
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);
        });

        it('should wrap disabled Button', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: 'Tooltip label',
                children: <Button isDisabled>Anchor</Button>,
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            expect(anchorWrapper).toBeInTheDocument();
            expect(anchorWrapper).toHaveAttribute('aria-describedby', tooltip?.id);
            const button = screen.queryByRole('button', { name: 'Anchor' });
            expect(button?.parentElement).toBe(anchorWrapper);
        });

        it('should render multiline', async () => {
            const { tooltip } = await setup({
                label: 'First line\nSecond line',
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            const lines = queryAllByTagName(tooltip as any, 'p');
            expect(lines.length).toBe(2);
            expect(lines[0]).toHaveTextContent('First line');
            expect(lines[1]).toHaveTextContent('Second line');
        });
    });

    describe('activation', () => {
        it('should activate on anchor hover', async () => {
            let { tooltip } = await setup({
                label: 'Tooltip label',
                children: <Button>Anchor</Button>,
                forceOpen: false,
            });

            expect(tooltip).not.toBeInTheDocument();

            // Hover anchor button
            const button = screen.getByRole('button', { name: 'Anchor' });
            await userEvent.hover(button);

            // Tooltip opened
            tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
            expect(tooltip).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);

            // Un-hover anchor button
            userEvent.unhover(button);
            await waitFor(() => {
                expect(button).not.toHaveFocus();
                // Tooltip closed
                expect(tooltip).not.toBeInTheDocument();
            });
        });

        it('should activate on hover anchor and then tooltip', async () => {
            let { tooltip } = await setup({
                label: 'Tooltip label',
                children: <Button>Anchor</Button>,
                forceOpen: false,
            });

            expect(tooltip).not.toBeInTheDocument();

            // Hover anchor button
            const button = screen.getByRole('button', { name: 'Anchor' });
            await userEvent.hover(button);

            // Tooltip opened
            tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
            expect(tooltip).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);

            // Hover tooltip
            await userEvent.hover(tooltip);
            expect(tooltip).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);

            // Un-hover tooltip
            userEvent.unhover(tooltip);
            await waitFor(() => {
                expect(button).not.toHaveFocus();
                // Tooltip closed
                expect(tooltip).not.toBeInTheDocument();
            });
        });

        it('should activate on anchor focus and close on escape', async () => {
            let { tooltip } = await setup({
                label: 'Tooltip label',
                children: <Button>Anchor</Button>,
                forceOpen: false,
            });

            expect(tooltip).not.toBeInTheDocument();

            // Focus anchor button
            await userEvent.tab();
            const button = screen.getByRole('button', { name: 'Anchor' });
            expect(button).toHaveFocus();

            // Tooltip opened
            tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
            expect(tooltip).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);

            // Focus next element => close tooltip
            await userEvent.tab();
            expect(button).not.toHaveFocus();
            expect(tooltip).not.toBeInTheDocument();

            // Focus again
            await userEvent.tab({ shift: true });
            tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
            expect(tooltip).toBeInTheDocument();

            // Escape pressed => close tooltip
            await userEvent.keyboard('{Escape}');
            expect(tooltip).not.toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tooltip',
        forwardAttributes: 'tooltip',
        forwardRef: 'tooltip',
    });
});
