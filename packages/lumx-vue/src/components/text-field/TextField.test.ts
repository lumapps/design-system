import { fireEvent, render, screen } from '@testing-library/vue';

import BaseTextFieldTests, { setup } from '@lumx/core/js/components/TextField/Tests';
import { CLASSNAME } from '@lumx/core/js/components/TextField/constants';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { TextField } from '.';

describe('<TextField />', () => {
    const renderTextField = (props: any, options?: SetupRenderOptions<any>) => {
        const { isDisabled, className, ...restProps } = props;
        return render(TextField, {
            ...options,
            props: {
                class: className,
                ...restProps,
                ...(isDisabled ? { isDisabled } : {}),
            },
        });
    };

    BaseTextFieldTests({ render: renderTextField, screen });

    const setupTextField = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderTextField, screen });

    describe('Vue', () => {
        it('should emit change event on input change', async () => {
            const { emitted } = render(TextField, {
                props: { value: '' },
            });
            const input = document.querySelector('input') as HTMLInputElement;
            await fireEvent.change(input, { target: { value: 'hello' } });

            const changeEvents = emitted('change');
            expect(changeEvents).toHaveLength(1);
            expect((changeEvents as any)[0][0]).toBe('hello');
        });

        it('should emit clear event and reset value when clear button is clicked', async () => {
            const { emitted } = render(TextField, {
                props: { value: 'some value', clearButtonProps: { label: 'Clear' } },
            });
            const clearButton = document.querySelector('.lumx-text-field__input-clear') as HTMLElement;
            await fireEvent.click(clearButton);

            expect(emitted('clear')).toHaveLength(1);
            expect(emitted('change')).toHaveLength(1);
            expect((emitted('change') as any)[0][0]).toBe('');
        });

        it('should track focus state', async () => {
            render(TextField, { props: { value: '' } });
            const element = document.querySelector(`.${CLASSNAME}`) as HTMLElement;
            const input = document.querySelector('input') as HTMLInputElement;

            expect(element).not.toHaveClass(`${CLASSNAME}--is-focus`);

            await fireEvent.focus(input);
            expect(element).toHaveClass(`${CLASSNAME}--is-focus`);

            await fireEvent.blur(input);
            expect(element).not.toHaveClass(`${CLASSNAME}--is-focus`);
        });

        it('should render textarea when multiline', () => {
            render(TextField, { props: { value: '', multiline: true } });
            expect(document.querySelector('textarea')).toBeInTheDocument();
            expect(document.querySelector('input')).not.toBeInTheDocument();
        });
    });

    commonTestsSuiteVTL(setupTextField, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'inputNative',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
