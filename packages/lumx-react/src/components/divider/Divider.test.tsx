import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Theme } from '@lumx/react';
import { Divider, DividerProps } from './Divider';

const DEFAULT_PROPS = Divider.defaultProps as any;
const CLASSNAME = Divider.className as string;

type SetupProps = Partial<DividerProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: DividerProps = {
        children: 'Label',
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<Divider {...props} />);

    return {
        hr: wrapper.find('hr'),
        props,
        wrapper,
    };
};

describe(`<${Divider.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { hr, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(hr).toExist();
            expect(hr).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use default props', () => {
            const { hr } = setup();

            Object.keys(DEFAULT_PROPS).forEach((prop: string) => {
                expect(hr).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
        });

        it('should use the given `theme`', () => {
            const testedProp = 'theme';
            const modifiedProps: SetupProps = {
                [testedProp]: Theme.dark,
            };

            const { hr } = setup(modifiedProps);

            expect(hr).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: modifiedProps[testedProp] }),
            );
            expect(hr).not.toHaveClassName(
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
    commonTestsSuite(setup, { className: 'hr', prop: 'hr' }, { className: CLASSNAME });
});
