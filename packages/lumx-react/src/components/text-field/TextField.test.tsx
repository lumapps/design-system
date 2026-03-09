/** eslint-disable prettier/prettier */
import { Mock } from 'vitest';

import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';

import { isFocusVisible } from '@lumx/core/js/utils/browser/isFocusVisible';
import { createRef } from 'react';
import BaseTextFieldTests from '@lumx/core/js/components/TextField/Tests';
import { TextField, TextFieldProps } from './TextField';

const CLASSNAME = TextField.className as string;

vi.mock('@lumx/core/js/utils/browser/isFocusVisible');

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<TextFieldProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    const { container } = render(<TextField {...props} />, { wrapper });

    const element = getByClassName(container, CLASSNAME);
    const clearButton = queryByClassName(container, 'lumx-text-field__input-clear');
    const inputNative = (document.querySelector('textarea') || document.querySelector('input')) as
        | HTMLTextAreaElement
        | HTMLInputElement;

    return {
        props,
        clearButton,
        container,
        element,
        inputNative,
    };
};

describe(`<${TextField.displayName}>`, () => {
    (isFocusVisible as Mock).mockReturnValue(false);

    // Run core tests
    BaseTextFieldTests({
        render: (props: TextFieldProps) => render(<TextField {...props} />),
        screen,
    });

    // React-specific tests
    describe('React', () => {
        describe('Clear button', () => {
            it('should not render clear button when clearButtonProps is not provided', () => {
                // Regression: the React wrapper used to always pass clearButtonProps (with onClick spread)
                // even when undefined, causing the clear button to always appear.
                const { clearButton } = setup({ value: 'some value', onChange: vi.fn() });
                expect(clearButton).not.toBeInTheDocument();
            });

            it('should render clear button when clearButtonProps is provided', () => {
                const { clearButton } = setup({
                    value: 'some value',
                    clearButtonProps: { label: 'Clear' },
                    onChange: vi.fn(),
                });
                expect(clearButton).toBeInTheDocument();
            });
        });

        it('should forward inputRef to input element', () => {
            const inputRef = createRef<HTMLInputElement>();
            render(<TextField id="fixedId" inputRef={inputRef} onChange={() => {}} />);
            const inputNative = document.querySelector('input');
            expect(inputRef.current).toBe(inputNative);
        });

        it('should forward inputRef to textarea element', () => {
            const inputRef = createRef<HTMLTextAreaElement>();
            render(<TextField id="fixedId" multiline inputRef={inputRef} onChange={() => {}} />);
            const inputNative = document.querySelector('textarea');
            expect(inputRef.current).toBe(inputNative);
        });

        it('should render chips', () => {
            const { container } = setup({ chips: <span data-testid="chip">Chip</span> });
            expect(screen.getByTestId('chip')).toBeInTheDocument();
            expect(container.querySelector(`.${CLASSNAME}__chips`)).toBeInTheDocument();
        });

        it('should render afterElement', () => {
            const { container } = setup({ afterElement: <span data-testid="after">After</span> });
            expect(screen.getByTestId('after')).toBeInTheDocument();
            expect(container.querySelector(`.${CLASSNAME}__after-element`)).toBeInTheDocument();
        });
    });

    describe('Events', () => {
        it('should trigger `onChange` when text field is changed', async () => {
            const onChange = vi.fn();
            render(<TextField value="" name="name" onChange={onChange} />);
            const inputNative = document.querySelector('input') as HTMLInputElement;

            await userEvent.tab();
            expect(inputNative).toHaveFocus();

            await userEvent.keyboard('a');

            expect(onChange).toHaveBeenCalledWith('a', 'name', expect.objectContaining({}));
        });

        it('should trigger `onChange` with empty value when text field is cleared', async () => {
            const onChange = vi.fn();
            const { clearButton } = setup({
                value: 'initial value',
                name: 'name',
                clearButtonProps: { label: 'Clear' },
                onChange,
            });

            expect(clearButton).toBeInTheDocument();

            await userEvent.click(clearButton as HTMLElement);

            expect(onChange).toHaveBeenCalledWith('');
        });

        it('should trigger `onChange` with empty value and `onClear` when text field is cleared', async () => {
            const onChange = vi.fn();
            const onClear = vi.fn();
            const { clearButton } = setup({
                value: 'initial value',
                name: 'name',
                clearButtonProps: { label: 'Clear' },
                onChange,
                onClear,
            });

            expect(clearButton).toBeInTheDocument();

            await userEvent.click(clearButton as HTMLElement);

            expect(onChange).toHaveBeenCalledWith('');
            expect(onClear).toHaveBeenCalled();
        });
    });

    describe('Disabled state', () => {
        it('should not render clear button when disabled', () => {
            const { clearButton } = setup({
                value: 'initial value',
                clearButtonProps: { label: 'Clear' },
                isDisabled: true,
            });
            expect(clearButton).not.toBeInTheDocument();
        });

        it('should not render clear button when aria-disabled', () => {
            const { clearButton } = setup({
                value: 'initial value',
                clearButtonProps: { label: 'Clear' },
                'aria-disabled': true,
            });
            expect(clearButton).not.toBeInTheDocument();
        });

        it('should not allow typing when disabled', async () => {
            const onChange = vi.fn();
            render(<TextField label="Label" isDisabled value="test" onChange={onChange} />);
            const inputNative = document.querySelector('input') as HTMLInputElement;

            expect(inputNative).toBeDisabled();

            await userEvent.type(inputNative, 'new value');
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should not allow typing when aria-disabled', async () => {
            const onChange = vi.fn();
            render(<TextField label="Label" aria-disabled value="test" onChange={onChange} />);
            const inputNative = document.querySelector('input') as HTMLInputElement;

            expect(inputNative).not.toBeDisabled();
            expect(inputNative).toHaveAttribute('aria-disabled', 'true');
            expect(inputNative).toHaveAttribute('readonly');

            await userEvent.type(inputNative, 'new value');
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'inputNative',
        forwardRef: 'element',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
