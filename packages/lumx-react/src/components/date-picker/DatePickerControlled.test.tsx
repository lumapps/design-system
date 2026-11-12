import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { classNames } from '@lumx/core/js/utils';
import { vi } from 'vitest';

import { DatePickerControlled, DatePickerControlledProps } from './DatePickerControlled';
import { CLASSNAME } from './constants';

const mockedDate = new Date(1487721600000); // Feb 22 2017

vi.mock('@lumx/core/js/utils/date/getYearDisplayName', () => ({
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
    getAccessibleMonthYear: (container: HTMLElement) => getByClassName(container, classNames.visuallyHidden()),
};

describe(`<${DatePickerControlled.displayName}>`, () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(mockedDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

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
        expect(selected).toBe(screen.queryByRole('gridcell', { name: /22 février 2017/i }));
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

    it('should call onNextMonthChange when next button is clicked', async () => {
        const { props } = setup();
        const nextBtn = screen.getByRole('button', { name: 'Next month' });
        await userEvent.click(nextBtn);
        expect(props.onNextMonthChange).toHaveBeenCalled();
    });

    it('should call onPrevMonthChange when prev button is clicked', async () => {
        const { props } = setup();
        const prevBtn = screen.getByRole('button', { name: 'Previous month' });
        await userEvent.click(prevBtn);
        expect(props.onPrevMonthChange).toHaveBeenCalled();
    });

    it('should call onChange when a day is clicked', async () => {
        const { props } = setup();
        // Click 15th of Feb
        const dayBtn = screen.getByRole('gridcell', { name: /15 février 2017/i });
        await userEvent.click(dayBtn);
        expect(props.onChange).toHaveBeenCalledWith(expect.any(Date));
        const calledDate = (props.onChange as any).mock.calls[0][0];
        expect(calledDate.getDate()).toBe(15);
    });

    it('should call onMonthChange on a key move into another month', async () => {
        const { props } = setup();
        screen.getByRole('gridcell', { name: /22 février 2017/i }).focus();
        await userEvent.keyboard('{PageDown}');
        expect(props.onMonthChange).toHaveBeenCalledWith(expect.any(Date));
        expect((props.onMonthChange as any).mock.calls[0][0].getMonth()).toBe(2);
    });

    it('should call onNextMonthChange on a key move into the next month without onMonthChange', async () => {
        const { props } = setup({ onMonthChange: undefined, value: new Date(2017, 1, 28) });
        screen.getByRole('gridcell', { name: /28 février 2017/i }).focus();
        await userEvent.keyboard('{ArrowRight}');
        expect(props.onNextMonthChange).toHaveBeenCalledTimes(1);
    });

    it('should not move nor keep a pending move on a key move it cannot show without onMonthChange', async () => {
        const Stateful = () => {
            const [selectedMonth, setSelectedMonth] = React.useState(mockedDate);
            return (
                <DatePickerControlled
                    locale="fr"
                    onChange={vi.fn()}
                    value={mockedDate}
                    selectedMonth={selectedMonth}
                    onPrevMonthChange={() => setSelectedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                    onNextMonthChange={() => setSelectedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                    nextButtonProps={{ label: 'Next month' }}
                    previousButtonProps={{ label: 'Previous month' }}
                />
            );
        };
        render(<Stateful />);
        const day = screen.getByRole('gridcell', { name: /22 février 2017/i });
        day.focus();
        // Next year: only the previous or next month can be shown.
        await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
        expect(day).toHaveFocus();
        expect(day).toHaveAttribute('tabindex', '0');

        // Show the month of the canceled move with the next month button.
        const nextButton = screen.getByRole('button', { name: 'Next month' });
        for (let i = 0; i < 12; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await userEvent.click(nextButton);
        }
        expect(screen.getByRole('gridcell', { name: /22 février 2018/i })).toBeInTheDocument();
        // Focus stays on the button (no late jump into the grid).
        expect(nextButton).toHaveFocus();
    });

    it('should drop a key move when the parent ignores onMonthChange', async () => {
        const Stateful = () => {
            const [selectedMonth, setSelectedMonth] = React.useState(mockedDate);
            return (
                <DatePickerControlled
                    locale="fr"
                    onChange={vi.fn()}
                    value={mockedDate}
                    selectedMonth={selectedMonth}
                    onMonthChange={() => {}}
                    onPrevMonthChange={() => setSelectedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                    onNextMonthChange={() => setSelectedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                    nextButtonProps={{ label: 'Next month' }}
                    previousButtonProps={{ label: 'Previous month' }}
                />
            );
        };
        render(<Stateful />);
        screen.getByRole('gridcell', { name: /22 février 2017/i }).focus();
        await userEvent.keyboard('{PageDown}');

        // Show the month of the ignored move with the next month button.
        const nextButton = screen.getByRole('button', { name: 'Next month' });
        await userEvent.click(nextButton);
        expect(screen.getByRole('gridcell', { name: /22 mars 2017/i })).toBeInTheDocument();
        // Focus stays on the button (no late jump into the grid).
        expect(nextButton).toHaveFocus();
    });

    it('should point todayOrSelectedDateRef to the roving day', () => {
        const todayOrSelectedDateRef = React.createRef<HTMLButtonElement>();
        setup({ todayOrSelectedDateRef });
        expect(todayOrSelectedDateRef.current).toBe(screen.getByRole('gridcell', { name: /22 février 2017/i }));
        expect(todayOrSelectedDateRef.current).toHaveAttribute('tabindex', '0');
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardRef: 'datePickerControlled',
        forwardClassName: 'datePickerControlled',
        forwardAttributes: 'datePickerControlled',
        applyTheme: {
            affects: [{ element: 'datePickerControlled' }],
            viaProp: true,
            viaContext: false,
        },
    });
});
