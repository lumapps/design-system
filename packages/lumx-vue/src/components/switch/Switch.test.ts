import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import BaseSwitchTests, { setup } from '@lumx/core/js/components/Switch/Tests';
import { CLASSNAME, SwitchProps } from '@lumx/core/js/components/Switch';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Switch } from '.';

describe('<Switch />', () => {
    const renderSwitch = (props: SwitchProps, options?: SetupRenderOptions<SwitchProps>) =>
        render(Switch, {
            props: { ...props, id: props.inputId },
            ...options,
        });

    BaseSwitchTests({ render: renderSwitch, screen });

    const setupSwitch = (props: Partial<SwitchProps> = {}, options: SetupRenderOptions<SwitchProps> = {}) =>
        setup(props, { ...options, render: renderSwitch, screen });

    describe('Vue-specific', () => {
        it('should emit change event when switch is clicked', async () => {
            const { getByRole, emitted } = render(Switch, {
                props: { id: 'test', label: 'Test label' },
            });
            const input = getByRole('switch');

            await userEvent.click(input);

            const changeEvents = emitted('change');
            expect(changeEvents).toHaveLength(1);
            expect((changeEvents as any)?.[0][0]).toBe(true); // isChecked
        });

        it('should be disabled with isDisabled', async () => {
            const { container, emitted } = render(Switch, {
                props: { id: 'test', isDisabled: true },
            });
            const switchWrapper = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(switchWrapper).toHaveClass('lumx-switch--is-disabled');
            expect(input).toHaveAttribute('disabled');

            // Should not trigger change event
            if (input) await userEvent.click(input);
            expect(emitted('change')).toBeUndefined();
        });

        it('should be disabled with aria-disabled', async () => {
            const { container, emitted } = render(Switch, {
                props: { id: 'test', 'aria-disabled': true },
            });
            const switchWrapper = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(switchWrapper).toHaveClass('lumx-switch--is-disabled');
            // Note: input is not disabled (so it can be focused) but it's readOnly.
            expect(input).not.toHaveAttribute('disabled');
            expect(input).toHaveAttribute('aria-disabled', 'true');
            expect(input).toHaveAttribute('readOnly');

            // Should not trigger change event
            if (input) await userEvent.click(input);
            expect(emitted('change')).toBeUndefined();
        });

        it('should update v-model:is-checked when clicked', async () => {
            render({
                template:
                    '<div><Switch v-model:is-checked="checked" id="test" label="Test label" /><span data-testid="out">{{ checked }}</span></div>',
                components: { Switch },
                data() {
                    return { checked: false };
                },
            });
            await userEvent.click(screen.getByRole('switch'));

            expect(screen.getByTestId('out')).toHaveTextContent('true');
        });

        it('should leave v-model:is-checked unchanged when the switch is disabled', async () => {
            render({
                template:
                    '<div><Switch v-model:is-checked="checked" id="test" label="Test label" :is-disabled="true" /><span data-testid="out">{{ checked }}</span></div>',
                components: { Switch },
                data() {
                    return { checked: false };
                },
            });
            await userEvent.click(screen.getByRole('switch'));

            expect(screen.getByTestId('out')).toHaveTextContent('false');
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setupSwitch, {
        baseClassName: CLASSNAME,
        forwardClassName: 'switchWrapper',
        forwardAttributes: 'switchWrapper',
        applyTheme: {
            affects: [{ element: 'switchWrapper' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
