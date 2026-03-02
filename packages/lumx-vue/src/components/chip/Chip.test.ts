import { render, screen, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import BaseChipTests, { setup } from '@lumx/core/js/components/Chip/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Chip';
import { getByClassName, queryByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Chip } from '.';

describe('<Chip />', () => {
    const renderChip = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(Chip, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    // Run core tests
    BaseChipTests({
        render: renderChip,
        screen,
    });

    const setupChip = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        const result = setup(props, { ...options, render: renderChip, screen });
        // Create alias for commonTestsSuite compatibility
        const a = result.chip;
        return { ...result, a };
    };

    // Vue-specific tests
    describe('Vue', () => {
        const setupVue = (props: any = {}, slots: any = {}) => {
            const wrapper = render(Chip, { props, slots });
            const chip = getByClassName(document.body, CLASSNAME);
            const before = queryByClassName(chip, `${CLASSNAME}__before`);
            const after = queryByClassName(chip, `${CLASSNAME}__after`);
            return { wrapper, chip, before, after };
        };

        describe('Events', () => {
            it('should emit click event', async () => {
                const { wrapper, chip } = setupVue({ onClick: vi.fn() });
                await userEvent.click(chip);
                expect(wrapper.emitted('click')).toBeTruthy();
            });

            it('should emit beforeClick event', async () => {
                const { wrapper, before } = setupVue(
                    {
                        onBeforeClick: vi.fn(),
                    },
                    {
                        before: () => 'before',
                    },
                );
                await userEvent.click(before as any);
                expect(wrapper.emitted('beforeClick')).toBeTruthy();
            });

            it('should emit afterClick event', async () => {
                const { wrapper, after } = setupVue(
                    {
                        onAfterClick: vi.fn(),
                    },
                    {
                        after: () => 'after',
                    },
                );
                await userEvent.click(after as any);
                expect(wrapper.emitted('afterClick')).toBeTruthy();
            });

            it('should forward key down event', async () => {
                const onKeyDown = vi.fn();
                const { chip, wrapper } = setupVue({ onKeyDown });

                fireEvent.keyDown(chip, { key: 'A', code: 'KeyA' });
                expect(wrapper.emitted('keydown')).toBeTruthy();
            });

            it('should forward key down event and trigger `onClick` when pressing Enter', async () => {
                const user = userEvent.setup();
                const onKeyDown = vi.fn();
                const onClick = vi.fn();
                const { chip, wrapper } = setupVue({ onKeyDown, onClick });

                await user.tab();
                expect(chip).toHaveFocus();

                fireEvent.keyDown(chip, { key: 'Enter', code: 'KeyEnter' });
                expect(wrapper.emitted('keydown')).toBeTruthy();
                expect(wrapper.emitted('click')).toBeTruthy();
            });

            it('should not emit events when disabled', async () => {
                const { wrapper, chip } = setupVue({
                    isDisabled: true,
                    onClick: vi.fn(),
                });
                await userEvent.click(chip);
                expect(wrapper.emitted('click')).toBeFalsy();
            });
        });

        describe('Disabled state', () => {
            it('should render disabled chip button', async () => {
                const { chip, wrapper } = setupVue({
                    isDisabled: true,
                    onClick: vi.fn(),
                });
                expect(chip).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(chip);
                expect(wrapper.emitted('click')).toBeFalsy();
            });

            it('should render disabled chip link', async () => {
                const { chip, wrapper } = setupVue({
                    isDisabled: true,
                    href: 'https://example.com',
                    onClick: vi.fn(),
                });
                expect(chip).not.toHaveAttribute('href');
                expect(chip).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(chip);
                expect(wrapper.emitted('click')).toBeFalsy();
            });

            it('should render aria-disabled chip button', async () => {
                const { chip, wrapper } = setupVue({
                    'aria-disabled': true,
                    onClick: vi.fn(),
                });
                expect(chip).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(chip);
                expect(wrapper.emitted('click')).toBeFalsy();
            });

            it('should render aria-disabled chip link', async () => {
                const { chip, wrapper } = setupVue({
                    'aria-disabled': true,
                    href: 'https://example.com',
                    onClick: vi.fn(),
                });
                expect(chip).toHaveAttribute('href', 'https://example.com');
                expect(chip).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(chip);
                expect(wrapper.emitted('click')).toBeFalsy();
            });
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupChip, {
        baseClassName: CLASSNAME,
        forwardClassName: 'a',
        forwardAttributes: 'a',
        forwardRef: 'a',
        applyTheme: {
            affects: [{ element: 'a', classModifier: 'color', inverted: true }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
