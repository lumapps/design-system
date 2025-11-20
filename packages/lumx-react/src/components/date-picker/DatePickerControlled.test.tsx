import { render, screen, waitFor } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { VISUALLY_HIDDEN } from '@lumx/react/constants';

import { DatePickerControlled, DatePickerControlledProps } from './DatePickerControlled';
import { CLASSNAME } from './constants';

const mockedDate = new Date(1487721600000);
Date.now = vi.fn(() => mockedDate.valueOf());
vi.mock('@lumx/react/utils/date/getYearDisplayName', () => ({
    getYearDisplayName: () => 'année',
}));

type SetupProps = Partial<DatePickerControlledProps>;

const setup = (propsOverride: SetupProps = {}) => {
    const props: DatePickerControlledProps = {
        locale: 'fr',
        onChange: vi.fn(),
        onNextMonthChange: vi.fn(),
        onPrevMonthChange: vi.fn(),
        selectedMonth: mockedDate,
        value: mockedDate,
        nextButtonProps: { label: 'Next month' },
        previousButtonProps: { label: 'Previous month' },
        onMonthChange: vi.fn(),
        ...propsOverride,
    };
    render(<DatePickerControlled {...props} />);
    const datePickerControlled = getByClassName(document.body, CLASSNAME);
    return { props, datePickerControlled };
};

const queries = {
    getYear: () =>
        screen.getByRole('spinbutton', {
            name: /année/i,
        }),
    getAccessibleMonthYear: (container: HTMLElement) => getByClassName(container, VISUALLY_HIDDEN),
};

describe(`<${DatePickerControlled.displayName}>`, () => {
    it('should render', () => {
        const { datePickerControlled } = setup();
        expect(datePickerControlled).toBeInTheDocument();

        const month = queryByClassName(datePickerControlled, `${CLASSNAME}__month`);
        expect(month).toHaveTextContent('février');

        expect(queries.getYear()).toBeInTheDocument();
        expect(queries.getYear()).toHaveAttribute('value', '2017');
        expect(queries.getYear()).toHaveAttribute('aria-label', 'année');

        const toolbar = getByClassName(document.body, 'lumx-toolbar__label');
        expect(queries.getAccessibleMonthYear(toolbar)).toBeInTheDocument();
        expect(queries.getAccessibleMonthYear(toolbar)).toHaveTextContent('février 2017');

        const selected = queryByClassName(datePickerControlled, `lumx-button--is-selected`);
        expect(selected).toBe(screen.queryByRole('button', { name: /22 février 2017/i }));
    });

    it('should validate year when pressing Enter', async () => {
        const { datePickerControlled, props } = setup();
        expect(datePickerControlled).toBeInTheDocument();

        expect(queries.getYear()).toHaveAttribute('value', '2017');

        await userEvent.type(queries.getYear(), '{Backspace}6{Enter}'); // set year to 2016
        await waitFor(() => expect(props.onMonthChange).toHaveBeenCalledTimes(1));
        expect(props.onMonthChange).toHaveBeenCalledWith(new Date(1454284800000)); // 2017 - 12 months = 2016
    });

    it('should validate year when on Blur', async () => {
        const { datePickerControlled, props } = setup();
        expect(datePickerControlled).toBeInTheDocument();

        expect(queries.getYear()).toHaveAttribute('value', '2017');

        await userEvent.type(queries.getYear(), '{Backspace}5'); // change value to 2015
        await userEvent.tab(); // set year to 2015
        await waitFor(() => expect(props.onMonthChange).toHaveBeenCalledTimes(1));
        expect(props.onMonthChange).toHaveBeenCalledWith(new Date(1422748800000)); // 2017 - 24 months = 2015
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardRef: 'datePickerControlled',
    });
});
