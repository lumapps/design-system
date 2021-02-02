import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';
import { setupTabProviderMocks } from '../tabs/test.mocks';
import { ProgressTrackerStepPanel, ProgressTrackerStepPanelProps } from './ProgressTrackerStepPanel';

const CLASSNAME = ProgressTrackerStepPanel.className as string;

// Mock useTabProviderContext.
jest.mock('../tabs/state', () => {
    const state = jest.requireActual('../tabs/state');
    return { ...state, useTabProviderContext: jest.fn(), useTabProviderContextState: jest.fn() };
});

type SetupProps = Partial<ProgressTrackerStepPanelProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: ProgressTrackerStepPanelProps = { ...propsOverride, children: 'Tab panel content' };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<ProgressTrackerStepPanel {...props} />);

    return { props, wrapper };
};

describe(`<${ProgressTrackerStepPanel.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            setupTabProviderMocks({ index: 1 });
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });

        it('should render isActive state', () => {
            setupTabProviderMocks({ index: 2, isActive: true });
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });

        it('should not render children when not active and lazy', () => {
            setupTabProviderMocks({ isLazy: true, isActive: false });
            const { wrapper } = setup();
            expect(wrapper.find('div').props().children).toBeFalsy();
        });

        it('should render children when active and lazy', () => {
            setupTabProviderMocks({ isLazy: true, isActive: true });
            const { wrapper } = setup();
            expect(wrapper.find('div').props().children).toBeTruthy();
        });

        it('should render children when not active and not lazy', () => {
            setupTabProviderMocks({ isActive: false, isLazy: false });
            const { wrapper } = setup();
            expect(wrapper.find('div').props().children).toBeTruthy();
        });
    });

    // Common tests suite.
    commonTestsSuite(
        (...args: any[]) => {
            setupTabProviderMocks();
            return setup(...args);
        },
        { className: 'wrapper', prop: 'wrapper' },
        { className: CLASSNAME },
    );
});
