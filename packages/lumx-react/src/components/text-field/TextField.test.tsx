import React, { ReactElement } from 'react';

import { ReactWrapper, ShallowWrapper, mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { build } from 'test-data-bot';

import { Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Kind } from '@lumx/react';
import { TextField, TextFieldProps } from './TextField';

const CLASSNAME = TextField.className as string;

type SetupProps = Partial<TextFieldProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<TextField {...props} />);

    const textarea = wrapper.find('textarea');
    const input = wrapper.find('input');
    const error = wrapper.findWhere(
        (n: ShallowWrapper | ReactWrapper) => n.name() === 'InputHelper' && n.prop('kind') === Kind.error,
    );
    const helper = wrapper.findWhere(
        (n: ShallowWrapper | ReactWrapper) => n.name() === 'InputHelper' && n.prop('kind') === Kind.info,
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

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should add all class names (except has-error)', () => {
            const modifiedPropsBuilder: () => SetupProps = build('props').fields({
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
            const modifiedPropsBuilder: () => SetupProps = build('props').fields({
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

        it('should have text as value', () => {
            const value = 'test';
            const { inputNative } = setup({ value });

            expect(inputNative).toHaveValue(value);
        });

        it('should have no value', () => {
            const value = undefined;
            const { inputNative } = setup({ value });

            expect(inputNative).toHaveValue(value);
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

    // 3. Test events.
    describe('Events', () => {
        const onChange: jest.Mock = jest.fn();

        beforeEach(onChange.mockClear);

        it('should trigger `onChange` when text field is changed', () => {
            const onChangeMock = jest.fn();
            const event = {
                target: { value: 'my value' },
            };
            const component = shallow(<TextField value="" name="my name" onChange={onChangeMock} />);
            component.find('input').simulate('change', event);
            expect(onChangeMock).toBeCalledWith('my value', 'my name', {
                target: {
                    value: 'my value',
                },
            });
        });
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
    commonTestsSuite(setup, { className: 'wrapper', prop: 'inputNative' }, { className: CLASSNAME });
});
