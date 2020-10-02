import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { CLASSNAME, Uploader, UploaderProps } from './Uploader';

const DEFAULT_PROPS = Uploader.defaultProps as any;

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<UploaderProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * [Enter the description of this wrapper].
     * [You should also probably change the name of the wrapper to something more meaningful].
     */
    wrapper: Wrapper;
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
    const wrapper: Wrapper = renderer(<Uploader {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${Uploader.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Here are some examples of basic props check.

        it('should use default props', () => {
            const { wrapper } = setup();

            Object.keys(DEFAULT_PROPS).forEach((prop: string) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
        });
    });

    // 3. Test events.
    describe('Events', () => {
        // Here is an example how to check a `onClick` event.

        const onClick: jest.Mock = jest.fn();

        beforeEach(() => {
            onClick.mockClear();
        });

        it('should trigger `onClick` when clicked', () => {
            const { wrapper } = setup({ onClick }, false);

            wrapper.simulate('click');

            expect(onClick).toHaveBeenCalled();
        });
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
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
