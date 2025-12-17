import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { RawInputTextarea, RawInputTextareaProps, DEFAULT_PROPS } from './RawInputTextarea';
import { INPUT_NATIVE_CLASSNAME } from './constants';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<RawInputTextareaProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    render(<RawInputTextarea {...props} />, { wrapper });
    const textarea = getByClassName(document.body, INPUT_NATIVE_CLASSNAME);
    return { props, textarea };
};

describe(`<${RawInputTextarea.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { textarea } = setup();
            expect(textarea).toBeInTheDocument();
            expect(textarea?.tagName).toBe('TEXTAREA');
            expect(textarea).toHaveAttribute('rows', String(DEFAULT_PROPS.minimumRows));
        });

        it('should render with custom minimumRows', () => {
            const { textarea } = setup({ minimumRows: 5 });
            expect(textarea).toHaveAttribute('rows', '5');
        });

        it('should render with placeholder', () => {
            const { textarea } = setup({ placeholder: 'Test placeholder' });
            expect(textarea).toHaveAttribute('placeholder', 'Test placeholder');
        });
    });

    describe('Events', () => {
        it('should call onChange with correct value when typing', async () => {
            const onChange = vi.fn();
            const name = 'textareaName';
            const { textarea } = setup({ onChange, name });
            await userEvent.type(textarea as Element, 'hello');
            expect(onChange).toHaveBeenCalledWith('h', name, expect.any(Object));
            expect(onChange).toHaveBeenCalledWith('hello', name, expect.any(Object));
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: INPUT_NATIVE_CLASSNAME,
        forwardClassName: 'textarea',
        forwardAttributes: 'textarea',
        forwardRef: 'textarea',
        applyTheme: {
            affects: [{ element: 'textarea' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
