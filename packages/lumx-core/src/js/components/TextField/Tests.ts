import partition from 'lodash/partition';

import { getByClassName, getByTagName, queryAllByClassName, queryByTagName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';

const CLASSNAME = 'lumx-text-field';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = { ...propsOverride };
    const wrapper = render(props, options);

    const element = getByClassName(document.body, CLASSNAME);
    const inputNative = (queryByTagName(document.body, 'textarea') || getByTagName(document.body, 'input')) as
        | HTMLTextAreaElement
        | HTMLInputElement;
    const helpers = queryAllByClassName(document.body, 'lumx-text-field__helper');
    const [[helper], [error]] = partition(helpers, (h) => !h.className.includes('lumx-input-helper--color-red'));

    return {
        props,
        element,
        inputNative,
        error,
        helper,
        wrapper,
    };
};

export default (renderOptions: SetupOptions<any>) => {
    describe('TextField core tests', () => {
        describe('Render', () => {
            it('should render defaults', () => {
                const { element, inputNative } = setup({ id: 'fixedId' }, renderOptions);
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
                const { element, inputNative } = setup({ id: 'fixedId', multiline: true }, renderOptions);
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
                const { element } = setup(modifiedProps, renderOptions);

                expect(element.className).toEqual(
                    'lumx-text-field lumx-text-field--has-icon lumx-text-field--has-input lumx-text-field--has-label lumx-text-field--has-placeholder lumx-text-field--is-disabled lumx-text-field--is-valid lumx-text-field--theme-light',
                );
            });

            it('should add "has-error" class name', () => {
                const modifiedProps = { hasError: true };
                const { element } = setup(modifiedProps, renderOptions);

                expect(element.className).toEqual(
                    'lumx-text-field lumx-text-field--has-error lumx-text-field--has-input lumx-text-field--theme-light',
                );
            });

            it('should have text as value', () => {
                const value = 'test';
                const { inputNative } = setup({ value }, renderOptions);
                expect(inputNative.value).toEqual(value);
            });

            it('should have no value', () => {
                const value = undefined;
                const { inputNative } = setup({ value }, renderOptions);
                expect(inputNative.value).toEqual('');
            });

            it('should have helper text', () => {
                const { helper, inputNative } = setup(
                    {
                        helper: 'helper',
                        label: 'test',
                        placeholder: 'test',
                    },
                    renderOptions,
                );

                expect(helper).toHaveTextContent('helper');
                expect(inputNative).toHaveAccessibleDescription('helper');
            });

            it('should have error text', () => {
                const { error, inputNative } = setup(
                    {
                        error: 'error',
                        hasError: true,
                        label: 'test',
                        placeholder: 'test',
                    },
                    renderOptions,
                );

                expect(error).toHaveTextContent('error');
                expect(inputNative).toHaveAttribute('aria-invalid', 'true');
                expect(inputNative).toHaveAccessibleDescription('error');
            });

            it('should not have error text', () => {
                const { error } = setup(
                    {
                        error: 'error',
                        hasError: false,
                        label: 'test',
                        placeholder: 'test',
                    },
                    renderOptions,
                );
                expect(error).not.toBeDefined();
            });

            it('should have error and helper text', () => {
                const { error, helper, inputNative } = setup(
                    {
                        error: 'error',
                        hasError: true,
                        helper: 'helper',
                        label: 'test',
                        placeholder: 'test',
                    },
                    renderOptions,
                );
                expect(error).toHaveTextContent('error');
                expect(helper).toHaveTextContent('helper');
                expect(inputNative).toHaveAccessibleDescription('error helper');
            });

            it('should have error and helper text and custom aria describedby', () => {
                const { error, helper, inputNative } = setup(
                    {
                        error: 'error',
                        hasError: true,
                        helper: 'helper',
                        label: 'test',
                        placeholder: 'test',
                        'aria-describedby': 'aria-description',
                    },
                    renderOptions,
                );
                expect(error).toHaveTextContent('error');
                expect(helper).toHaveTextContent('helper');
                expect(inputNative).toHaveAttribute('aria-describedby', expect.stringContaining('aria-description'));
                expect(inputNative).toHaveAttribute('aria-describedby', expect.stringContaining('text-field-error-'));
                expect(inputNative).toHaveAttribute('aria-describedby', expect.stringContaining('text-field-helper-'));
            });

            it('should render character counter', () => {
                const { element } = setup({ maxLength: 100, value: 'test' }, renderOptions);
                const counter = element.querySelector(`.${CLASSNAME}__char-counter`);
                expect(counter).toBeInTheDocument();
                expect(counter).toHaveTextContent('96');
            });

            it('should not forward "className" to the native input element', () => {
                const { element, inputNative } = setup({ className: 'custom-class' }, renderOptions);
                expect(element).toHaveClass('custom-class');
                expect(inputNative).not.toHaveClass('custom-class');
            });

            it('should not forward "icon" to the native input element', () => {
                const { inputNative } = setup({ icon: 'mdi-icon-path' }, renderOptions);
                expect(inputNative).not.toHaveAttribute('icon');
            });

            it('should not forward "isValid" to the native input element', () => {
                const { inputNative } = setup({ isValid: true }, renderOptions);
                expect(inputNative).not.toHaveAttribute('isvalid');
            });

            it('should not forward "label" to the native input element', () => {
                const { inputNative } = setup({ label: 'My label' }, renderOptions);
                expect(inputNative).not.toHaveAttribute('label');
            });

            it('should not forward "chips" to the native input element', () => {
                const { inputNative } = setup({ chips: 'chip' }, renderOptions);
                expect(inputNative).not.toHaveAttribute('chips');
            });

            it('should not forward "labelProps" to the native input element', () => {
                const { inputNative } = setup({ labelProps: { className: 'custom-label' } }, renderOptions);
                expect(inputNative).not.toHaveAttribute('labelprops');
            });
        });

        describe('Disabled state', () => {
            it('should render with "isDisabled"', () => {
                const { element, inputNative } = setup(
                    {
                        label: 'Label',
                        isDisabled: true,
                        value: 'test',
                    },
                    renderOptions,
                );

                expect(element).toHaveClass('lumx-text-field--is-disabled');
                expect(inputNative).toBeDisabled();
            });

            it('should render with "aria-disabled"', () => {
                const { element, inputNative } = setup(
                    {
                        label: 'Label',
                        'aria-disabled': true,
                        value: 'test',
                    },
                    renderOptions,
                );

                expect(element).toHaveClass('lumx-text-field--is-disabled');
                expect(inputNative).not.toBeDisabled();
                expect(inputNative).toHaveAttribute('aria-disabled', 'true');
                expect(inputNative).toHaveAttribute('readonly');
            });
        });
    });
};
