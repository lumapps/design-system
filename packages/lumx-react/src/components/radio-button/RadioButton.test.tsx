import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName, getByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RadioButton, RadioButtonProps } from '.';

const CLASSNAME = RadioButton.className as string;

type SetupProps = Partial<RadioButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { id: 'fixedId', ...propsOverride };
    render(<RadioButton {...props} />, { wrapper });

    const radioButton = getByClassName(document.body, CLASSNAME);
    const helper = queryByClassName(radioButton, `${CLASSNAME}__helper`);
    const label = queryByClassName(radioButton, `${CLASSNAME}__label`);
    const input = getByTagName(radioButton, 'input');
    return { radioButton, helper, label, input, props };
};

describe(`<${RadioButton.displayName}>`, () => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { radioButton, input, label, helper } = setup();
            expect(radioButton).toBeInTheDocument();
            expect(radioButton).toHaveClass(CLASSNAME);
            expect(radioButton).not.toHaveClass('lumx-radio-button--is-disabled');
            expect(radioButton).toHaveClass('lumx-radio-button--is-unchecked');

            expect(label).not.toBeInTheDocument();
            expect(helper).not.toBeInTheDocument();

            expect(input).toBeInTheDocument();
            expect(input).not.toBeChecked();
            expect(input).not.toBeDisabled();
        });

        it('should render disabled and checked', () => {
            const { radioButton, input } = setup({
                isDisabled: true,
                isChecked: true,
            });
            expect(radioButton).toHaveClass('lumx-radio-button--is-disabled');
            expect(radioButton).toHaveClass('lumx-radio-button--is-checked');

            expect(input).toBeChecked();
            expect(input).toBeDisabled();
        });

        it('should render helper and label', () => {
            const id = 'radioButton1';
            const { props, helper, label, input } = setup({
                id,
                helper: 'Test helper',
                label: 'Test label',
            });

            expect(helper).toBeInTheDocument();
            expect(helper).toHaveTextContent(props.helper);
            expect(helper).toHaveAttribute('id');

            expect(label).toBeInTheDocument();
            expect(label).toHaveTextContent(props.label);
            expect(label).toHaveAttribute('for', id);

            expect(input).toHaveAttribute('id', id);
            expect(input).toHaveAttribute('aria-describedby', helper?.id);
        });

        it('should forward input props', () => {
            const { props, input } = setup({
                inputProps: {
                    'aria-labelledby': 'labelledby-id',
                },
            });

            expect(input).toHaveAttribute('aria-labelledby', props.inputProps['aria-labelledby']);
        });
    });

    describe('Events', () => {
        const onChange = jest.fn();

        it('should trigger `onChange` when radioButton is clicked', async () => {
            const value = 'value';
            const name = 'name';
            const { input } = setup({ checked: false, onChange, value, name });
            expect(input).not.toBeChecked();

            await userEvent.click(input);

            expect(onChange).toHaveBeenCalledWith(value, name, expect.any(Object));
        });
    });

    describe('Disabled state', () => {
        it('should be disabled with isDisabled', async () => {
            const onChange = jest.fn();
            const { radioButton, input } = setup({ isDisabled: true, onChange });

            expect(radioButton).toHaveClass('lumx-radio-button--is-disabled');
            expect(input).toBeDisabled();
            expect(input).toHaveAttribute('readOnly');

            // Should not trigger onChange.
            await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should be disabled with aria-disabled', async () => {
            const onChange = jest.fn();
            const { radioButton, input } = setup({ 'aria-disabled': true, onChange });

            expect(radioButton).toHaveClass('lumx-radio-button--is-disabled');
            // Note: input is not disabled (so it can be focused) but it's readOnly.
            expect(input).not.toBeDisabled();
            expect(input).toHaveAttribute('aria-disabled', 'true');
            expect(input).toHaveAttribute('readOnly');

            // Should not trigger onChange.
            await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
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
