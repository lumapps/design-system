import React from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { CLASSNAME, Tooltip, TooltipProps } from './Tooltip';

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
 * @param  props  The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const renderer = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper = renderer(<Tooltip label="Tooltip" {...props}>Anchor</Tooltip>);
    const tooltip = wrapper.find('.' + CLASSNAME);

    return {
        props,
        tooltip,
        wrapper,
    };
};

jest.mock('./useTooltipOpen', () => ({ useTooltipOpen: () => true}));

describe(`<${Tooltip.displayName}>`, () => {

    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { tooltip, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(tooltip).toExist();
            expect(tooltip).toHaveClassName(CLASSNAME);
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'tooltip', prop: 'tooltip' }, { className: CLASSNAME });
});
