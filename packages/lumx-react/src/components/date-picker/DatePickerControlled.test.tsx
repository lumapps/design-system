import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Wrapper } from '@lumx/react/testing/utils';

import { DatePickerControlled, DatePickerControlledProps } from './DatePickerControlled';

const mockedDate = new Date(
    new Date(1487721600).toLocaleString('en-US', {
        timeZone: 'America/Toronto',
    }),
);
Date.now = jest.fn(() => mockedDate.valueOf());

type SetupProps = Partial<DatePickerControlledProps>;

const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: DatePickerControlledProps = {
        locale: 'fr',
        onChange: jest.fn(),
        onNextMonthChange: jest.fn(),
        onPrevMonthChange: jest.fn(),
        selectedMonth: mockedDate,
        value: mockedDate,
        nextButtonProps: { label: 'Next month' },
        previousButtonProps: { label: 'Previous month' },
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<DatePickerControlled {...props} />);

    return { props, wrapper };
};

describe(`<${DatePickerControlled.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
