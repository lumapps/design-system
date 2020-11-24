import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper } from '@lumx/react/testing/utils';

import { EllipsisType } from '@lumx/react/utils';
import { Text, TextProps } from './Text';

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<TextProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /** The <div> element that wraps checkbox and children elements. */
    wrapper: Wrapper;

    /** The <span> element. */
    textEl: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props  The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // @ts-ignore
    const wrapper: Wrapper = renderer(<Text {...props} />);

    const textEl = wrapper.find('span');

    return {
        textEl,
        props,
        wrapper,
    };
};

describe(`<${Text.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const { wrapper } = setup({ text: 'bound' });
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use maxChars and the default EllipsisType defined', () => {
            const { wrapper } = setup({
                text: 'introduced manner nodded rising sentence tube establish board garage each lose particularly',
                max: 10,
            });
            expect(wrapper).toMatchSnapshot();
        });

        it('should use maxChars and the defined EllipsisType', () => {
            const { wrapper } = setup({
                text: 'introduced manner nodded rising sentence tube establish board garage each lose particularly',
                max: 10,
                ellipsisType: EllipsisType.START,
            });
            expect(wrapper).toMatchSnapshot();
        });

        it('should use maxChars and the defined EllipsisType', () => {
            const { wrapper } = setup({
                text: 'introduced manner nodded rising sentence tube establish board garage each lose particularly',
                max: 10,
                ellipsisType: EllipsisType.START,
            });
            expect(wrapper).toMatchSnapshot();
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
});
