import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { RadioButton } from '@lumx/react';
import { RadioGroup, RadioGroupProps } from './RadioGroup';

const CLASSNAME = RadioGroup.className as string;

type SetupProps = Partial<RadioGroupProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<RadioGroup {...props} />);

    return {
        props,
        radioButtons: wrapper.find('RadioButton'),
        wrapper,
    };
};

describe(`<${RadioGroup.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });

        it('should render with radio button children', () => {
            const { wrapper, radioButtons } = setup({
                children: [
                    <RadioButton key={0} isChecked label="Label 1" />,
                    <RadioButton key={1} isChecked={false} label="Label 2" />,
                ],
            });
            expect(wrapper).toMatchSnapshot();

            expect(radioButtons).toExist();
            expect(radioButtons.length).toBe(2);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Nothing to do here.
    });

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here
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
    commonTestsSuite(setup, { prop: 'wrapper', className: 'wrapper' }, { className: CLASSNAME });
});
