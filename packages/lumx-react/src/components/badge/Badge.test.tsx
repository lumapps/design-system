import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Theme } from '@lumx/react';
import { Badge, BadgeProps } from './Badge';

const DEFAULT_PROPS = Badge.defaultProps as any;
const CLASSNAME = Badge.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: Partial<BadgeProps> = {}, shallowRendering = true) => {
    const props: BadgeProps = {
        children: <span>30</span>,
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<Badge {...props} />);

    return {
        badge: wrapper.find(`div`),
        props,
        wrapper,
    };
};

describe(`<${Badge.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper, badge } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(badge).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use default props', () => {
            const { badge } = setup();

            Object.keys(DEFAULT_PROPS).forEach((prop: string) => {
                expect(badge).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
        });

        it('should use the given `theme`', () => {
            const testedProp = 'color';
            const modifiedProps: Partial<BadgeProps> = {
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
    commonTestsSuite(setup, { className: 'badge', prop: 'badge' }, { className: CLASSNAME });
});
