import { defineComponent, h, nextTick, ref, shallowRef } from 'vue';
import { render, screen, cleanup } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import BaseTooltipTests, { setup } from '@lumx/core/js/components/Tooltip/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Tooltip';
import { commonTestsSuiteVTL, type SetupRenderOptions } from '@lumx/vue/testing';
import { queryByClassName } from '@lumx/core/testing/queries';

import { Tooltip } from '.';
import { Button } from '../button';
import { useCallbackOnEscape } from '../../composables/useCallbackOnEscape';

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

    describe('anchor detach', () => {
        it('should close and not come back with no hover when the label becomes empty then comes back', async () => {
            const result = render(Tooltip, {
                props: { label: 'Tooltip label' },
                slots: { default: () => h(Button, () => 'Anchor') },
            });

            await userEvent.hover(screen.getByRole('button', { name: 'Anchor' }));
            expect(screen.getByRole('tooltip')).toBeInTheDocument();

            await result.rerender({ label: '' });
            await result.rerender({ label: 'Tooltip label' });
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            await userEvent.hover(screen.getByRole('button', { name: 'Anchor' }));
            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        it('should keep the anchor element and its focus when the label becomes empty', async () => {
            const result = render(Tooltip, {
                props: { label: 'Tooltip label' },
                slots: { default: () => h(Button, () => 'Anchor') },
            });
            const button = screen.getByRole('button', { name: 'Anchor' });
            button.focus();

            await result.rerender({ label: '' });

            expect(screen.getByRole('button', { name: 'Anchor' })).toBe(button);
            expect(button).toHaveFocus();
        });
    });

    describe('function label', () => {
        it('should follow the reactive state that the function reads while open', async () => {
            const text = ref('Expand');
            render(Tooltip, {
                props: { label: () => text.value },
                slots: { default: () => h(Button, () => 'Anchor') },
            });
            await userEvent.hover(screen.getByRole('button', { name: 'Anchor' }));
            expect(await screen.findByRole('tooltip')).toHaveTextContent('Expand');

            text.value = 'Collapse';

            expect(await screen.findByRole('tooltip', { name: 'Collapse' })).toBeInTheDocument();
        });

        it('should not open, add no aria-describedby and not take Escape when the function result is empty', async () => {
            const outerCallback = vi.fn();
            const TestComponent = defineComponent(() => {
                useCallbackOnEscape(outerCallback);
                return () => h(Tooltip, { label: () => '' }, () => h(Button, () => 'Anchor'));
            });
            render(TestComponent);
            const anchor = screen.getByRole('button', { name: 'Anchor' });

            await userEvent.hover(anchor);
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
            expect(anchor).not.toHaveAttribute('aria-describedby');

            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            expect(outerCallback).toHaveBeenCalled();
        });

        it('should resolve a function label that reads the DOM when it mounts with forceOpen', async () => {
            const TestComponent = defineComponent(() => {
                const labelRef = shallowRef<HTMLElement | null>(null);
                return () =>
                    h(Tooltip, { label: () => labelRef.value?.textContent, forceOpen: true }, () =>
                        h('button', { type: 'button' }, [h('span', { ref: labelRef }, 'Label')]),
                    );
            });
            render(TestComponent);

            expect(await screen.findByRole('tooltip')).toHaveTextContent('Label');
        });

        it('should follow the function result while open, and close when it becomes empty', async () => {
            const result = render(Tooltip, {
                props: { label: () => 'Collapse' },
                slots: { default: () => h(Button, () => 'Anchor') },
            });
            await userEvent.tab();
            expect(await screen.findByRole('tooltip')).toHaveTextContent('Collapse');

            await result.rerender({ label: () => 'Expand' });
            expect(screen.getByRole('tooltip')).toHaveTextContent('Expand');

            await result.rerender({ label: () => '' });
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            await result.rerender({ label: () => 'Collapse' });
            expect(screen.getByRole('tooltip')).toHaveTextContent('Collapse');
        });
    });

    describe('escape', () => {
        it('should not take the global escape listener with forceOpen', async () => {
            const outerCallback = vi.fn();
            const TestComponent = defineComponent(() => {
                useCallbackOnEscape(outerCallback);
                return () => h(Tooltip, { label: 'Tooltip label', forceOpen: true }, () => h(Button, () => 'Anchor'));
            });
            render(TestComponent);
            expect(screen.getByRole('tooltip')).toBeInTheDocument();

            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

            expect(outerCallback).toHaveBeenCalled();
        });

        it('should keep a later escape listener on top when the label changes while open', async () => {
            const laterCallback = vi.fn();
            const label = ref('Expand');
            const showLater = ref(false);
            const Later = defineComponent(() => {
                useCallbackOnEscape(laterCallback);
                return () => null;
            });
            const TestComponent = defineComponent(() => () => [
                h(Tooltip, { label: label.value }, () => h(Button, () => 'Anchor')),
                showLater.value ? h(Later) : null,
            ]);
            render(TestComponent);
            await userEvent.hover(screen.getByRole('button', { name: 'Anchor' }));
            expect(await screen.findByRole('tooltip', { name: 'Expand' })).toBeInTheDocument();

            showLater.value = true;
            await nextTick();
            label.value = 'Collapse';
            expect(await screen.findByRole('tooltip', { name: 'Collapse' })).toBeInTheDocument();

            document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

            expect(laterCallback).toHaveBeenCalled();
            expect(screen.getByRole('tooltip', { name: 'Collapse' })).toBeInTheDocument();
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
