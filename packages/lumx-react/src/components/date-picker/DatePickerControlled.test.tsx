import React, { ReactElement } from 'react';

import moment from 'moment';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { ICommonSetup, Wrapper } from '@lumx/react/testing/utils';

import { DatePickerControlled, DatePickerControlledProps } from './DatePickerControlled';

Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<DatePickerControlledProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;
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
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const props: DatePickerControlledProps = {
        locale: 'fr',
        monthOffset: 0,
        onChange: jest.fn(),
        onNextMonthChange: jest.fn(),
        onPrevMonthChange: jest.fn(),
        today: moment(),
        value: moment(),
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<DatePickerControlled {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${DatePickerControlled.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here.
    });
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });
});
