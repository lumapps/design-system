import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import { build } from 'test-data-bot';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/core/testing/utils.test';
import { getBasicClass } from '@lumx/core/utils';

import { CLASSNAME, DEFAULT_PROPS, TextField, TextFieldProps, TextFieldType } from './TextField';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<TextFieldProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that wraps checkbox and children elements.
     */
    wrapper: Wrapper;

    /**
     * The <input> or <textarea> element.
     */
    inputNative: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                   The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper: Wrapper = renderer(<TextField {...props} />);

    const textarea = wrapper.find('textarea');
    const input = wrapper.find('input');
    return {
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
            expect(inputNative.type()).toEqual(DEFAULT_PROPS.type);
        });

        it('should render textarea', () => {
            const { wrapper, inputNative } = setup({ id: 'fixedId', type: TextFieldType.textarea });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();

            expect(inputNative).toExist();
            expect(inputNative.type()).toEqual(TextFieldType.textarea);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should add all class names (except has-error)', () => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields!({
                icon: 'icon',
                isDisabled: true,
                isValid: true,
                label: 'test',
                placeholder: 'test',
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    const propType =
                        prop === 'icon' || prop === 'label' || prop === 'placeholder'
                            ? `has${prop.charAt(0).toUpperCase() + prop.slice(1)}`
                            : prop;
                    const propValue =
                        prop === 'icon' || prop === 'label' || prop === 'placeholder' ? true : modifiedProps[prop];
                    expect(wrapper).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: propType, value: propValue }),
                    );
                },
            );
        });

        it('should add "has-error" class name', () => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields!({
                hasError: true,
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    expect(wrapper).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                },
            );
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
