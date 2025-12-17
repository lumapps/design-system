import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { RawInputText, RawInputTextProps } from './RawInputText';
import { INPUT_NATIVE_CLASSNAME } from './constants';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<RawInputTextProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    render(<RawInputText {...props} />, { wrapper });
    const input = getByClassName(document.body, INPUT_NATIVE_CLASSNAME);
    return { props, input };
};

describe(`<${RawInputText.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { input } = setup();
            expect(input).toBeInTheDocument();
            expect(input?.tagName).toBe('INPUT');
            expect(input).toHaveAttribute('type', 'text');
        });

        it('should render with custom type', () => {
            const { input } = setup({ type: 'number' });
            expect(input).toHaveAttribute('type', 'number');
        });
    });

    describe('Events', () => {
        it('should call onChange with correct value when typing', async () => {
            const onChange = vi.fn();
            const name = 'inputName';
            const { input } = setup({ onChange, name });
            await userEvent.type(input as Element, 'hello');
            expect(onChange).toHaveBeenCalledWith('h', name, expect.any(Object));
            expect(onChange).toHaveBeenCalledWith('hello', name, expect.any(Object));
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: INPUT_NATIVE_CLASSNAME,
        forwardClassName: 'input',
        forwardAttributes: 'input',
        forwardRef: 'input',
        applyTheme: {
            affects: [{ element: 'input' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
