import React from 'react';

import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { DatePickerControlled, DatePickerControlledProps } from './DatePickerControlled';
import { CLASSNAME } from './constants';

const mockedDate = new Date(1487721600000);
Date.now = jest.fn(() => mockedDate.valueOf());

type SetupProps = Partial<DatePickerControlledProps>;

const setup = (propsOverride: SetupProps = {}) => {
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
    render(<DatePickerControlled {...props} />);
    const datePickerControlled = getByClassName(document.body, CLASSNAME);
    return { props, datePickerControlled };
};

describe(`<${DatePickerControlled.displayName}>`, () => {
    it('should render', () => {
        const { datePickerControlled } = setup();
        expect(datePickerControlled).toBeInTheDocument();

        const month = queryByClassName(datePickerControlled, `${CLASSNAME}__month`);
        expect(month).toHaveTextContent('février 2017');

        const selected = queryByClassName(datePickerControlled, `${CLASSNAME}__month-day--is-selected`);
        expect(selected).toBe(screen.queryByRole('button', { name: '22' }));
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardRef: 'datePickerControlled',
    });
});
