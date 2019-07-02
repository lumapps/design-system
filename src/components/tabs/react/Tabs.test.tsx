import React, { ReactElement } from 'react';

import noop from 'lodash/noop';

import { mount, shallow } from 'enzyme';
import { build, oneOf } from 'test-data-bot';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';

import { Tab } from 'LumX/components/tabs/react/Tab';
import { CLASSNAME, Layouts, Positions, Tabs, TabsProps } from './Tabs';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<TabsProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that wraps tabs and content elements.
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
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = true,
): ISetup => {
    const tabs: Tabs[] = [<Tab>Tab 0</Tab>, <Tab>Tab 1</Tab>];
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

describe(`<${Tabs.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
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

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields!({
                // tslint:disable-next-line: no-any
                layout: Layouts.clustered,
                position: oneOf(Positions.center, Positions.right),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    expect(wrapper).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                },
            );
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        const onTabClick: jest.Mock = jest.fn();

        beforeEach(
            (): void => {
                onTabClick.mockClear();
            },
        );

        it('should trigger `onTabClick` when a child tab is clicked', (): void => {
            const { wrapper } = setup({ onTabClick }, false);
            const firstTab: Tab = wrapper.find('Tab[index=1]');

            firstTab.simulate('click');
            expect(onTabClick).toHaveBeenCalledWith({ event: jasmine.any(Object), index: 1 });
        });
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        it('should fail when no `Tab` children is given', (): void => {
            expect(
                (): void => {
                    // We know that children must be given to <Tabs>, but for the test, ignore it.
                    // @ts-ignore
                    setup({ children: null });
                },
            ).toThrowErrorMatchingSnapshot();
        });
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
