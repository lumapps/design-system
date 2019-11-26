import React, { InputHTMLAttributes, LabelHTMLAttributes, ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Theme } from '@lumx/react';
import { CLASSNAME, RadioButton, RadioButtonProps } from './RadioButton';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<RadioButtonProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that wraps radio button
     */
    wrapper: Wrapper;

    /**
     * Radio button label element.
     */
    label: Wrapper;

    /**
     * Radio button helper element.
     */
    helper: Wrapper;

    /**
     * Radio button input element.
     */
    input: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                   The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = ({ ...props }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper: Wrapper = renderer(<RadioButton {...props} />);

    return {
        helper: wrapper.find(`.${CLASSNAME}__helper`),
        input: wrapper.find(`input`),
        label: wrapper.find(`label`),
        props,
        wrapper,
    };
};

describe(`<${RadioButton.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render defaults', (): void => {
            const { wrapper, input, helper } = setup({});
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(input).toExist();
            const inputProps: InputHTMLAttributes<HTMLInputElement> = input.props();
            expect(inputProps.checked).toBe(false);
            expect(inputProps.disabled).toBe(false);

            expect(helper).not.toExist();
        });

        it('should render checked, disabled & id', (): void => {
            const props = {
                checked: true,
                disabled: true,
                id: 'inputID',
            };
            const { wrapper, input } = setup(props);
            expect(wrapper).toMatchSnapshot();

            const inputProps: InputHTMLAttributes<HTMLInputElement> = input.props();
            expect(inputProps.checked).toBe(true);
            expect(inputProps.disabled).toBe(true);
            expect(inputProps.id).toEqual(props.id);
        });

        it('should render label & helper', (): void => {
            const props = {
                helper: 'Helper',
                label: 'Label',
            };
            const { wrapper, label, helper, input } = setup(props as Partial<RadioButtonProps>);
            expect(wrapper).toMatchSnapshot();

            expect(input).toExist();
            const inputProps: InputHTMLAttributes<HTMLInputElement> = input.props();
            expect(inputProps.checked).toBe(false);
            expect(inputProps.disabled).toBe(false);

            expect(label).toExist();
            expect(label.contains(props.label)).toBe(true);
            const labelProps: LabelHTMLAttributes<HTMLLabelElement> = label.props();
            expect(labelProps.htmlFor).toEqual(inputProps.id);

            expect(helper).toExist();
            expect(helper.contains(props.helper)).toBe(true);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use props for classes', () => {
            const props = {
                checked: true,
                disabled: true,
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

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { prop: 'input', className: 'wrapper' }, { className: CLASSNAME });
});
