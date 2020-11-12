import { ProgressTrackerStep } from '@lumx/react';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';
import { setupTabProviderMocks } from '../tabs/test.mocks';
import { CLASSNAME, ProgressTracker, ProgressTrackerProps } from './ProgressTracker';

// Mock useTabProviderContext.
jest.mock('../tabs/state', () => {
    return { useTabProviderContext: jest.fn(), useTabProviderContextState: jest.fn() };
});

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<ProgressTrackerProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * The <div> element that wraps steps and content elements.
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
    const steps = [<ProgressTrackerStep key={0} label="Step 0" />, <ProgressTrackerStep key={1} label="Step 1" />];
    const props: ProgressTrackerProps = {
        children: steps,
        'aria-label': 'Steps',
        ...propsOverrides,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // noinspection RequiredAttributes
    const wrapper: Wrapper = renderer(<ProgressTracker {...props} />);

    return { props, wrapper };
};

describe(`<${ProgressTracker.displayName}>`, () => {
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
            expect(wrapper.childAt(0)).toHaveClassName('lumx-progress-tracker__steps');
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
