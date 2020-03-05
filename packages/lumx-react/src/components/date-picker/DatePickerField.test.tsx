import React, { ReactElement } from 'react';

import moment from 'moment';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper } from '@lumx/react/testing/utils';

import { DatePickerField, DatePickerFieldProps } from './DatePickerField';

Date.now = jest.fn(() =>
    new Date(
        new Date(1487721600).toLocaleString('en-US', {
            timeZone: 'America/Toronto',
        }),
    ).valueOf(),
);

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<DatePickerFieldProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;
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
    const props: DatePickerFieldProps = {
        label: 'DatePickerField',
        locale: 'fr',
        onChange: jest.fn(),
        value: moment(),
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<DatePickerField {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${DatePickerField.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Nothing to do here.
    });

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });
});
