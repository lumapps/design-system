import { CommonSetup, commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';

import { CLASSNAME, DEFAULT_PROPS, Tooltip, TooltipProps } from './Tooltip';

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<TooltipProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    wrapper: Wrapper;
    tooltip: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  propsOverrides          The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (propsOverrides: SetupProps = {}, shallowRendering = true): Setup => {
    const props: TooltipProps = {
        anchorRef: undefined as any,
        ...propsOverrides,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<Tooltip {...props} />);
    const tooltip = wrapper.find(`.${CLASSNAME}`);

    return {
        props,
        tooltip,
        wrapper,
    };
};

describe(`<${Tooltip.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { tooltip } = setup();
            expect(tooltip).toMatchSnapshot();

            expect(tooltip).toExist();
            expect(tooltip).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Here are some examples of basic props check.

        it('should use default props', () => {
            const { tooltip } = setup();

            expect(tooltip).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: 'position', value: DEFAULT_PROPS.placement }),
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
    commonTestsSuite(setup, { className: 'tooltip', prop: 'tooltip' }, { className: CLASSNAME });
});
