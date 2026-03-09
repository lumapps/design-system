import { fireEvent, render, screen } from '@testing-library/vue';

import BaseRawInputTextareaTests, { setup } from '@lumx/core/js/components/TextField/RawInputTextareaTests';
import { INPUT_NATIVE_CLASSNAME } from '@lumx/core/js/components/TextField/constants';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { RawInputTextarea } from '.';

describe('<RawInputTextarea />', () => {
    const renderRawInputTextarea = (props: any, options?: SetupRenderOptions<any>) => {
        const { handleChange, className, ...restProps } = props;
        return render(RawInputTextarea, {
            ...options,
            props: restProps,
        });
    };

    BaseRawInputTextareaTests({ render: renderRawInputTextarea, screen });

    const setupRawInputTextarea = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderRawInputTextarea, screen });

    describe('Vue', () => {
        it('should emit change event on textarea change', async () => {
            const { emitted } = render(RawInputTextarea, {
                props: { value: '' },
            });
            const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
            await fireEvent.change(textarea, { target: { value: 'hello' } });

            const changeEvents = emitted('change');
            expect(changeEvents).toHaveLength(1);
            expect((changeEvents as any)[0][0]).toBe('hello');
        });
    });

    commonTestsSuiteVTL(setupRawInputTextarea, {
        baseClassName: INPUT_NATIVE_CLASSNAME,
        forwardClassName: 'textarea',
        forwardAttributes: 'textarea',
        applyTheme: {
            affects: [{ element: 'textarea' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
