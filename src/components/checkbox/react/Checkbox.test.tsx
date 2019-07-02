import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import { build } from 'test-data-bot';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';

import { CheckboxHelper } from './CheckboxHelper';
import { CheckboxLabel } from './CheckboxLabel';

import { CLASSNAME, Checkbox, CheckboxProps } from './Checkbox';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<CheckboxProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that wraps checkbox and children elements.
     */
    wrapper: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = true,
): ISetup => {
    const props: CheckboxProps = {
        children: <CheckboxLabel>Default Test label</CheckboxLabel>,
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // noinspection RequiredAttributes
    const wrapper: Wrapper = renderer(<Checkbox {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${Checkbox.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
            expect(wrapper).not.toHaveClassName('lumx-checkbox--is-disabled');
            expect(wrapper).toHaveClassName('lumx-checkbox--is-unchecked');
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should add a "disabled" and "checked" class names', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields!({
                checked: true,
                disabled: true,
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { wrapper }: ISetup = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    expect(wrapper).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                },
            );
        });

        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields!({
                children: (
                    <>
                        <CheckboxLabel>Test label</CheckboxLabel>
                        <CheckboxHelper>Test Helper</CheckboxHelper>
                    </>
                ),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { wrapper }: ISetup = setup({ ...modifiedProps });

            expect(wrapper).toMatchSnapshot();
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        const onChange: jest.Mock = jest.fn();

        beforeEach(
            (): void => {
                onChange.mockClear();
            },
        );

        it('should trigger `onChange` when checkbox is clicked', (): void => {
            const { wrapper }: ISetup = setup({ checked: false, onChange }, false);
            const checkbox = wrapper.find('input');

            checkbox.simulate('change', { target: { checked: false } });
            expect(onChange).toHaveBeenCalledWith({ checked: true });
        });
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
    commonTestsSuite(setup, {}, { className: CLASSNAME });
});
