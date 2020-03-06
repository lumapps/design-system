import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { CLASSNAME, SideNavigation, SideNavigationProps } from './SideNavigation';

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<SideNavigationProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    root: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  propsOverrides           The props to use to override the default props of the component.
 * @param  [shallowRendering=true]  Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (propsOverrides: SetupProps = {}, shallowRendering = true): Setup => {
    const props: SideNavigationProps = {
        children: null,
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<SideNavigation {...props} />);

    return {
        props,
        root: wrapper.find(`.${CLASSNAME}`),
        wrapper,
    };
};

describe(`<${SideNavigation.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { root, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values. => no default props

    // 3. Test events. => no events

    // 4. Test conditions => no conditions

    // 5. Test state => no state
    // Common tests suite.
    commonTestsSuite(setup, { className: 'root', prop: 'root' }, { className: CLASSNAME });
});
