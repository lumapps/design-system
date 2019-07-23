import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import { build } from 'test-data-bot';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';

import { RadioButtonHelper } from './RadioButtonHelper';
import { RadioButtonLabel } from './RadioButtonLabel';

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
     * The <div> element that wraps radio button and children elements.
     */
    wrapper: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props The props to use to override the default props of the component.
 * @param       [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *              component.
 */
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const props: RadioButtonProps = {
        children: <RadioButtonLabel>Default Test label</RadioButtonLabel>,
        name: 'test',
        value: 'test-value',
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // noinspection RequiredAttributes
    const wrapper: Wrapper = renderer(<RadioButton {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${RadioButton.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
            expect(wrapper).not.toHaveClassName('lumx-radio-button--is-disabled');
            expect(wrapper).toHaveClassName('lumx-radio-button--is-unchecked');
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

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    expect(wrapper).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );

                    expect(wrapper.find('[disabled=true]')).toHaveLength(1);
                },
            );
        });

        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields!({
                children: (
                    <>
                        <RadioButtonLabel>Test label</RadioButtonLabel>
                        <RadioButtonHelper>Test Helper</RadioButtonHelper>
                    </>
                ),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            expect(wrapper).toMatchSnapshot();
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here
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
