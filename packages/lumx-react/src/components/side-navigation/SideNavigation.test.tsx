import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { SideNavigation, SideNavigationProps } from './SideNavigation';

const CLASSNAME = SideNavigation.className as string;

type SetupProps = Partial<SideNavigationProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
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
