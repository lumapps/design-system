import React from 'react';

import camelCase from 'lodash/camelCase';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils/className';
import { render } from '@testing-library/react';
import {
    getByClassName,
    getByTagName,
    queryAllByClassName,
    queryByClassName,
    queryByTagName,
} from '@lumx/react/testing/utils/queries';
import partition from 'lodash/partition';
import userEvent from '@testing-library/user-event';

import { isFocusVisible } from '@lumx/react/utils/isFocusVisible';
import { TextField, TextFieldProps } from './TextField';

const CLASSNAME = TextField.className as string;

jest.mock('@lumx/react/utils/isFocusVisible');

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<TextFieldProps> = {}) => {
    const props: any = { ...propsOverride };
    const { container } = render(<TextField {...props} />);

    const element = getByClassName(container, CLASSNAME);
    const inputNative = (queryByTagName(container, 'textarea') || getByTagName(container, 'input')) as
        | HTMLTextAreaElement
        | HTMLInputElement;
    const helpers = queryAllByClassName(container, 'lumx-text-field__helper');
    const [[helper], [error]] = partition(helpers, (h) => !h.className.includes('lumx-input-helper--color-red'));
    const clearButton = queryByClassName(container, 'lumx-text-field__input-clear');

    return {
        props,
        clearButton,
        container,
        element,
        inputNative,
        error,
        helper,
    };
};

describe(`<${TextField.displayName}>`, () => {
    (isFocusVisible as jest.Mock).mockReturnValue(false);

    describe('Render', () => {
        it('should render defaults', () => {
            const { element, inputNative } = setup({ id: 'fixedId' });
            expect(element).toBeInTheDocument();

            expect(element).not.toHaveClass(`${CLASSNAME}--is-valid`);
            expect(element).not.toHaveClass(`${CLASSNAME}--has-error`);
            expect(element).not.toHaveClass(`${CLASSNAME}--has-label`);
            expect(element).not.toHaveClass(`${CLASSNAME}--is-disabled`);
            expect(element).not.toHaveClass(`${CLASSNAME}--has-placeholder`);
            expect(element).not.toHaveClass(`${CLASSNAME}--is-focus`);
            expect(element).not.toHaveClass(`${CLASSNAME}--has-icon`);

            expect(element).toHaveClass(`${CLASSNAME}--theme-light`);
            expect(inputNative.tagName).toBe('INPUT');
        });

        it('should render textarea', () => {
            const { element, inputNative } = setup({ id: 'fixedId', multiline: true });
            expect(element).toBeInTheDocument();

            expect(inputNative.tagName).toBe('TEXTAREA');
        });
    });

    describe('Props', () => {
        it('should add all class names (except has-error)', () => {
            const modifiedProps = {
                icon: 'icon',
                isDisabled: true,
                isValid: true,
                label: 'test',
                placeholder: 'test',
            };
            const hasProps = ['icon', 'label', 'placeholder'];
            const { element } = setup(modifiedProps);

            for (const [prop, value] of Object.entries(modifiedProps)) {
                const propType = hasProps.includes(prop) ? camelCase(`has-${prop}`) : prop;
                const propValue = hasProps.includes(prop) ? true : value;
                expect(element).toHaveClass(getBasicClass({ prefix: CLASSNAME, type: propType, value: propValue }));
            }
        });

        it('should add "has-error" class name', () => {
            const modifiedProps = { hasError: true };
            const { element } = setup(modifiedProps);

            for (const [prop, value] of Object.entries(modifiedProps)) {
                expect(element).toHaveClass(getBasicClass({ prefix: CLASSNAME, type: prop, value }));
            }
        });

        it('should have text as value', () => {
            const value = 'test';
            const { inputNative } = setup({ value });
            expect(inputNative.value).toEqual(value);
        });

        it('should have no value', () => {
            const value = undefined;
            const { inputNative } = setup({ value });
            expect(inputNative.value).toEqual('');
        });

        it('should have helper text', () => {
            const { helper, inputNative } = setup({
                helper: 'helper',
                label: 'test',
                placeholder: 'test',
            });

            expect(helper).toHaveTextContent('helper');
            expect(inputNative).toHaveAttribute('aria-describedby');
        });

        it('should have error text', () => {
            const { error, inputNative } = setup({
                error: 'error',
                hasError: true,
                label: 'test',
                placeholder: 'test',
            });

            expect(error).toHaveTextContent('error');
            expect(inputNative).toHaveAttribute('aria-invalid', 'true');
            expect(inputNative).toHaveAttribute('aria-describedby');
        });

        it('should not have error text', () => {
            const { error } = setup({
                error: 'error',
                hasError: false,
                label: 'test',
                placeholder: 'test',
            });
            expect(error).not.toBeDefined();
        });

        it('should have error and helper text', () => {
            const { error, helper } = setup({
                error: 'error',
                hasError: true,
                helper: 'helper',
                label: 'test',
                placeholder: 'test',
            });
            expect(error).toHaveTextContent('error');
            expect(helper).toHaveTextContent('helper');
        });
    });

    describe('Events', () => {
        it('should trigger `onChange` when text field is changed', async () => {
            const onChange = jest.fn();
            const { inputNative } = setup({ value: '', name: 'name', onChange });

            await userEvent.tab();
            expect(inputNative).toHaveFocus();

            await userEvent.keyboard('a');

            expect(onChange).toHaveBeenCalledWith('a', 'name', expect.objectContaining({}));
        });

        it('should trigger `onChange` with empty value when text field is cleared', async () => {
            const onChange = jest.fn();
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
            const onChange = jest.fn();
            const onClear = jest.fn();
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

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'inputNative',
        forwardRef: 'element',
    });
});
