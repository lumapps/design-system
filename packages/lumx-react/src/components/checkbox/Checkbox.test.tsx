import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Checkbox, CheckboxProps } from './Checkbox';

const CLASSNAME = Checkbox.className as string;

type SetupProps = Partial<CheckboxProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { id: 'fixedId', ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<Checkbox {...props} />);

    return {
        helper: wrapper.find(`.${CLASSNAME}__helper`),
        label: wrapper.find(`.${CLASSNAME}__label`),
        props,
        wrapper,
    };
};

describe(`<${Checkbox.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
            expect(wrapper).not.toHaveClassName('lumx-checkbox--is-disabled');
            expect(wrapper).toHaveClassName('lumx-checkbox--is-unchecked');
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should add a "disabled" and "checked" class names', () => {
            const { wrapper } = setup({
                isDisabled: true,
                isChecked: true,
            });

            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'disabled', value: true }));
            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'checked', value: true }));
        });

        it('should use the given props', () => {
            const { helper, label, wrapper } = setup({
                helper: 'Test helper',
                label: 'Test label',
            });

            expect(helper).toExist();
            expect(label).toExist();
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 3. Test events.
    describe('Events', () => {
        const onChange: jest.Mock = jest.fn();

        beforeEach(() => {
            onChange.mockClear();
        });

        it('should trigger `onChange` when checkbox is clicked', () => {
            const { wrapper } = setup({ checked: false, onChange }, false);
            const checkbox = wrapper.find('input');

            checkbox.simulate('change');
            expect(onChange).toHaveBeenCalled();
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
