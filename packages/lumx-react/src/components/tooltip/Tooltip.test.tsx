import React from 'react';

import { Button } from '@lumx/react';
import { act, screen, render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { classNames } from '@lumx/core/js/utils';
import BaseTooltipTests from '@lumx/core/js/components/Tooltip/Tests';

import { Tooltip, TooltipProps } from './Tooltip';

const CLASSNAME = Tooltip.className as string;

vi.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));
// Skip delays
vi.mock('@lumx/react/constants', async (importActual: any) => {
    const actual = (await importActual()) as Record<string, any>;
    return {
        ...actual,
        TOOLTIP_HOVER_DELAY: { open: 0, close: 0 },
    };
});

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = async (propsOverride: Partial<TooltipProps> = {}) => {
    const props: any = { forceOpen: true, label: 'Tooltip label', children: 'Anchor', ...propsOverride };
    let result: ReturnType<typeof render>;
    // Wrap in act to flush async useFloating position updates.
    await act(async () => {
        result = render(<Tooltip {...props} />);
    });
    const tooltip = screen.queryByRole('tooltip');
    const anchorWrapper = queryByClassName(document.body, 'lumx-tooltip-anchor-wrapper');
    return { props, tooltip, anchorWrapper, result: result! };
};

describe(`<${Tooltip.displayName}>`, () => {
    // Run core tests (shared between React and Vue)
    BaseTooltipTests({
        render: ({ children, ...props }: any) =>
            render(
                <Tooltip {...props}>
                    <span>{children || 'Anchor'}</span>
                </Tooltip>,
            ),
        screen,
    });

    describe('render', () => {
        it('should wrap unknown children', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: 'Tooltip label',
                children: 'Anchor',
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            expect(anchorWrapper).toBeInTheDocument();
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
                expect(tooltip).toHaveClass(classNames.visuallyHidden());
                // Floating styles should not be applied when closed.
                expect(tooltip?.style?.transform).toBe('');

                const anchor = screen.getByRole('button', { name: 'Anchor' });
                await userEvent.hover(anchor);
                expect(tooltip).not.toHaveClass(classNames.visuallyHidden());
            });
        });

        describe('ariaLinkMode="aria-describedby"', () => {
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

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tooltip',
        forwardAttributes: 'tooltip',
        forwardRef: 'tooltip',
    });
});
