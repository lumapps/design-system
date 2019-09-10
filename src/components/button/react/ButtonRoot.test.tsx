import React from 'react';

import { mount } from 'enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';

import { ColorPalette, Emphasis, Size, Theme } from 'LumX';
import {
    BUTTON_CLASSNAME,
    BUTTON_WRAPPER_CLASSNAME,
    ButtonRoot,
    ButtonRootProps,
} from 'LumX/components/button/react/ButtonRoot';
import { getBasicClass } from 'LumX/core/utils';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<ButtonRootProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * Button element (<a> or <button> depending on the button type).
     */
    button: Wrapper;

    /**
     * Button wrapper element (if `hasBackground` props is passed).
     */
    buttonWrapper: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                   The props to use to override the default props of the component.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = ({ ...props }: ISetupProps = {}): ISetup => {
    // @ts-ignore
    const wrapper: Wrapper = mount(<ButtonRoot {...props} />);

    return {
        button: wrapper.find('.' + BUTTON_CLASSNAME),
        buttonWrapper: wrapper.find('.' + BUTTON_WRAPPER_CLASSNAME),
        props,
        wrapper,
    };
};

describe(`<${ButtonRoot.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render button with label', () => {
            const props: Partial<ButtonRootProps> = {
                children: 'Label',
            };
            const { button, buttonWrapper, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(buttonWrapper).not.toExist();

            expect(button).toExist();
            expect(button.type()).toEqual('button');

            expect(button.contains(props.children)).toBeTrue();
        });

        it('should render button with wrapper and label', () => {
            const props: Partial<ButtonRootProps> = {
                children: 'Label',
                hasBackground: true,
            };
            const { button, buttonWrapper, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(buttonWrapper).toExist();

            expect(button).toExist();
            expect(button.type()).toEqual('button');

            expect(button.contains(props.children)).toBeTrue();
        });

        it('should render anchor button with label', () => {
            const props: Partial<ButtonRootProps> = {
                children: 'Label',
                href: 'example.com',
                target: '_blank',
            };
            const { button, buttonWrapper, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(buttonWrapper).not.toExist();

            expect(button).toExist();
            expect(button.type()).toEqual('a');
            expect(button.contains(props.children)).toBeTrue();

            const actualProps = button.props() as Partial<ButtonRootProps>;
            expect(actualProps.href).toEqual(props.href);
            expect(actualProps.target).toEqual(props.target);
        });

        it('should render anchor button with wrapper and label', () => {
            const props: Partial<ButtonRootProps> = {
                children: 'Label',
                hasBackground: true,
                href: 'example.com',
                target: '_blank',
            };
            const { button, buttonWrapper, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(buttonWrapper).toExist();

            expect(button).toExist();
            expect(button.type()).toEqual('a');
            expect(button.contains(props.children)).toBeTrue();

            const actualProps = button.props() as Partial<ButtonRootProps>;
            expect(actualProps.href).toEqual(props.href);
            expect(actualProps.target).toEqual(props.target);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use primary color as default', () => {
            const props: Partial<ButtonRootProps> = {};
            const { button, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(button).toExist();
            expect(button).toHaveClassName(
                getBasicClass({ prefix: BUTTON_CLASSNAME, type: 'color', value: ColorPalette.primary }),
            );
        });

        it('should not have default color in low or medium emphasis', () => {
            const props: Partial<ButtonRootProps> = {
                emphasis: Emphasis.low,
            };
            const { button, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(button).not.toHaveClassName(
                getBasicClass({ prefix: BUTTON_CLASSNAME, type: 'color', value: ColorPalette.primary }),
            );
        });

        it('should use given props', () => {
            // Props used for the button.
            const buttonProps: Partial<ButtonRootProps> = {
                color: ColorPalette.red,
                size: Size.s,
                theme: Theme.dark,
                variant: 'icon',
            };
            // Props used for the button wrapper.
            const buttonWrapperProps: Partial<ButtonRootProps> = {
                color: buttonProps.color,
                variant: buttonProps.variant,
            };
            const { button, buttonWrapper, wrapper } = setup({
                ...buttonProps,
                hasBackground: true,
            });
            expect(wrapper).toMatchSnapshot();

            // The button wrapper classes.
            for (const [type, value] of Object.entries(buttonProps)) {
                expect(button).toHaveClassName(getBasicClass({ prefix: BUTTON_CLASSNAME, type, value }));
            }

            // The button wrapper classes.
            for (const [type, value] of Object.entries(buttonWrapperProps)) {
                expect(buttonWrapper).toHaveClassName(getBasicClass({ prefix: BUTTON_WRAPPER_CLASSNAME, type, value }));
            }
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Tested in step 1.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'button', prop: 'button' }, { className: BUTTON_CLASSNAME });
});
