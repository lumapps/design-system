import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseCheckboxTests, { setup } from '@lumx/core/js/components/Checkbox/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { Checkbox, CheckboxProps } from './Checkbox';

const CLASSNAME = Checkbox.className as string;

describe(`<${Checkbox.displayName}>`, () => {
    const renderCheckbox = (props: CheckboxProps, options?: SetupRenderOptions) => {
        // Map core props to React props (inputId -> id)
        const { inputId, ...restProps } = props;
        return render(<Checkbox id={inputId} {...(restProps as any)} />, options);
    };

    BaseCheckboxTests({ render: renderCheckbox, screen });

    const setupCheckbox = (props: Partial<CheckboxProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderCheckbox, screen });

    describe('React', () => {
        it('should forward ref to the root element', () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<Checkbox id="test" ref={ref} />);
            expect(ref.current).toHaveClass(CLASSNAME);
        });

        it('should forward inputRef to the native input', () => {
            const inputRef = React.createRef<HTMLInputElement>();
            render(<Checkbox id="test" inputRef={inputRef} />);
            expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
        });

        it('should trigger `onChange` when checkbox is clicked', async () => {
            const onChange = vi.fn();

            const value = 'value';
            const name = 'name';
            render(<Checkbox id="test" checked={false} value={value} name={name} onChange={onChange} />);
            const input = screen.getByRole('checkbox');
            expect(input).not.toBeChecked();

            await input.click();

            expect(onChange).toHaveBeenCalledWith(true, value, name, expect.any(Object));
        });

        it('should be disabled with isDisabled', async () => {
            const onChange = vi.fn();
            const { container } = render(<Checkbox id="test" isDisabled onChange={onChange} />);
            const checkbox = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
            expect(input).toBeDisabled();

            // Should not trigger onChange.
            if (input) await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should be disabled with aria-disabled', async () => {
            const onChange = vi.fn();
            const { container } = render(<Checkbox id="test" aria-disabled onChange={onChange} />);
            const checkbox = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
            // Note: input is not disabled (so it can be focused) but it's readOnly.
            expect(input).not.toBeDisabled();
            expect(input).toHaveAttribute('aria-disabled', 'true');
            expect(input).toHaveAttribute('readOnly');

            // Should not trigger onChange.
            if (input) await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    commonTestsSuiteRTL(setupCheckbox, {
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
