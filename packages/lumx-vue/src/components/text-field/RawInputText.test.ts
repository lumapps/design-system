import { fireEvent, render, screen } from '@testing-library/vue';

import BaseRawInputTextTests, { setup } from '@lumx/core/js/components/TextField/RawInputTextTests';
import { INPUT_NATIVE_CLASSNAME } from '@lumx/core/js/components/TextField/constants';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { RawInputText } from '.';

describe('<RawInputText />', () => {
    const renderRawInputText = (props: any, options?: SetupRenderOptions<any>) => {
        const { handleChange, className, ...restProps } = props;
        return render(RawInputText, {
            ...options,
            props: restProps,
        });
    };

    BaseRawInputTextTests({ render: renderRawInputText, screen });

    const setupRawInputText = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderRawInputText, screen });

    describe('Vue', () => {
        it('should emit change event on input change', async () => {
            const { emitted } = render(RawInputText, {
                props: { value: '' },
            });
            const input = document.querySelector('input') as HTMLInputElement;
            await fireEvent.change(input, { target: { value: 'a' } });

            const changeEvents = emitted('change');
            expect(changeEvents).toHaveLength(1);
            expect((changeEvents as any)[0][0]).toBe('a');
        });
    });

    commonTestsSuiteVTL(setupRawInputText, {
        baseClassName: INPUT_NATIVE_CLASSNAME,
        forwardClassName: 'input',
        forwardAttributes: 'input',
        applyTheme: {
            affects: [{ element: 'input' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
