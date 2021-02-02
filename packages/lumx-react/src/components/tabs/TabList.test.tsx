import { Tab, Alignment } from '@lumx/react';

import { Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';
import { build, oneOf } from 'test-data-bot';
import { TabList, TabListLayout, TabListProps } from './TabList';
import { setupTabProviderMocks } from './test.mocks';

const CLASSNAME = TabList.className as string;

// Mock useTabProviderContext.
jest.mock('./state', () => {
    const state = jest.requireActual('./state');
    return { ...state, useTabProviderContext: jest.fn(), useTabProviderContextState: jest.fn() };
});

type SetupProps = Partial<TabListProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const tabs = [<Tab key={0} label="Tab 0" />, <Tab key={1} label="Tab 1" />];
    const props: TabListProps = {
        children: tabs,
        'aria-label': 'Tab list',
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<TabList {...props} />);

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
            const modifiedPropsBuilder: () => SetupProps = build('props').fields({
                layout: TabListLayout.clustered,
                position: oneOf(Alignment.center, Alignment.right),
            });

            const modifiedProps: SetupProps = modifiedPropsBuilder();

            const { wrapper } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach((prop) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                );
            });
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
