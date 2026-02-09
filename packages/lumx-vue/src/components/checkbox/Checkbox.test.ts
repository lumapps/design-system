import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import BaseCheckboxTests, { setup } from '@lumx/core/js/components/Checkbox/Tests';
import { CLASSNAME, CheckboxProps } from '@lumx/core/js/components/Checkbox';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Checkbox } from '.';

describe('<Checkbox />', () => {
    const renderCheckbox = (props: CheckboxProps, options?: SetupRenderOptions<CheckboxProps>) =>
        render(Checkbox, {
            props: { ...props, id: props.inputId },
            ...options,
        });

    BaseCheckboxTests({ render: renderCheckbox, screen });

    const setupCheckbox = (props: Partial<CheckboxProps> = {}, options: SetupRenderOptions<CheckboxProps> = {}) =>
        setup(props, { ...options, render: renderCheckbox, screen });

    describe('Vue-specific', () => {
        it('should emit change event when checkbox is clicked', async () => {
            const { getByRole, emitted } = render(Checkbox, {
                props: { id: 'test', label: 'Test label' },
            });
            const input = getByRole('checkbox');

            await userEvent.click(input);

            const changeEvents = emitted('change');
            expect(changeEvents).toHaveLength(1);
            expect((changeEvents as any)?.[0][0]).toBe(true); // isChecked
        });

        it('should be disabled with isDisabled', async () => {
            const { container, emitted } = render(Checkbox, {
                props: { id: 'test', isDisabled: true },
            });
            const checkbox = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
            expect(input).toHaveAttribute('disabled');

            // Should not trigger change event
            if (input) await userEvent.click(input);
            expect(emitted('change')).toBeUndefined();
        });

        it('should be disabled with aria-disabled', async () => {
            const { container, emitted } = render(Checkbox, {
                props: { id: 'test', 'aria-disabled': true },
            });
            const checkbox = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
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
    commonTestsSuiteVTL(setupCheckbox, {
        baseClassName: CLASSNAME,
        forwardClassName: 'checkbox',
        forwardAttributes: 'checkbox',
        applyTheme: {
            affects: [{ element: 'checkbox' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
