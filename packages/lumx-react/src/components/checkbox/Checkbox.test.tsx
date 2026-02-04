import React from 'react';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tests, { setup } from '@lumx/core/js/components/Checkbox/Tests';
import { BaseCheckboxProps } from '@lumx/core/js/components/Checkbox';

import { Checkbox, CheckboxProps } from './Checkbox';

const CLASSNAME = Checkbox.className as string;

describe(`<${Checkbox.displayName}>`, () => {
    const renderComponent = (props: CheckboxProps, options?: SetupRenderOptions) =>
        render(<Checkbox {...props} />, options);

    Tests({ render: renderComponent, screen });

    const setupComponent = (props: Partial<BaseCheckboxProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderComponent, screen });

    describe('Props', () => {
        it('should forward ref to the root element', () => {
            const ref = React.createRef<HTMLDivElement>();
            setupComponent({ ref } as any);
            expect(ref.current).toHaveClass(CLASSNAME);
        });

        it('should forward inputRef to the native input', () => {
            const inputRef = React.createRef<HTMLInputElement>();
            setupComponent({ inputRef });
            expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
        });
    });

    describe('Events', () => {
        it('should trigger `onChange` when checkbox is clicked', async () => {
            const onChange = vi.fn();
            const value = 'value';
            const name = 'name';
            const { input } = setupComponent({ checked: false, onChange, value, name });
            expect(input).not.toBeChecked();

            await userEvent.click(input);

            expect(onChange).toHaveBeenCalledWith(true, value, name, expect.any(Object));
        });
    });

    describe('Disabled state', () => {
        it('should be disabled with isDisabled', async () => {
            const onChange = vi.fn();
            const { checkbox, input } = setupComponent({ isDisabled: true, onChange });

            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
            expect(input).toBeDisabled();

            // Should not trigger onChange.
            await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should be disabled with aria-disabled', async () => {
            const onChange = vi.fn();
            const { checkbox, input } = setupComponent({ 'aria-disabled': true, onChange });

            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
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
    commonTestsSuiteRTL(setupComponent, {
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
