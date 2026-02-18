import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseRadioButtonTests, { setup } from '@lumx/core/js/components/RadioButton/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { RadioButton, RadioButtonProps } from './RadioButton';

const CLASSNAME = RadioButton.className as string;

describe(`<${RadioButton.displayName}>`, () => {
    const renderRadioButton = (props: RadioButtonProps, options?: SetupRenderOptions) => {
        // Map core props to React props (inputId -> id)
        const { inputId, ...restProps } = props;
        return render(<RadioButton id={inputId} {...(restProps as any)} />, options);
    };

    BaseRadioButtonTests({ render: renderRadioButton, screen });

    const setupRadioButton = (props: Partial<RadioButtonProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderRadioButton, screen });

    describe('React', () => {
        it('should forward ref to the root element', () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<RadioButton id="test" ref={ref} />);
            expect(ref.current).toHaveClass(CLASSNAME);
        });

        it('should forward inputRef to the native input', () => {
            const inputRef = React.createRef<HTMLInputElement>();
            render(<RadioButton id="test" inputRef={inputRef} />);
            expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
        });

        it('should be disabled with isDisabled', async () => {
            const onChange = vi.fn();
            const { container } = render(<RadioButton id="test" isDisabled onChange={onChange} />);
            const radioButton = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(radioButton).toHaveClass('lumx-radio-button--is-disabled');
            expect(input).toBeDisabled();

            // Should not trigger onChange.
            if (input) await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should trigger `onChange` with correct signature when radio is clicked', async () => {
            const value = 'radio-value';
            const name = 'radio-name';
            const onChange = vi.fn();
            render(<RadioButton id="test" value={value} name={name} onChange={onChange} />);
            const input = screen.getByRole('radio');
            expect(input).not.toBeChecked();

            await input.click();

            expect(onChange).toHaveBeenCalledWith(value, name, expect.any(Object));
        });

        it('should be disabled with aria-disabled', async () => {
            const onChange = vi.fn();
            const { container } = render(<RadioButton id="test" aria-disabled onChange={onChange} />);
            const radioButton = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(radioButton).toHaveClass('lumx-radio-button--is-disabled');
            // Note: input is not disabled (so it can be focused) but it's readOnly.
            expect(input).not.toBeDisabled();
            expect(input).toHaveAttribute('aria-disabled', 'true');
            expect(input).toHaveAttribute('readOnly');

            // Should not trigger onChange.
            if (input) await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    commonTestsSuiteRTL(setupRadioButton, {
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
