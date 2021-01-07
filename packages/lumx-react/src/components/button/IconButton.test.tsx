import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';

import { IconButton, IconButtonProps } from './IconButton';

const DEFAULT_PROPS = IconButton.defaultProps as any;
const CLASSNAME = IconButton.className as string;

type SetupProps = Partial<IconButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<IconButton {...props} />);

    return {
        buttonRoot: wrapper.find('ButtonRoot'),
        icon: wrapper.find('Icon'),
        props,
        wrapper,
    };
};

describe(`<${IconButton.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render icon button', () => {
            const { buttonRoot, icon, wrapper } = setup({});
            expect(wrapper).toMatchSnapshot();
            expect(buttonRoot).toExist();
            expect(icon).toExist();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use default props', () => {
            const { wrapper, buttonRoot } = setup();
            expect(wrapper).toMatchSnapshot();

            const actualProps = buttonRoot.props() as IconButtonProps;
            expect(actualProps.variant).toEqual('icon');
            for (const [propName, propValue] of Object.entries(DEFAULT_PROPS)) {
                expect(actualProps[propName]).toEqual(propValue);
            }
        });

        it('should forward any CSS class', () => {
            const props: Partial<IconButtonProps> = {
                className: 'component component--is-tested',
            };
            const { wrapper, buttonRoot } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toHaveClassName(props.className);
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
    commonTestsSuite(setup, { prop: 'buttonRoot' }, { className: CLASSNAME });
});
