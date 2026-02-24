import { h } from 'vue';
import { render, screen, cleanup } from '@testing-library/vue';
import BaseTooltipTests, { setup } from '@lumx/core/js/components/Tooltip/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Tooltip';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';
import { queryByClassName } from '@lumx/core/testing/queries';

import { Tooltip } from '.';
import { Button } from '../button';

// Clean up teleported tooltip elements between tests
afterEach(() => {
    cleanup();
    // Remove any tooltips teleported to body
    document.querySelectorAll('[role="tooltip"]').forEach((el) => el.remove());
    // Remove any anchor wrappers left in body
    document.querySelectorAll('.lumx-tooltip-anchor-wrapper').forEach((el) => el.remove());
});

describe('<Tooltip />', () => {
    const renderTooltip = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(Tooltip, {
            ...options,
            props,
            slots: {
                default: children ? () => children : () => h('span', 'Anchor'),
            },
        });

    // Run core tests (shared between React and Vue)
    BaseTooltipTests({
        render: renderTooltip,
        screen,
    });

    describe('Vue-specific tests', () => {
        it('should inject ref into slot root element', () => {
            render(Tooltip, {
                props: { label: 'Tooltip label', forceOpen: true },
                slots: { default: () => h(Button, () => 'Anchor') },
            });

            const tooltip = screen.queryByRole('tooltip');
            expect(tooltip).toBeInTheDocument();

            const button = screen.queryByRole('button', { name: 'Anchor' });
            expect(button).toBeInTheDocument();

            // Button should have aria-describedby linking to tooltip
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);
        });

        it('should wrap text slot in anchor div', () => {
            render(Tooltip, {
                props: { label: 'Tooltip label', forceOpen: true },
                slots: { default: () => 'text content' },
            });

            const tooltip = screen.queryByRole('tooltip');
            expect(tooltip).toBeInTheDocument();

            const anchorWrapper = document.querySelector('.lumx-tooltip-anchor-wrapper');
            expect(anchorWrapper).toBeInTheDocument();
        });

        it('should wrap disabled button in anchor div', () => {
            render(Tooltip, {
                props: { label: 'Tooltip label', forceOpen: true },
                slots: { default: () => h(Button, { isDisabled: true }, () => 'Anchor') },
            });

            const tooltip = screen.queryByRole('tooltip');
            expect(tooltip).toBeInTheDocument();

            const anchorWrapper = document.querySelector('.lumx-tooltip-anchor-wrapper');
            expect(anchorWrapper).toBeInTheDocument();
            expect(anchorWrapper).toHaveAttribute('aria-describedby', tooltip?.id);
        });

        it('should not render with empty label', () => {
            render(Tooltip, {
                props: { label: undefined, forceOpen: true },
                slots: { default: () => h(Button, () => 'Anchor') },
            });

            const tooltip = screen.queryByRole('tooltip');
            expect(tooltip).not.toBeInTheDocument();
        });

        describe('closeMode="hide"', () => {
            it('should not render with empty label', () => {
                render(Tooltip, {
                    props: { label: undefined, forceOpen: true, closeMode: 'hide' },
                    slots: { default: () => h(Button, () => 'Anchor') },
                });

                const tooltip = screen.queryByRole('tooltip');
                expect(tooltip).not.toBeInTheDocument();
            });

            it('should render hidden when not activated', () => {
                render(Tooltip, {
                    props: { label: 'Tooltip label', forceOpen: false, closeMode: 'hide' },
                    slots: { default: () => h(Button, () => 'Anchor') },
                });

                const tooltip = screen.queryByRole('tooltip');
                expect(tooltip).toBeInTheDocument();
                // Should be visually hidden when not open
                expect(tooltip).toHaveClass('visually-hidden');
            });
        });

        describe('ariaLinkMode="aria-labelledby"', () => {
            it('should use aria-labelledby', () => {
                render(Tooltip, {
                    props: { label: 'Tooltip label', forceOpen: true, ariaLinkMode: 'aria-labelledby' },
                    slots: { default: () => h(Button, () => 'Anchor') },
                });

                const tooltip = screen.queryByRole('tooltip');
                expect(tooltip).toBeInTheDocument();

                // When aria-labelledby is set, the button's accessible name changes,
                // so we query by role only
                const button = screen.queryByRole('button');
                expect(button).toBeInTheDocument();
                expect(button).toHaveAttribute('aria-labelledby', tooltip?.id);
            });
        });
    });

    const setupTooltip = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        const result = setup(props, { ...options, render: renderTooltip, screen });
        const tooltip = queryByClassName(document.body, CLASSNAME);
        return { ...result, tooltip, div: tooltip };
    };

    // Common tests suite
    commonTestsSuiteVTL(setupTooltip, {
        baseClassName: CLASSNAME,
        forwardClassName: 'div',
    });
});
