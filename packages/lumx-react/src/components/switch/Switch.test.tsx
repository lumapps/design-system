import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { getByClassName, getByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event/';

import { Switch, SwitchProps } from './Switch';

const CLASSNAME = Switch.className as string;

type SetupProps = Partial<SwitchProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props = { ...propsOverride };
    render(<Switch {...props} />);
    const switchWrapper = getByClassName(document.body, CLASSNAME);
    const input = getByTagName(switchWrapper, 'input');
    const helper = queryByClassName(switchWrapper, `${CLASSNAME}__helper`);
    const label = queryByClassName(switchWrapper, `${CLASSNAME}__label`);
    return { switchWrapper, input, helper, label, props };
};

jest.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

describe(`<${Switch.displayName}>`, () => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { switchWrapper, input, label, helper } = setup();
            expect(switchWrapper).toBeInTheDocument();
            expect(switchWrapper).toHaveClass(CLASSNAME);
            expect(switchWrapper).not.toHaveClass('lumx-switch--is-disabled');
            expect(switchWrapper).toHaveClass('lumx-switch--is-unchecked');

            expect(label).not.toBeInTheDocument();
            expect(helper).not.toBeInTheDocument();

            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('role', 'switch');
            expect(input).not.toBeChecked();
            expect(input).not.toBeDisabled();
        });

        it('should render disabled and checked', () => {
            const { switchWrapper, input } = setup({
                isDisabled: true,
                isChecked: true,
            });
            expect(switchWrapper).toHaveClass('lumx-switch--is-disabled');
            expect(switchWrapper).toHaveClass('lumx-switch--is-checked');

            expect(input).toBeChecked();
            expect(input).toBeDisabled();
        });

        it('should render helper and label', () => {
            const id = 'switchWrapper1';
            const { props, helper, label, input } = setup({
                id,
                helper: 'Test helper',
                children: 'Test label',
            });

            expect(helper).toBeInTheDocument();
            expect(helper).toHaveTextContent(props.helper as string);
            expect(helper).toHaveAttribute('id');

            expect(label).toBeInTheDocument();
            expect(label).toHaveTextContent(props.children);
            expect(label).toHaveAttribute('for', id);

            expect(input).toHaveAttribute('id', id);
            expect(input).toHaveAttribute('aria-describedby', helper?.id);
        });

        it('should forward input props', () => {
            const { props, input } = setup({
                inputProps: { 'aria-labelledby': 'labelledby-id' },
            });

            expect(input).toHaveAttribute('aria-labelledby', props.inputProps?.['aria-labelledby']);
        });
    });

    describe('Events', () => {
        const onChange = jest.fn();

        it('should trigger `onChange` when switchWrapper is clicked', async () => {
            const value = 'value';
            const name = 'name';
            const { input } = setup({ checked: false, onChange, value, name });
            expect(input).not.toBeChecked();

            await userEvent.click(input);

            expect(onChange).toHaveBeenCalledWith(true, value, name, expect.any(Object));
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'switchWrapper',
        forwardAttributes: 'switchWrapper',
        forwardRef: 'switchWrapper',
    });
});
