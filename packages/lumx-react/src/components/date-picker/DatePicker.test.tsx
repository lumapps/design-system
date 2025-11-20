import React from 'react';

import { DatePickerProps } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';

import { DatePicker } from '.';
import { CLASSNAME } from './constants';

const mockedDate = new Date(1487721600000);
Date.now = vi.fn(() => mockedDate.valueOf());
vi.mock('@lumx/react/utils/date/getYearDisplayName', () => ({
    getYearDisplayName: () => 'année',
}));

const setup = (propsOverride: Partial<DatePickerProps> = {}) => {
    const props: DatePickerProps = {
        locale: 'fr',
        onChange: vi.fn(),
        value: mockedDate,
        nextButtonProps: { label: 'Next month' },
        previousButtonProps: { label: 'Previous month' },
        ...propsOverride,
    };
    render(<DatePicker {...props} />);
    const datePicker = getByClassName(document.body, CLASSNAME);
    return { props, datePicker };
};

describe(`<${DatePicker.displayName}>`, () => {
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardRef: 'datePicker',
    });
});
