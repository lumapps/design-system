import { Tab } from '@lumx/react';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';
import { build, oneOf } from 'test-data-bot';
import { CLASSNAME, TabList, TabListLayout, TabListPosition, TabListProps } from './TabList';
import { setupTabProviderMocks } from './test.mocks';

// Mock useTabProviderContext.
jest.mock('./state', () => {
    return { useTabProviderContext: jest.fn(), useTabProviderContextState: jest.fn() };
});

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<TabListProps>;

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
    const tabs = [<Tab key={0} label="Tab 0" />, <Tab key={1} label="Tab 1" />];
    const props: TabListProps = {
        children: tabs,
        'aria-label': 'Tab list',
        ...propsOverrides,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // noinspection RequiredAttributes
    const wrapper: Wrapper = renderer(<TabList {...props} />);

    return { props, wrapper };
};

describe(`<${TabList.displayName}>`, () => {
    beforeEach(() => {
        setupTabProviderMocks();
    });

    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);

            expect(wrapper.childAt(0)).toExist();
            expect(wrapper.childAt(0)).toHaveClassName('lumx-tabs__links');
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use the given props', () => {
            const modifiedPropsBuilder: () => SetupProps = build('props').fields!({
                layout: TabListLayout.clustered,
                position: oneOf(TabListPosition.center, TabListPosition.right),
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

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
