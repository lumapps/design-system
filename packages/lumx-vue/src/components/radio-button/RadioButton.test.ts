import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import BaseRadioButtonTests, { setup } from '@lumx/core/js/components/RadioButton/Tests';
import { CLASSNAME, RadioButtonProps } from '@lumx/core/js/components/RadioButton';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { RadioButton } from '.';

describe('<RadioButton />', () => {
    const renderRadioButton = (props: RadioButtonProps, options?: SetupRenderOptions<RadioButtonProps>) =>
        render(RadioButton, {
            props: { ...props, id: props.inputId },
            ...options,
        });

    BaseRadioButtonTests({ render: renderRadioButton, screen });

    const setupRadioButton = (
        props: Partial<RadioButtonProps> = {},
        options: SetupRenderOptions<RadioButtonProps> = {},
    ) => setup(props, { ...options, render: renderRadioButton, screen });

    describe('Vue-specific', () => {
        it('should emit change event when radio is clicked', async () => {
            const { getByRole, emitted } = render(RadioButton, {
                props: { id: 'test', label: 'Test label', value: 'test-value', name: 'test-name' },
            });
            const input = getByRole('radio');

            await userEvent.click(input);

            const changeEvents = emitted('change');
            expect(changeEvents).toHaveLength(1);
            expect((changeEvents as any)?.[0][0]).toBe('test-value'); // value
            expect((changeEvents as any)?.[0][1]).toBe('test-name'); // name
        });

        it('should be disabled with isDisabled', async () => {
            const { container, emitted } = render(RadioButton, {
                props: { id: 'test', isDisabled: true },
            });
            const radioButton = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(radioButton).toHaveClass('lumx-radio-button--is-disabled');
            expect(input).toHaveAttribute('disabled');

            // Should not trigger change event
            if (input) await userEvent.click(input);
            expect(emitted('change')).toBeUndefined();
        });

        it('should be disabled with aria-disabled', async () => {
            const { container, emitted } = render(RadioButton, {
                props: { id: 'test', 'aria-disabled': true },
            });
            const radioButton = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(radioButton).toHaveClass('lumx-radio-button--is-disabled');
            // Note: input is not disabled (so it can be focused) but it's readOnly.
            expect(input).not.toHaveAttribute('disabled');
            expect(input).toHaveAttribute('aria-disabled', 'true');
            expect(input).toHaveAttribute('readOnly');

            // Should not trigger change event
            if (input) await userEvent.click(input);
            expect(emitted('change')).toBeUndefined();
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setupRadioButton, {
        baseClassName: CLASSNAME,
        forwardClassName: 'radioButton',
        forwardAttributes: 'radioButton',
        applyTheme: {
            affects: [{ element: 'radioButton' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
