import React from 'react';

import { Button } from '@lumx/react';
import { screen, render } from '@testing-library/react';
import { queryAllByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { isFocusVisible } from '@lumx/react/utils/isFocusVisible';
import { VISUALLY_HIDDEN } from '@lumx/react/constants';

import { Tooltip, TooltipProps } from './Tooltip';

const CLASSNAME = Tooltip.className as string;

jest.mock('@lumx/react/utils/isFocusVisible');
jest.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));
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
    const result = render(<Tooltip {...props} />);
    const tooltip = screen.queryByRole('tooltip', { name: props.label });
    const anchorWrapper = queryByClassName(document.body, 'lumx-tooltip-anchor-wrapper');
    return { props, tooltip, anchorWrapper, result };
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
            // Default placement
            expect(tooltip).toHaveAttribute('data-popper-placement', 'bottom');
            expect(anchorWrapper).toBeInTheDocument();
        });

        it('should render with custom placement', async () => {
            const { tooltip } = await setup({
                label: 'Tooltip label',
                children: 'Anchor',
                forceOpen: true,
                placement: 'top',
            });
            // Custom placement
            expect(tooltip).toHaveAttribute('data-popper-placement', 'top');
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

        it('should have a stable ref', async () => {
            const ref = React.createRef() as any;

            // Render without a label
            const result = render(
                <Tooltip label="">
                    <span ref={ref}>some text</span>
                </Tooltip>,
            );
            const element = ref.current;
            expect(element).not.toBeFalsy();

            // Re-render with a label
            result.rerender(
                <Tooltip label="Some tooltip">
                    <span ref={ref}>some updated text</span>
                </Tooltip>,
            );
            // Children ref is stable
            expect(ref.current === element).toBe(true);
        });

        describe('closeMode="hide"', () => {
            it('should not render with empty label', async () => {
                const { tooltip, anchorWrapper } = await setup({
                    label: undefined,
                    forceOpen: true,
                    closeMode: 'hide',
                });
                expect(tooltip).not.toBeInTheDocument();
                expect(anchorWrapper).not.toBeInTheDocument();
            });

            it('should render hidden', async () => {
                const { tooltip } = await setup({
                    label: 'Tooltip label',
                    children: <Button>Anchor</Button>,
                    closeMode: 'hide',
                    forceOpen: false,
                });
                expect(tooltip).toBeInTheDocument();
                expect(tooltip).toHaveClass(VISUALLY_HIDDEN);

                const anchor = screen.getByRole('button', { name: 'Anchor' });
                await userEvent.hover(anchor);
                expect(tooltip).not.toHaveClass(VISUALLY_HIDDEN);
            });
        });

        describe('ariaLinkMode="aria-describedby"', () => {
            it('should add aria-describedby on anchor on open', async () => {
                await setup({
                    label: 'Tooltip label',
                    forceOpen: false,
                    children: <Button aria-describedby=":description1:">Anchor</Button>,
                });
                const anchor = screen.getByRole('button', { name: 'Anchor' });
                expect(anchor).toHaveAttribute('aria-describedby', ':description1:');

                await userEvent.hover(anchor);
                const tooltip = screen.queryByRole('tooltip');
                expect(anchor).toHaveAttribute('aria-describedby', `:description1: ${tooltip?.id}`);
            });

            it('should always add aria-describedby on anchor with closeMode="hide"', async () => {
                const { tooltip } = await setup({
                    label: 'Tooltip label',
                    forceOpen: false,
                    children: <Button aria-describedby=":description1:">Anchor</Button>,
                    closeMode: 'hide',
                });
                const anchor = screen.getByRole('button', { name: 'Anchor' });
                expect(anchor).toHaveAttribute('aria-describedby', `:description1: ${tooltip?.id}`);
            });

            it('should skip aria-describedby if anchor has label', async () => {
                const { tooltip } = await setup({
                    label: 'Tooltip label',
                    forceOpen: true,
                    children: (
                        <Button aria-describedby=":description1:" aria-label="Tooltip label">
                            Anchor
                        </Button>
                    ),
                });
                expect(tooltip).toBeInTheDocument();
                expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', `:description1:`);
            });

            it('should add aria-describedby on anchor wrapper on open', async () => {
                const { anchorWrapper } = await setup({
                    label: 'Tooltip label',
                    forceOpen: false,
                    children: 'Anchor',
                });
                expect(anchorWrapper).not.toHaveAttribute('aria-describedby');

                await userEvent.hover(anchorWrapper as any);
                const tooltip = screen.queryByRole('tooltip');
                expect(anchorWrapper).toHaveAttribute('aria-describedby', tooltip?.id);
            });

            it('should always add aria-describedby on anchor wrapper with closeMode="hide"', async () => {
                const { tooltip, anchorWrapper } = await setup({
                    label: 'Tooltip label',
                    forceOpen: false,
                    children: 'Anchor',
                    closeMode: 'hide',
                });
                expect(anchorWrapper).toHaveAttribute('aria-describedby', `${tooltip?.id}`);
            });
        });

        describe('ariaLinkMode="aria-labelledby"', () => {
            it('should add aria-labelledby on anchor on open', async () => {
                await setup({
                    label: 'Tooltip label',
                    forceOpen: false,
                    children: <Button aria-labelledby=":label1:">Anchor</Button>,
                    ariaLinkMode: 'aria-labelledby',
                });
                const anchor = screen.getByRole('button', { name: 'Anchor' });
                expect(anchor).toHaveAttribute('aria-labelledby', ':label1:');

                await userEvent.hover(anchor);
                const tooltip = screen.queryByRole('tooltip');
                expect(anchor).toHaveAttribute('aria-labelledby', `:label1: ${tooltip?.id}`);
            });

            it('should always add aria-labelledby on anchor with closeMode="hide"', async () => {
                const label = 'Tooltip label';
                const { tooltip } = await setup({
                    label,
                    forceOpen: false,
                    children: <Button aria-labelledby=":label1:">Anchor</Button>,
                    ariaLinkMode: 'aria-labelledby',
                    closeMode: 'hide',
                });
                const anchor = screen.queryByRole('button', { name: label });
                expect(anchor).toBeInTheDocument();
                expect(anchor).toHaveAttribute('aria-labelledby', `:label1: ${tooltip?.id}`);
            });

            it('should skip aria-labelledby if anchor has label', async () => {
                const { tooltip } = await setup({
                    label: 'Tooltip label',
                    forceOpen: true,
                    children: (
                        <Button aria-labelledby=":label1:" aria-label="Tooltip label">
                            Anchor
                        </Button>
                    ),
                    ariaLinkMode: 'aria-labelledby',
                });
                expect(tooltip).toBeInTheDocument();
                expect(screen.getByRole('button')).toHaveAttribute('aria-labelledby', `:label1:`);
            });

            it('should add aria-labelledby on anchor wrapper on open', async () => {
                const { anchorWrapper } = await setup({
                    label: 'Tooltip label',
                    forceOpen: false,
                    children: 'Anchor',
                    ariaLinkMode: 'aria-labelledby',
                });
                expect(anchorWrapper).not.toHaveAttribute('aria-labelledby');

                await userEvent.hover(anchorWrapper as any);
                const tooltip = screen.queryByRole('tooltip');
                expect(anchorWrapper).toHaveAttribute('aria-labelledby', tooltip?.id);
            });

            it('should always add aria-labelledby on anchor wrapper with closeMode="hide"', async () => {
                const { tooltip, anchorWrapper } = await setup({
                    label: 'Tooltip label',
                    forceOpen: false,
                    children: 'Anchor',
                    ariaLinkMode: 'aria-labelledby',
                    closeMode: 'hide',
                });
                expect(anchorWrapper).toHaveAttribute('aria-labelledby', `${tooltip?.id}`);
            });
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

            // Un-hover anchor button
            await userEvent.unhover(button);

            expect(button).not.toHaveFocus();
            // Tooltip closed
            expect(tooltip).not.toBeInTheDocument();
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
            await userEvent.unhover(tooltip);
            expect(button).not.toHaveFocus();
            // Tooltip closed
            expect(tooltip).not.toBeInTheDocument();
        });

        it('should activate on anchor focus visible and close on escape', async () => {
            (isFocusVisible as jest.Mock).mockReturnValue(true);
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

        it('should not activate on anchor focus if not visible', async () => {
            (isFocusVisible as jest.Mock).mockReturnValue(false);
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

            // Tooltip not opening
            tooltip = screen.queryByRole('tooltip', { name: 'Tooltip label' });
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
