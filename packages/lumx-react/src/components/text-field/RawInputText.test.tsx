import React from 'react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { vi } from 'vitest';
import BaseRawInputTextTests from '@lumx/core/js/components/TextField/RawInputTextTests';
import { INPUT_NATIVE_CLASSNAME } from '@lumx/core/js/components/TextField/constants';

import { RawInputText, RawInputTextProps } from './RawInputText';

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
    // Run core tests
    BaseRawInputTextTests({
        render: (props: any) => {
            // Map core props to React props
            const { handleChange, ...otherProps } = props;
            const reactProps = {
                ...otherProps,
                onChange: handleChange,
            };
            return render(<RawInputText {...reactProps} />);
        },
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should forward ref', () => {
            const ref = React.createRef<HTMLInputElement>();
            setup({ ref } as any);
            expect(ref.current).toHaveClass(INPUT_NATIVE_CLASSNAME);
            expect(ref.current).toBeInstanceOf(HTMLInputElement);
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
