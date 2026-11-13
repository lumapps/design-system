// @vitest-environment jsdom
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { getCalendarDate, getDateKey, isSameDay } from '../../utils/date/calendarDay';
import { getMonthCalendar } from '../../utils/date/getMonthCalendar';
import { parseLocale } from '../../utils/locale/parseLocale';
import type { Locale } from '../../utils/locale/types';
import { getRovingDate } from './getRovingDate';
import { describeInTimeZones } from '../../../testing/timeZones';
import { createCalendarState, parseYear, type CalendarStateProps, type CalendarView } from './createCalendarState';

/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

/** Let the MutationObserver callbacks run. */
const flushObservers = () =>
    new Promise((resolve) => {
        setTimeout(resolve, 0);
    });

/** Calendar grid markup of the `DatePicker` template (`fr` locale), from the view. */
function renderGridContent(view: CalendarView, { minDate, maxDate }: CalendarStateProps) {
    const month = view.selectedMonth;
    const { weeks, weekDays } = getMonthCalendar(parseLocale('fr') as Locale, month, minDate, maxDate);
    const rovingDate = getRovingDate({ month, rovingDate: view.rovingDate, value: view.value, minDate, maxDate });
    const rows = weeks.map(
        (week) =>
            `<div role="row">${weekDays
                .map(({ number }) => {
                    const { date, isOutOfRange } = week[number] || {};
                    if (!date) return '<div role="gridcell" class="lumx-date-picker__day-wrapper"></div>';
                    const isRoving = rovingDate && isSameDay(rovingDate, date);
                    return `<button role="gridcell" data-date="${getDateKey(date)}"
                        tabindex="${isRoving ? 0 : -1}" ${isOutOfRange ? 'disabled' : ''}>${date.getDate()}</button>`;
                })
                .join('')}</div>`,
    );
    return rows.join('');
}

/**
 * Create a calendar state with a framework-like bridge: `render()` reads the view, renders the grid, then calls
 * `afterRender()` (as the wrappers do).
 */
function setup(initialProps: CalendarStateProps) {
    const props: CalendarStateProps = { ...initialProps };
    document.body.innerHTML = `<button>Before</button><div role="grid" aria-label="Calendar"></div>`;
    const grid = screen.getByRole('grid');
    const onUpdate = vi.fn();
    const state = createCalendarState({ getProps: () => props, onUpdate });
    let view = state.getView();
    grid.innerHTML = renderGridContent(view, props);
    const detach = state.attachGrid(grid);

    const render = async () => {
        view = state.getView();
        grid.innerHTML = renderGridContent(view, props);
        await flushObservers();
        state.afterRender();
        return view;
    };
    const getDay = (date: Date) => grid.querySelector<HTMLElement>(`[data-date="${getDateKey(date)}"]`) as HTMLElement;
    const focusRovingDay = () => (grid.querySelector('[tabindex="0"]') as HTMLElement).focus();
    return { props, state, onUpdate, render, getDay, focusRovingDay, detach, getView: () => view };
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe(parseYear, () => {
    it('should accept a whole year from 1 to 9999', () => {
        expect(parseYear('2017')).toBe(2017);
        expect(parseYear(' 1 ')).toBe(1);
        expect(parseYear('9999')).toBe(9999);
    });

    it('should reject an empty, negative, too large or not whole year', () => {
        expect(parseYear('')).toBeUndefined();
        expect(parseYear('0')).toBeUndefined();
        expect(parseYear('-5')).toBeUndefined();
        expect(parseYear('12345')).toBeUndefined();
        expect(parseYear('2017.5')).toBeUndefined();
        expect(parseYear('1e3')).toBeUndefined();
    });
});

describeInTimeZones('createCalendarState', () => {
    describe('internal shown month', () => {
        it('should show the month of the value, else the default month', () => {
            expect(setup({ value: day(2026, 11, 12) }).getView().selectedMonth).toEqual(day(2026, 11, 12));
            expect(setup({ defaultMonth: day(2025, 3, 1) }).getView().selectedMonth).toEqual(day(2025, 3, 1));
        });

        it('should warn and show today on an invalid date', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const { getView } = setup({ value: new Date('invalid') });
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('Invalid date provided'));
            expect(getView().value).toBeUndefined();
            expect(isSameDay(getView().selectedMonth, new Date())).toBe(true);
            warn.mockRestore();
        });

        it('should go to the previous and next month (first day)', async () => {
            const { state, render, onUpdate } = setup({ value: day(2026, 1, 31) });
            state.nextMonth();
            expect(onUpdate).toHaveBeenCalled();
            expect((await render()).selectedMonth.getMonth()).toBe(1);
            state.previousMonth();
            state.previousMonth();
            const view = await render();
            expect(view.selectedMonth.getFullYear()).toBe(2025);
            expect(view.selectedMonth.getMonth()).toBe(11);
            expect(view.selectedMonth.getDate()).toBe(1);
        });

        it('should set aria-live on the month label after the first month change only', async () => {
            const { state, render, getView } = setup({ value: day(2026, 11, 12) });
            expect(getView().monthLabelAriaLive).toBeUndefined();
            state.nextMonth();
            expect((await render()).monthLabelAriaLive).toBe('polite');
            // Back on the first month: still set.
            state.previousMonth();
            expect((await render()).monthLabelAriaLive).toBe('polite');
        });

        it('should show the month of a key move into another month and focus its day', async () => {
            const { focusRovingDay, render, getDay } = setup({ value: day(2026, 11, 30) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            const view = await render();
            expect(view.selectedMonth.getMonth()).toBe(11);
            expect(view.rovingDate).toEqual(day(2026, 12, 1));
            expect(getDay(day(2026, 12, 1))).toHaveFocus();
        });
    });

    describe('year input', () => {
        it('should show the year of the shown month, then the typed text', async () => {
            const { state, render, getView } = setup({ value: day(2017, 2, 22) });
            expect(getView().yearText).toBe('2017');
            state.inputYear('201', 'deleteContentBackward');
            const view = await render();
            expect(view.yearText).toBe('201');
            expect(view.selectedMonth.getFullYear()).toBe(2017);
        });

        it('should commit the typed year (Enter, blur)', async () => {
            const { state, render } = setup({ value: day(2017, 2, 22) });
            state.inputYear('2016', 'insertText');
            state.commitYear();
            const view = await render();
            expect(view.selectedMonth.getFullYear()).toBe(2016);
            expect(view.selectedMonth.getMonth()).toBe(1);
            expect(view.yearText).toBe('2016');
        });

        it('should commit right away on the spin arrows', async () => {
            const { state, render } = setup({ value: day(2017, 2, 22) });
            // Chrome/Safari: no input type.
            state.inputYear('2018');
            expect((await render()).selectedMonth.getFullYear()).toBe(2018);
            // Firefox.
            state.inputYear('2019', 'insertReplacementText');
            expect((await render()).selectedMonth.getFullYear()).toBe(2019);
        });

        it.each(['', '0', '-5', '12345'])('should drop the invalid year "%s" and show the year again', async (text) => {
            const { state, render } = setup({ value: day(2017, 2, 22) });
            state.inputYear(text, 'insertText');
            state.commitYear();
            const view = await render();
            expect(view.selectedMonth.getFullYear()).toBe(2017);
            expect(view.yearText).toBe('2017');
        });
    });

    describe('roving day', () => {
        it('should make a picked day the roving day, then call onChange', async () => {
            const onChange = vi.fn();
            const { state, render } = setup({ value: day(2026, 11, 12), onChange });
            state.pickDay(day(2026, 11, 3));
            expect(onChange).toHaveBeenCalledWith(day(2026, 11, 3));
            expect((await render()).rovingDate).toEqual(day(2026, 11, 3));
        });

        it('should reset the roving day when the value changes', async () => {
            const { props, focusRovingDay, render, getDay } = setup({ value: day(2026, 11, 12) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect((await render()).rovingDate).toEqual(day(2026, 11, 13));

            props.value = day(2026, 11, 20);
            const view = await render();
            expect(view.rovingDate).toBeUndefined();
            expect(getDay(day(2026, 11, 20))).toHaveAttribute('tabindex', '0');

            // Back to the first value: the roving day stays reset.
            props.value = day(2026, 11, 12);
            expect((await render()).rovingDate).toBeUndefined();
        });
    });

    describe('controlled shown month', () => {
        const controlled = (overrides: CalendarStateProps = {}) => {
            const onPrevMonthChange = vi.fn();
            const onNextMonthChange = vi.fn();
            return setup({
                value: day(2017, 2, 22),
                selectedMonth: day(2017, 2, 22),
                onPrevMonthChange,
                onNextMonthChange,
                ...overrides,
            });
        };

        it('should show selectedMonth and request the previous and next month', async () => {
            const { props, state, render } = controlled();
            state.nextMonth();
            expect(props.onNextMonthChange).toHaveBeenCalledTimes(1);
            state.previousMonth();
            expect(props.onPrevMonthChange).toHaveBeenCalledTimes(1);
            // The parent holds the month.
            expect((await render()).selectedMonth).toEqual(day(2017, 2, 22));
            props.selectedMonth = day(2017, 3, 1);
            const view = await render();
            expect(view.selectedMonth).toEqual(day(2017, 3, 1));
            expect(view.monthLabelAriaLive).toBe('polite');
        });

        it('should have a year input only with onMonthChange', () => {
            expect(controlled().getView().yearText).toBeUndefined();
            expect(controlled({ onMonthChange: vi.fn() }).getView().yearText).toBe('2017');
        });

        it('should request the committed year with onMonthChange', () => {
            const onMonthChange = vi.fn();
            const { state } = controlled({ onMonthChange });
            state.inputYear('2016', 'insertText');
            state.commitYear();
            expect(onMonthChange).toHaveBeenCalledTimes(1);
            expect(onMonthChange.mock.calls[0][0].getFullYear()).toBe(2016);
            expect(onMonthChange.mock.calls[0][0].getMonth()).toBe(1);
        });

        it('should request a key move into another month with onMonthChange', async () => {
            const onMonthChange = vi.fn();
            const { props, state, focusRovingDay, render, getDay } = controlled({ onMonthChange });
            focusRovingDay();
            await userEvent.keyboard('{PageDown}');
            expect(onMonthChange).toHaveBeenCalledWith(day(2017, 3, 22));
            // An after-render hook of an earlier render (no new view yet) keeps the move.
            state.afterRender();
            [[props.selectedMonth]] = onMonthChange.mock.calls;
            await render();
            expect(getDay(day(2017, 3, 22))).toHaveFocus();
        });

        it('should request the previous or next month without onMonthChange, and cancel a move further away', async () => {
            const { props, focusRovingDay, getDay } = controlled({ value: day(2017, 2, 28) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect(props.onNextMonthChange).toHaveBeenCalledTimes(1);

            getDay(day(2017, 2, 28)).focus();
            await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
            expect(getDay(day(2017, 2, 28))).toHaveFocus();
            expect(props.onNextMonthChange).toHaveBeenCalledTimes(1);
        });

        it('should drop the key move when the parent ignores onMonthChange', async () => {
            const onMonthChange = vi.fn();
            const { props, focusRovingDay, render, getDay } = controlled({ onMonthChange });
            focusRovingDay();
            await userEvent.keyboard('{PageDown}');
            expect(onMonthChange).toHaveBeenCalledTimes(1);
            // The render that follows does not show the month.
            await render();

            // The month is shown later (e.g. with the month buttons): focus does not jump into the grid.
            screen.getByRole('button', { name: 'Before' }).focus();
            props.selectedMonth = day(2017, 3, 1);
            await render();
            expect(getDay(day(2017, 3, 22))).not.toHaveFocus();
        });
    });

    it('should tear down the keyboard navigation', async () => {
        const { focusRovingDay, getDay, detach } = setup({ value: day(2026, 11, 12) });
        focusRovingDay();
        detach();
        await userEvent.keyboard('{ArrowRight}');
        expect(getDay(day(2026, 11, 12))).toHaveFocus();
    });
});
