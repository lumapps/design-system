import React, { ReactElement } from 'react';

import noop from 'lodash/noop';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { build, oneOf } from 'test-data-bot';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Tab } from '@lumx/react';
import { CLASSNAME, Tabs, TabsLayout, TabsPosition, TabsProps } from './Tabs';

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<TabsProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * The <div> element that wraps tabs and content elements.
     */
    wrapper: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = ({ ...propsOverrides }: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const tabs = [<Tab>Tab 0</Tab>, <Tab>Tab 1</Tab>];
    const props: TabsProps = {
        children: tabs,
        onTabClick: noop,
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // noinspection RequiredAttributes
    const wrapper: Wrapper = renderer(<Tabs {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${Tabs.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);

            expect(wrapper.childAt(0)).toExist();
            expect(wrapper.childAt(0)).toHaveClassName('lumx-tabs__links');

            expect(wrapper.childAt(1)).toExist();
            expect(wrapper.childAt(1)).toHaveClassName('lumx-tabs__panes');
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use the given props', () => {
            const modifiedPropsBuilder: () => SetupProps = build('props').fields!({
                layout: TabsLayout.clustered,
                position: oneOf(TabsPosition.center, TabsPosition.right),
            });

            const modifiedProps: SetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach((prop: string) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                );
            });
        });
    });

    // 3. Test events.
    describe('Events', () => {
        const onTabClick: jest.Mock = jest.fn();

        beforeEach(() => {
            onTabClick.mockClear();
        });

        it('should trigger `onTabClick` when a child tab is clicked', () => {
            const { wrapper } = setup({ onTabClick }, false);
            const firstTab = wrapper.find('Tab[index=1]');

            firstTab.simulate('click');
            expect(onTabClick).toHaveBeenCalledWith({ event: jasmine.any(Object), index: 1 });
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should fail when no `Tab` children is given', () => {
            expect(() => {
                // We know that children must be given to <Tabs>, but for the test, ignore it.
                setup({ children: null });
            }).toThrowErrorMatchingSnapshot();
        });
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    // Common tests suite.
    commonTestsSuite(setup, {}, { className: CLASSNAME });
});
