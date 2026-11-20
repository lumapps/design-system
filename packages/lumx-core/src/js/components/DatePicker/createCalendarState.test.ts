// @vitest-environment jsdom
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { getCalendarDate, getDateKey, isSameDay } from '../../utils/date/calendarDay';
import { getMonthCalendar } from '../../utils/date/getMonthCalendar';
import { parseLocale } from '../../utils/locale/parseLocale';
import type { Locale } from '../../utils/locale/types';
import { describeInTimeZones } from '../../../testing/timeZones';
import { createCalendarState, parseYear, type CalendarStateProps, type CalendarView } from './createCalendarState';

/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

/** Calendar grid markup of the `DatePicker` template (`fr` locale: Monday first), from the view. */
function renderGridContent(view: CalendarView, { minDate, maxDate }: CalendarStateProps) {
    const { weeks, weekDays } = getMonthCalendar(parseLocale('fr') as Locale, view.selectedMonth, minDate, maxDate);
    const rows = weeks.map(
        (week) =>
            `<div role="row">${weekDays
                .map(({ number }) => {
                    const { date, isOutOfRange } = week[number] || {};
                    if (!date) return '<div role="gridcell"></div>';
                    const isRoving = view.rovingDate && isSameDay(view.rovingDate, date);
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
    const props: CalendarStateProps = { locale: 'fr', ...initialProps };
    document.body.innerHTML = `<button>Before</button><div role="grid" aria-label="Calendar"></div>`;
    const grid = screen.getByRole('grid');
    const onUpdate = vi.fn();
    const state = createCalendarState({ getProps: () => props, onUpdate });
    let view = state.getView();
    grid.innerHTML = renderGridContent(view, props);
    const detach = state.attachGrid(grid);

    const render = () => {
        view = state.getView();
        grid.innerHTML = renderGridContent(view, props);
        state.afterRender();
        return view;
    };
    const getDay = (date: Date) => grid.querySelector<HTMLElement>(`[data-date="${getDateKey(date)}"]`) as HTMLElement;
    const focusRovingDay = () => (grid.querySelector('[tabindex="0"]') as HTMLElement).focus();
    return { props, state, onUpdate, render, getDay, focusRovingDay, detach, grid, getView: () => view };
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
            const { getView, render, onUpdate } = setup({ value: day(2026, 1, 31) });
            getView().handleNextMonth();
            expect(onUpdate).toHaveBeenCalled();
            expect(render().selectedMonth.getMonth()).toBe(1);
            getView().handlePreviousMonth();
            getView().handlePreviousMonth();
            const view = render();
            expect(view.selectedMonth.getFullYear()).toBe(2025);
            expect(view.selectedMonth.getMonth()).toBe(11);
            expect(view.selectedMonth.getDate()).toBe(1);
        });

        it('should set aria-live on the month label after the first month change only', async () => {
            const { render, getView } = setup({ value: day(2026, 11, 12) });
            expect(getView().monthLabelAriaLive).toBeUndefined();
            getView().handleNextMonth();
            expect(render().monthLabelAriaLive).toBe('polite');
            // Back on the first month: still set.
            getView().handlePreviousMonth();
            expect(render().monthLabelAriaLive).toBe('polite');
        });

        it('should show the month of a key move into another month and focus its day', async () => {
            const { focusRovingDay, render, getDay } = setup({ value: day(2026, 11, 30) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            const view = render();
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
            const view = render();
            expect(view.yearText).toBe('201');
            expect(view.selectedMonth.getFullYear()).toBe(2017);
        });

        it('should commit the typed year (Enter, blur)', async () => {
            const { state, render } = setup({ value: day(2017, 2, 22) });
            state.inputYear('2016', 'insertText');
            state.commitYear();
            const view = render();
            expect(view.selectedMonth.getFullYear()).toBe(2016);
            expect(view.selectedMonth.getMonth()).toBe(1);
            expect(view.yearText).toBe('2016');
        });

        it('should commit right away on the spin arrows', async () => {
            const { state, render } = setup({ value: day(2017, 2, 22) });
            // Chrome/Safari: no input type.
            state.inputYear('2018');
            expect(render().selectedMonth.getFullYear()).toBe(2018);
            // Firefox.
            state.inputYear('2019', 'insertReplacementText');
            expect(render().selectedMonth.getFullYear()).toBe(2019);
        });

        it.each(['', '0', '-5', '12345'])('should drop the invalid year "%s" and show the year again', async (text) => {
            const { state, render } = setup({ value: day(2017, 2, 22) });
            state.inputYear(text, 'insertText');
            state.commitYear();
            const view = render();
            expect(view.selectedMonth.getFullYear()).toBe(2017);
            expect(view.yearText).toBe('2017');
        });
    });

    describe('roving day', () => {
        it('should make a picked day the roving day, then call onChange', async () => {
            const onChange = vi.fn();
            const { getView, render } = setup({ value: day(2026, 11, 12), onChange });
            getView().handleDayPick(day(2026, 11, 3));
            expect(onChange).toHaveBeenCalledWith(day(2026, 11, 3));
            expect(render().rovingDate).toEqual(day(2026, 11, 3));
        });

        it('should reset the roving day when the value changes', async () => {
            const { props, focusRovingDay, render, getDay } = setup({ value: day(2026, 11, 12) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect(render().rovingDate).toEqual(day(2026, 11, 13));

            props.value = day(2026, 11, 20);
            const view = render();
            expect(view.rovingDate).toEqual(day(2026, 11, 20));
            expect(getDay(day(2026, 11, 20))).toHaveAttribute('tabindex', '0');

            // Back to the first value: the roving day stays reset.
            props.value = day(2026, 11, 12);
            expect(render().rovingDate).toEqual(day(2026, 11, 12));
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
            const { props, getView, render } = controlled();
            getView().handleNextMonth();
            expect(props.onNextMonthChange).toHaveBeenCalledTimes(1);
            getView().handlePreviousMonth();
            expect(props.onPrevMonthChange).toHaveBeenCalledTimes(1);
            // The parent holds the month.
            expect(render().selectedMonth).toEqual(day(2017, 2, 22));
            props.selectedMonth = day(2017, 3, 1);
            const view = render();
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
            render();
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
            render();

            // The month is shown later (e.g. with the month buttons): focus does not jump into the grid.
            screen.getByRole('button', { name: 'Before' }).focus();
            props.selectedMonth = day(2017, 3, 1);
            render();
            expect(getDay(day(2017, 3, 22))).not.toHaveFocus();
        });
    });

    describe('roving day resolution', () => {
        beforeEach(() => {
            vi.useFakeTimers({ toFake: ['Date'] });
            // Today, with a local time of day.
            vi.setSystemTime(new Date(2026, 10, 12, 15, 30));
        });
        afterEach(() => {
            vi.useRealTimers();
        });

        it('should use the selected date, else today', () => {
            expect(setup({ value: day(2026, 11, 20) }).getView().rovingDate).toEqual(day(2026, 11, 20));
            expect(setup({}).getView().rovingDate).toEqual(day(2026, 11, 12));
        });

        it('should limit to the range', () => {
            expect(setup({ minDate: day(2026, 11, 15) }).getView().rovingDate).toEqual(day(2026, 11, 15));
            expect(setup({ maxDate: day(2026, 11, 5) }).getView().rovingDate).toEqual(day(2026, 11, 5));
        });

        it('should use the same day number in another shown month (default month)', () => {
            expect(setup({ defaultMonth: day(2019, 7, 14) }).getView().rovingDate).toEqual(day(2019, 7, 12));
        });

        it('should move to the same day number after a month change (last day if missing)', () => {
            const { getView, render } = setup({ value: day(2026, 1, 31) });
            getView().handleNextMonth();
            expect(render().rovingDate).toEqual(day(2026, 2, 28));
        });

        it('should prefer the last roving day over the selected date', async () => {
            const { focusRovingDay, getView, render } = setup({ value: day(2026, 11, 3) });
            focusRovingDay();
            await userEvent.keyboard('{End}');
            expect(render().rovingDate).toEqual(day(2026, 11, 8));
            getView().handleNextMonth();
            expect(render().rovingDate).toEqual(day(2026, 12, 8));
        });

        it('should be undefined when no day of the shown month is in the range', () => {
            const { getView, render } = setup({ value: day(2026, 11, 20), maxDate: day(2026, 11, 30) });
            getView().handleNextMonth();
            expect(render().rovingDate).toBeUndefined();
        });

        it('should make a focused or clicked day the roving day, with one update', async () => {
            const { getDay, render, onUpdate } = setup({ value: day(2026, 11, 12) });
            onUpdate.mockClear();
            await userEvent.click(getDay(day(2026, 11, 3)));
            expect(onUpdate).toHaveBeenCalledTimes(1);
            expect(render().rovingDate).toEqual(day(2026, 11, 3));
        });
    });

    describe('keyboard', () => {
        it('should enter the grid on the roving day with Tab', async () => {
            const { getDay } = setup({ value: day(2026, 11, 12) });
            await userEvent.tab();
            await userEvent.tab();
            expect(getDay(day(2026, 11, 12))).toHaveFocus();
        });

        it('should move by day and by week in the shown month, and render the roving day', async () => {
            const { focusRovingDay, getDay, render } = setup({ value: day(2026, 11, 12) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect(getDay(day(2026, 11, 13))).toHaveFocus();
            render();
            expect(getDay(day(2026, 11, 12))).toHaveAttribute('tabindex', '-1');
            expect(getDay(day(2026, 11, 13))).toHaveAttribute('tabindex', '0');
            // The test render replaces the day buttons.
            focusRovingDay();
            await userEvent.keyboard('{ArrowDown}');
            expect(getDay(day(2026, 11, 20))).toHaveFocus();
            await userEvent.keyboard('{ArrowUp}{ArrowUp}');
            expect(getDay(day(2026, 11, 6))).toHaveFocus();
        });

        it('should cross week row edges to the previous or next day', async () => {
            // Sunday 15 is the last cell of its row (Monday first).
            const { focusRovingDay, getDay } = setup({ value: day(2026, 11, 15) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect(getDay(day(2026, 11, 16))).toHaveFocus();
            await userEvent.keyboard('{ArrowLeft}');
            expect(getDay(day(2026, 11, 15))).toHaveFocus();
        });

        it('should go to the first and last day of the week row with Home and End', async () => {
            const { focusRovingDay, getDay } = setup({ value: day(2026, 11, 12) });
            focusRovingDay();
            await userEvent.keyboard('{Home}');
            expect(getDay(day(2026, 11, 9))).toHaveFocus();
            await userEvent.keyboard('{End}');
            expect(getDay(day(2026, 11, 15))).toHaveFocus();
        });

        it('should go to the first and last day of the month with Ctrl+Home and Ctrl+End', async () => {
            const { focusRovingDay, getDay } = setup({ value: day(2026, 11, 12) });
            focusRovingDay();
            await userEvent.keyboard('{Control>}{Home}{/Control}');
            expect(getDay(day(2026, 11, 1))).toHaveFocus();
            await userEvent.keyboard('{Control>}{End}{/Control}');
            expect(getDay(day(2026, 11, 30))).toHaveFocus();
        });

        it('should cross the month edge by day and by week', async () => {
            const { focusRovingDay, getDay, render } = setup({ value: day(2026, 11, 26) });
            focusRovingDay();
            // Thursday 26 => Thursday December 3.
            await userEvent.keyboard('{ArrowDown}');
            expect(render().selectedMonth.getMonth()).toBe(11);
            expect(getDay(day(2026, 12, 3))).toHaveFocus();
            await userEvent.keyboard('{ArrowUp}');
            render();
            expect(getDay(day(2026, 11, 26))).toHaveFocus();
            await userEvent.keyboard('{Control>}{Home}{/Control}{ArrowLeft}');
            render();
            expect(getDay(day(2026, 10, 31))).toHaveFocus();
        });

        it('should move by month and by year with Page Up and Page Down (last day if missing)', async () => {
            const { focusRovingDay, getDay, render } = setup({ value: day(2024, 1, 31) });
            focusRovingDay();
            await userEvent.keyboard('{PageDown}');
            render();
            expect(getDay(day(2024, 2, 29))).toHaveFocus();
            await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
            render();
            expect(getDay(day(2025, 2, 28))).toHaveFocus();
            await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
            render();
            await userEvent.keyboard('{PageUp}');
            render();
            expect(getDay(day(2024, 1, 28))).toHaveFocus();
        });

        it('should not move to a day out of the range', async () => {
            // maxDate is Friday 20: Down on Tuesday 17 targets Tuesday 24.
            const { focusRovingDay, getDay, onUpdate } = setup({
                value: day(2026, 11, 17),
                minDate: day(2026, 11, 1),
                maxDate: day(2026, 11, 20),
            });
            focusRovingDay();
            await userEvent.keyboard('{ArrowDown}');
            expect(getDay(day(2026, 11, 17))).toHaveFocus();
            await userEvent.keyboard('{End}');
            expect(getDay(day(2026, 11, 20))).toHaveFocus();
            onUpdate.mockClear();
            await userEvent.keyboard('{ArrowRight}{PageDown}{Shift>}{PageUp}{/Shift}');
            expect(getDay(day(2026, 11, 20))).toHaveFocus();
            await userEvent.keyboard('{Control>}{Home}{/Control}{ArrowLeft}{ArrowUp}{PageUp}');
            expect(getDay(day(2026, 11, 1))).toHaveFocus();
            // Only the roving day change of Ctrl+Home: no month change.
            expect(onUpdate).toHaveBeenCalledTimes(1);
        });

        it('should consume the grid keys, and let the other keys propagate', async () => {
            const { focusRovingDay } = setup({ value: day(2026, 11, 12), maxDate: day(2026, 11, 12) });
            const onKeyDown = vi.fn();
            document.body.addEventListener('keydown', onKeyDown);
            focusRovingDay();
            // Right and Page Down do not move (out of the range) but are consumed.
            await userEvent.keyboard('{ArrowRight}{PageDown}{Home}');
            expect(onKeyDown).not.toHaveBeenCalled();
            await userEvent.keyboard('{Control>}{ArrowRight}{/Control}');
            expect(onKeyDown).toHaveBeenCalled();
            document.body.removeEventListener('keydown', onKeyDown);
        });

        it('should drop the pending move on a newer move', async () => {
            const onMonthChange = vi.fn();
            const { props, focusRovingDay, getDay, render } = setup({
                value: day(2026, 11, 12),
                selectedMonth: day(2026, 11, 1),
                onMonthChange,
            });
            focusRovingDay();
            await userEvent.keyboard('{PageDown}{ArrowLeft}');
            expect(getDay(day(2026, 11, 11))).toHaveFocus();
            props.selectedMonth = day(2026, 12, 1);
            render();
            expect(getDay(day(2026, 12, 12))).not.toHaveFocus();
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
