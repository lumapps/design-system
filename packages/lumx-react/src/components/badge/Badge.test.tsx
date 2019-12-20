import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Theme } from '@lumx/react';
import { Badge, CLASSNAME, DEFAULT_PROPS, IBaseBadgeProps } from './Badge';

/////////////////////////////

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    badge: Wrapper;
    props: Partial<IBaseBadgeProps>;

    /**
     * The <div> element wrapper.
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
const setup = ({ ...propsOverrides }: Partial<IBaseBadgeProps> = {}, shallowRendering: boolean = true): ISetup => {
    const props: IBaseBadgeProps = {
        children: <span>30</span>,
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Badge {...props} />);

    return {
        badge: wrapper.find(`div`),
        props,
        wrapper,
    };
};

describe(`<${Badge.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { wrapper, badge } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(badge).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { badge } = setup();

            Object.keys(DEFAULT_PROPS).forEach((prop: string): void => {
                expect(badge).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
        });

        it('should use the given `theme`', (): void => {
            const testedProp = 'color';
            const modifiedProps: Partial<IBaseBadgeProps> = {
                [testedProp]: Theme.dark,
            };

            const { badge } = setup(modifiedProps);

            expect(badge).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: modifiedProps[testedProp] }),
            );
            expect(badge).not.toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: DEFAULT_PROPS[testedProp] }),
            );
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here.
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
    commonTestsSuite(setup, { className: 'badge', prop: 'badge' }, { className: CLASSNAME });
});
