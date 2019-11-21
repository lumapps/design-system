import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { build } from 'test-data-bot';

import { mdiCheck } from '@lumx/icons';
import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { CLASSNAME, Tab, TabProps } from './Tab';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<TabProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that wraps tab.
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
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const props: TabProps = {
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // noinspection RequiredAttributes
    const wrapper: Wrapper = renderer(<Tab {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${Tab.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { wrapper } = setup();

            expect(wrapper).toMatchSnapshot();
            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields!({
                children: 'Tab Content',
                icon: mdiCheck,
                label: 'Test Tab Label',
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });
            expect(wrapper).toMatchSnapshot();
        });

        it('should use the given props to add classes', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields!({
                isActive: true,
                isDisabled: true,
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach((prop: string): void => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                );
            });
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        const onTabClick: jest.Mock = jest.fn();

        beforeEach((): void => {
            onTabClick.mockClear();
        });

        it('should trigger `onTabClick` when clicked', (): void => {
            const { wrapper } = setup({ index: 7, onTabClick }, false);

            wrapper.simulate('click');
            expect(onTabClick).toHaveBeenCalledWith({ event: jasmine.any(Object), index: 7 });
        });

        it('should trigger `onTabClick` when pressing `enter` key', (): void => {
            const { wrapper } = setup({ index: 9, onTabClick }, false);

            wrapper.simulate('keypress', { keyCode: 13 });
            expect(onTabClick).toHaveBeenCalledWith({ event: jasmine.any(Object), index: 9 });
        });

        it('should not trigger `onTabClick` when pressing any other key', (): void => {
            const { wrapper } = setup({ index: 10, onTabClick }, false);

            wrapper.simulate('keypress', { keyCode: 12 });
            expect(onTabClick).not.toHaveBeenCalled();
        });
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
    commonTestsSuite(setup, {}, { className: CLASSNAME });
});
