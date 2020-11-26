import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';

import { setupTabProviderMocks } from '../tabs/test.mocks';
import { CLASSNAME, ProgressTrackerStep, ProgressTrackerStepProps } from './ProgressTrackerStep';

// Mock useTabProviderContext.
jest.mock('../tabs/state', () => {
    return { useTabProviderContext: jest.fn(), useTabProviderContextState: jest.fn() };
});

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<ProgressTrackerStepProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * The <div> element that wraps step.
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
const setup = ({ ...propsOverrides }: SetupProps = {}, shallowRendering = true): Setup => {
    const props: ProgressTrackerStepProps = { label: 'Test Step Label', ...propsOverrides };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<ProgressTrackerStep {...props} />);

    return { props, wrapper };
};

describe(`<${ProgressTrackerStep.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render', () => {
            setupTabProviderMocks({ index: 1 });
            const { wrapper } = setup({});
            expect(wrapper).toMatchSnapshot();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });

        it('should render active state', () => {
            setupTabProviderMocks({ index: 3, isActive: true });
            const { wrapper } = setup({});
            expect(wrapper).toMatchSnapshot();
        });

        it('should render complete state', () => {
            setupTabProviderMocks({ index: 3, isComplete: true });
            const { wrapper } = setup({});
            expect(wrapper).toMatchSnapshot();
        });

        it('should render erroneous state', () => {
            setupTabProviderMocks({ index: 3, hasError: true });
            const { wrapper } = setup({});
            expect(wrapper).toMatchSnapshot();
        });

        it('should render active erroneous state', () => {
            setupTabProviderMocks({ index: 3, isActive: true, hasError: true });
            const { wrapper } = setup({});
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use the given props to add classes', () => {
            setupTabProviderMocks();
            const props: any = {
                isActive: true,
                hasError: true,
                isComplete: true,
            };
            const { wrapper } = setup(props);

            Object.keys(props).forEach((prop) => {
                expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: prop, value: props[prop] }));
            });
        });
    });

    // 3. Test events.
    describe('Events', () => {
        it('should trigger `onChange` when focused if the provider is configured to do so', () => {
            const { changeToTab } = setupTabProviderMocks({ shouldActivateOnFocus: true });
            const { wrapper } = setup({}, false);

            wrapper.simulate('focus');
            expect(changeToTab).toHaveBeenCalledTimes(1);
        });

        it('should trigger `onChange` when clicked', () => {
            const { changeToTab } = setupTabProviderMocks();
            const { wrapper } = setup({}, false);

            wrapper.simulate('click');
            expect(changeToTab).toHaveBeenCalledTimes(1);
        });

        it('should trigger `onChange` when pressing `enter`', () => {
            const { changeToTab } = setupTabProviderMocks();
            const { wrapper } = setup({}, false);

            wrapper.simulate('keypress', { keyCode: 13 });
            expect(changeToTab).toHaveBeenCalledTimes(1);
        });

        it('should not trigger `onChange` when pressing any other key', () => {
            const { changeToTab } = setupTabProviderMocks();
            const { wrapper } = setup({}, false);

            wrapper.simulate('keypress', { keyCode: 12 });
            expect(changeToTab).not.toHaveBeenCalled();
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
