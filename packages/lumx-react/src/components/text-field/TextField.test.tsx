import React, { ReactElement } from 'react';

import { ReactWrapper, ShallowWrapper, mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { build } from 'test-data-bot';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Kind } from '@lumx/react';
import { CLASSNAME, TextField, TextFieldProps } from './TextField';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<TextFieldProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * The <div> element that wraps checkbox and children elements.
     */
    wrapper: Wrapper;

    /**
     * The <input> or <textarea> element.
     */
    inputNative: Wrapper;

    /** The <InputHelper> info */
    helper: Wrapper;

    /** The <InputHelper> error */
    error: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                   The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper: Wrapper = renderer(<TextField {...props} />);

    const textarea = wrapper.find('textarea');
    const input = wrapper.find('input');
    const error = wrapper.findWhere(
        (n: ShallowWrapper | ReactWrapper) => n.name() === 'InputHelper' && n.prop('kind') === Kind.error,
    );
    const helper = wrapper.findWhere(
        (n: ShallowWrapper | ReactWrapper) => n.name() === 'InputHelper' && n.prop('kind') === undefined,
    );

    return {
        error,
        helper,
        inputNative: textarea.length ? textarea : input,
        props,
        wrapper,
    };
};

describe(`<${TextField.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const { wrapper, inputNative } = setup({ id: 'fixedId' });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(wrapper).toHaveClassName(CLASSNAME);
            expect(wrapper).not.toHaveClassName(`${CLASSNAME}--is-valid`);
            expect(wrapper).not.toHaveClassName(`${CLASSNAME}--has-error`);
            expect(wrapper).not.toHaveClassName(`${CLASSNAME}--has-label`);
            expect(wrapper).not.toHaveClassName(`${CLASSNAME}--is-disabled`);
            expect(wrapper).not.toHaveClassName(`${CLASSNAME}--has-placeholder`);
            expect(wrapper).not.toHaveClassName(`${CLASSNAME}--is-focus`);
            expect(wrapper).not.toHaveClassName(`${CLASSNAME}--has-icon`);

            expect(wrapper).toHaveClassName(`${CLASSNAME}--theme-light`);

            expect(inputNative).toExist();
            expect(inputNative.type()).toEqual('input');
        });

        it('should render textarea', () => {
            const { wrapper, inputNative } = setup({ id: 'fixedId', multiline: true });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(inputNative).toExist();
            expect(inputNative.type()).toEqual('textarea');
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should add all class names (except has-error)', () => {
            const modifiedPropsBuilder: () => SetupProps = build('props').fields!({
                icon: 'icon',
                isDisabled: true,
                isValid: true,
                label: 'test',
                placeholder: 'test',
            });

            const modifiedProps: SetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach((prop) => {
                const propType =
                    prop === 'icon' || prop === 'label' || prop === 'placeholder'
                        ? `has${prop.charAt(0).toUpperCase() + prop.slice(1)}`
                        : prop;
                const propValue =
                    prop === 'icon' || prop === 'label' || prop === 'placeholder' ? true : modifiedProps[prop];
                expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: propType, value: propValue }));
            });
        });

        it('should add "has-error" class name', () => {
            const modifiedPropsBuilder: () => SetupProps = build('props').fields!({
                hasError: true,
            });

            const modifiedProps: SetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach((prop) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                );
            });
        });

        it('should have helper text', () => {
            const { helper } = setup({
                helper: 'test',
                label: 'test',
                placeholder: 'test',
            });

            expect(helper).toHaveLength(1);
        });

        it('should have error text', () => {
            const { error } = setup({
                error: 'error',
                hasError: true,
                label: 'test',
                placeholder: 'test',
            });

            expect(error).toHaveLength(1);
        });

        it('should not have error text', () => {
            const { error } = setup({
                error: 'error',
                hasError: false,
                label: 'test',
                placeholder: 'test',
            });

            expect(error).toHaveLength(0);
        });

        it('should have error and helper text', () => {
            const { error, helper } = setup({
                error: 'error',
                hasError: true,
                helper: 'helper',
                label: 'test',
                placeholder: 'test',
            });

            expect(error).toHaveLength(1);
            expect(helper).toHaveLength(1);
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        const onChange: jest.Mock = jest.fn();

        beforeEach(onChange.mockClear);

        it('should trigger `onChange` when text field is changed', () => {
            const onChangeMock = jest.fn();
            const event = {
                target: { value: 'my value' },
            };
            const component = shallow(<TextField value="" onChange={onChangeMock} />);
            component.find('input').simulate('change', event);
            expect(onChangeMock).toBeCalledWith('my value');
        });
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'inputNative' }, { className: CLASSNAME });
});
