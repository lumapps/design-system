import React, { InputHTMLAttributes, LabelHTMLAttributes, ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Theme } from '@lumx/react';
import { RadioButton, RadioButtonProps } from './RadioButton';

const CLASSNAME = RadioButton.className as string;

type SetupProps = Partial<RadioButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { id: 'fixedId', ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<RadioButton {...props} />);

    return {
        helper: wrapper.find(`.${CLASSNAME}__helper`),
        input: wrapper.find(`input`),
        label: wrapper.find(`.${CLASSNAME}__label`),
        props,
        wrapper,
    };
};

describe(`<${RadioButton.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const { wrapper, input, helper } = setup({});
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(input).toExist();
            const inputProps: InputHTMLAttributes<HTMLInputElement> = input.props();
            expect(inputProps.checked).toBeFalsy();
            expect(inputProps.disabled).toBeFalsy();

            expect(helper).not.toExist();
        });

        it('should render checked, disabled & id', () => {
            const props = {
                isChecked: true,
                isDisabled: true,
                id: 'inputID',
            };
            const { wrapper, input } = setup(props);
            expect(wrapper).toMatchSnapshot();

            const inputProps: InputHTMLAttributes<HTMLInputElement> = input.props();
            expect(inputProps.checked).toBe(true);
            expect(inputProps.disabled).toBe(true);
            expect(inputProps.id).toEqual(props.id);
        });

        it('should render label & helper', () => {
            const props = {
                helper: 'Helper',
                label: 'Label',
            };
            const { wrapper, label, helper, input } = setup(props as Partial<RadioButtonProps>);
            expect(wrapper).toMatchSnapshot();

            expect(input).toExist();
            const inputProps: InputHTMLAttributes<HTMLInputElement> = input.props();
            expect(inputProps.checked).toBeFalsy();
            expect(inputProps.disabled).toBeFalsy();

            expect(label).toExist();
            expect(label.contains(props.label)).toBe(true);
            const labelProps: LabelHTMLAttributes<HTMLLabelElement> = label.props();
            expect(labelProps.htmlFor).toEqual(inputProps.id);

            expect(helper).toExist();
            expect(helper.contains(props.helper)).toBe(true);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use props for classes', () => {
            const props = {
                isChecked: true,
                isDisabled: true,
                theme: Theme.dark,
            };
            const { wrapper } = setup(props as RadioButtonProps);

            expect(wrapper).toHaveClassName(CLASSNAME);
            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'isDisabled', value: true }));
            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'isChecked', value: true }));
            expect(wrapper).not.toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'isUnchecked', value: true }));
            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'theme', value: props.theme }));
        });
    });

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    // Common tests suite.
    commonTestsSuite(setup, { prop: 'wrapper', className: 'wrapper' }, { className: CLASSNAME });
});
