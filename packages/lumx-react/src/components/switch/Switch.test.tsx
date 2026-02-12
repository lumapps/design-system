import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseSwitchTests, { setup } from '@lumx/core/js/components/Switch/Tests';
import { SwitchProps as CoreSwitchProps } from '@lumx/core/js/components/Switch';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { Switch } from './Switch';

const CLASSNAME = Switch.className as string;

vi.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

describe(`<${Switch.displayName}>`, () => {
    // Adapter for core tests
    const renderSwitch = (props: CoreSwitchProps, options?: SetupRenderOptions) => {
        const { inputId, label, ...restProps } = props;
        return render(
            <Switch id={inputId} {...restProps}>
                {label}
            </Switch>,
            options,
        );
    };

    // Run core tests
    BaseSwitchTests({ render: renderSwitch, screen });

    const setupSwitch = (props: Partial<CoreSwitchProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderSwitch, screen });

    describe('React', () => {
        it('should forward ref to the root element', () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<Switch id="test" ref={ref} />);
            expect(ref.current).toHaveClass(CLASSNAME);
        });

        it('should forward inputRef to the native input', () => {
            const inputRef = React.createRef<HTMLInputElement>();
            render(<Switch id="test" inputRef={inputRef} />);
            expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
        });

        it('should be disabled with isDisabled', async () => {
            const onChange = vi.fn();
            const { container } = render(<Switch id="test" isDisabled onChange={onChange} />);
            const switchWrapper = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(switchWrapper).toHaveClass('lumx-switch--is-disabled');
            expect(input).toBeDisabled();
            expect(input).toHaveAttribute('readOnly');

            if (input) await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should be disabled with aria-disabled', async () => {
            const onChange = vi.fn();
            const { container } = render(<Switch id="test" aria-disabled onChange={onChange} />);
            const switchWrapper = container.querySelector(`.${CLASSNAME}`);
            const input = container.querySelector('input');

            expect(switchWrapper).toHaveClass('lumx-switch--is-disabled');
            expect(input).not.toBeDisabled();
            expect(input).toHaveAttribute('aria-disabled', 'true');
            expect(input).toHaveAttribute('readOnly');

            if (input) await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    commonTestsSuiteRTL(setupSwitch, {
        baseClassName: CLASSNAME,
        forwardClassName: 'switchWrapper',
        forwardAttributes: 'switchWrapper',
        forwardRef: 'switchWrapper',
        applyTheme: {
            affects: [{ element: 'switchWrapper' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
