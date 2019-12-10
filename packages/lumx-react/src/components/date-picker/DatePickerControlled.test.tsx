import { ShallowWrapper, shallow } from 'enzyme';
import 'jest-enzyme';
import React from 'react';

import moment from 'moment';

import { ICommonSetup } from '@lumx/react/testing/utils';
import { DatePickerControlled, DatePickerControlledProps } from './DatePickerControlled';

interface ISetup extends ICommonSetup {
    after: ShallowWrapper;
    before: ShallowWrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param propOverrides An object that will extend the default properties.
 * @return An object with some shortcuts to elements or data required in tests.
 */
const setup = (propOverrides: Partial<DatePickerControlledProps> = {}): ISetup => {

    const props = {
        locale: 'fr',
        monthOffset: 0,
        onChange: jest.fn(),
        onNextMonthChange: jest.fn(),
        onPrevMonthChange: jest.fn(),
        today: moment.unix(1576146682),
        value: moment.unix(1576146682),
        ...propOverrides,
    };
    const wrapper = shallow(<DatePickerControlled {...props} />);

    return {
        after: wrapper.find('.lumx-chip__after'),
        before: wrapper.find('.lumx-chip__before'),
        props,
        wrapper,
    };
};

describe('<DatePickerControlled />', () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshot', () => {
        it('should render correctly DatePickerControlled component', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    // N/A.

    // 3. Test events.
    // N/A.

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    // N/A.

    // 5. Test state.
    // N/A.
});
