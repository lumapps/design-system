import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';

import { CLASSNAME, DEFAULT_PROPS, SideNavigation, SideNavigationProps } from './SideNavigation';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<SideNavigationProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    root: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                    The props to use to override the default props of the component.
 * @param  [shallowRendering=true]  Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const props: Partial<SideNavigationProps> = {
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // @ts-ignore
    const wrapper: Wrapper = renderer(<SideNavigation {...props} />);

    return {
        props,
        root: wrapper.find(`.${CLASSNAME}`),
        wrapper,
    };
};

describe(`<${SideNavigation.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', (): void => {
            const { root, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        // Here are some examples of basic props check.

        it('should use default props', (): void => {
            const { root } = setup();

            for (const prop of Object.keys(DEFAULT_PROPS)) {
                expect(root).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            }
        });
    });

    /////////////////////////////

    // 3. Test events. => no events

    /////////////////////////////

    // 4. Test conditions => no conditions

    /////////////////////////////

    // 5. Test state => no state

    /////////////////////////////
    // Common tests suite.
    commonTestsSuite(setup, { className: 'root', prop: 'root' }, { className: CLASSNAME });
});
