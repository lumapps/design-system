import React from 'react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { vi } from 'vitest';
import BaseRawInputTextareaTests from '@lumx/core/js/components/TextField/RawInputTextareaTests';
import { INPUT_NATIVE_CLASSNAME } from '@lumx/core/js/components/TextField/constants';

import { RawInputTextarea, RawInputTextareaProps } from './RawInputTextarea';

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
    // Run core tests
    BaseRawInputTextareaTests({
        render: (props: any) => {
            // Map core props to React props
            const { handleChange, rows, ...otherProps } = props;
            const reactProps = {
                ...otherProps,
                onChange: handleChange,
                // Note: if rows is provided, use it; otherwise let minimumRows default
                ...(rows !== undefined && { minimumRows: rows }),
            };
            return render(<RawInputTextarea {...reactProps} />);
        },
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should render with custom minimumRows', () => {
            const { textarea } = setup({ minimumRows: 5 });
            expect(textarea).toHaveAttribute('rows', '5');
        });

        it('should forward ref', () => {
            const ref = React.createRef<HTMLTextAreaElement>();
            setup({ ref } as any);
            expect(ref.current).toHaveClass(INPUT_NATIVE_CLASSNAME);
            expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
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
