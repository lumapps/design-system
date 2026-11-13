// @vitest-environment jsdom
import { getByRole, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { getCalendarDate, getDateKey, isSameDay } from '../../utils/date/calendarDay';
import { getMonthCalendar } from '../../utils/date/getMonthCalendar';
import { parseLocale } from '../../utils/locale/parseLocale';
import type { Locale } from '../../utils/locale/types';
import { getRovingDate } from './getRovingDate';
import { setupCalendarGrid } from './setupCalendarGrid';

/** Calendar date (month is 1-based for readability). */
const day = (year: number, month: number, date: number) => getCalendarDate(year, month - 1, date);

/** Let the MutationObserver callbacks run. */
const flushObservers = () =>
    new Promise((resolve) => {
        setTimeout(resolve, 0);
    });

interface CalendarState {
    month: Date;
    rovingDate?: Date;
    value?: Date;
    minDate?: Date;
    maxDate?: Date;
}

/** Calendar grid markup of the `DatePicker` template (Monday first, `fr` locale). */
function renderGridContent(state: CalendarState) {
    const { weeks, weekDays } = getMonthCalendar(
        parseLocale('fr') as Locale,
        state.month,
        state.minDate,
        state.maxDate,
    );
    const rovingDate = getRovingDate({ ...state, month: state.month });
    const header = `<div role="row" class="lumx-date-picker__week-days">${weekDays
        .map(({ long }) => `<div role="columnheader" class="lumx-date-picker__day-wrapper">${long}</div>`)
        .join('')}</div>`;
    const rows = weeks.map(
        (week) =>
            `<div role="row" class="lumx-date-picker__month-days">${weekDays
                .map(({ number }) => {
                    const { date, isOutOfRange } = week[number] || {};
                    if (!date) return '<div role="gridcell" class="lumx-date-picker__day-wrapper"></div>';
                    const isRoving = rovingDate && isSameDay(rovingDate, date);
                    return `<button role="gridcell" class="lumx-date-picker__month-day" data-date="${getDateKey(date)}"
                        tabindex="${isRoving ? 0 : -1}" ${isOutOfRange ? 'disabled' : ''}>${date.getDate()}</button>`;
                })
                .join('')}</div>`,
    );
    return header + rows.join('');
}

/**
 * Render a calendar grid with a framework-like state: `onMonthChange` and `onRovingDateChange` update the state,
 * `rerender()` renders it and flushes the pending navigation (as the wrappers must do after a render).
 */
function setup(initialState: CalendarState) {
    const state: CalendarState = { ...initialState };
    document.body.innerHTML = `<button>Before</button><div role="grid" aria-label="Calendar"></div>`;
    const grid = screen.getByRole('grid');
    grid.innerHTML = renderGridContent(state);

    const onMonthChange = vi.fn((date: Date): boolean | void => {
        state.month = date;
    });
    const onRovingDateChange = vi.fn((date: Date) => {
        state.rovingDate = date;
    });
    const controller = new AbortController();
    const handle = setupCalendarGrid(
        {
            grid,
            getRange: () => ({ minDate: state.minDate, maxDate: state.maxDate }),
            onMonthChange,
            onRovingDateChange,
        },
        controller.signal,
    );

    /** Re-render the month (when it changed), then flush the pending navigation. */
    const rerender = async () => {
        grid.innerHTML = renderGridContent(state);
        await flushObservers();
        handle.flushPendingNavigation();
    };
    const getDay = (date: Date) => grid.querySelector<HTMLElement>(`[data-date="${getDateKey(date)}"]`) as HTMLElement;
    /** Focus the rendered roving day (as Tab into the grid does). */
    const focusRovingDay = () => (grid.querySelector('[tabindex="0"]') as HTMLElement).focus();
    return { state, grid, onMonthChange, onRovingDateChange, rerender, getDay, focusRovingDay, controller, handle };
}

describe(setupCalendarGrid, () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should enter the grid on the roving day with Tab', async () => {
        const { getDay } = setup({ month: day(2026, 11, 1), value: day(2026, 11, 12) });
        await userEvent.tab();
        await userEvent.tab();
        expect(getDay(day(2026, 11, 12))).toHaveFocus();
    });

    describe('in the shown month', () => {
        it('should move by day and by week and report the roving day', async () => {
            const { focusRovingDay, getDay, onRovingDateChange, onMonthChange } = setup({
                month: day(2026, 11, 1),
                value: day(2026, 11, 12),
            });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect(getDay(day(2026, 11, 13))).toHaveFocus();
            expect(onRovingDateChange).toHaveBeenLastCalledWith(day(2026, 11, 13));
            await userEvent.keyboard('{ArrowDown}');
            expect(getDay(day(2026, 11, 20))).toHaveFocus();
            await userEvent.keyboard('{ArrowUp}{ArrowUp}');
            expect(getDay(day(2026, 11, 6))).toHaveFocus();
            expect(onMonthChange).not.toHaveBeenCalled();
        });

        it('should not write the tab stop (the template renders it)', async () => {
            const { focusRovingDay, getDay, rerender } = setup({ month: day(2026, 11, 1), value: day(2026, 11, 12) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect(getDay(day(2026, 11, 13))).toHaveFocus();
            expect(getDay(day(2026, 11, 12))).toHaveAttribute('tabindex', '0');
            expect(getDay(day(2026, 11, 13))).toHaveAttribute('tabindex', '-1');
            // The wrapper renders the reported roving day.
            await rerender();
            expect(getDay(day(2026, 11, 12))).toHaveAttribute('tabindex', '-1');
            expect(getDay(day(2026, 11, 13))).toHaveAttribute('tabindex', '0');
        });

        it('should cross week row edges to the previous or next day', async () => {
            // Sunday 15 is the last cell of its row (Monday first).
            const { focusRovingDay, getDay } = setup({ month: day(2026, 11, 1), value: day(2026, 11, 15) });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect(getDay(day(2026, 11, 16))).toHaveFocus();
            await userEvent.keyboard('{ArrowLeft}');
            expect(getDay(day(2026, 11, 15))).toHaveFocus();
        });

        it('should go to the first and last day of the week row with Home and End', async () => {
            const { focusRovingDay, getDay } = setup({ month: day(2026, 11, 1), value: day(2026, 11, 12) });
            focusRovingDay();
            await userEvent.keyboard('{Home}');
            expect(getDay(day(2026, 11, 9))).toHaveFocus();
            await userEvent.keyboard('{End}');
            expect(getDay(day(2026, 11, 15))).toHaveFocus();
        });
    });

    describe('into another month', () => {
        it('should cross the month edge by day', async () => {
            const { focusRovingDay, getDay, onMonthChange, onRovingDateChange, rerender } = setup({
                month: day(2026, 11, 1),
                value: day(2026, 11, 30),
            });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}');
            expect(onMonthChange).toHaveBeenCalledWith(day(2026, 12, 1));
            expect(onRovingDateChange).toHaveBeenLastCalledWith(day(2026, 12, 1));
            await rerender();
            expect(getDay(day(2026, 12, 1))).toHaveFocus();
            expect(getDay(day(2026, 12, 1))).toHaveAttribute('tabindex', '0');

            await userEvent.keyboard('{ArrowLeft}');
            expect(onMonthChange).toHaveBeenLastCalledWith(day(2026, 11, 30));
            await rerender();
            expect(getDay(day(2026, 11, 30))).toHaveFocus();
        });

        it('should cross the month edge by week (past the last row or onto a blank cell)', async () => {
            const { focusRovingDay, getDay, onMonthChange, rerender } = setup({
                month: day(2026, 11, 1),
                value: day(2026, 11, 26),
            });
            focusRovingDay();
            // Thursday 26 => Thursday December 3 (the cell below Thursday 26 is blank).
            await userEvent.keyboard('{ArrowDown}');
            expect(onMonthChange).toHaveBeenCalledWith(day(2026, 12, 3));
            await rerender();
            expect(getDay(day(2026, 12, 3))).toHaveFocus();
            // Thursday December 3 => Thursday November 26 (past the first row).
            await userEvent.keyboard('{ArrowUp}');
            await rerender();
            expect(getDay(day(2026, 11, 26))).toHaveFocus();
        });

        it('should move by month with Page Up and Page Down (last day if missing)', async () => {
            const { focusRovingDay, getDay, onMonthChange, rerender } = setup({
                month: day(2026, 1, 1),
                value: day(2026, 1, 31),
            });
            focusRovingDay();
            await userEvent.keyboard('{PageDown}');
            expect(onMonthChange).toHaveBeenLastCalledWith(day(2026, 2, 28));
            await rerender();
            expect(getDay(day(2026, 2, 28))).toHaveFocus();
            await userEvent.keyboard('{PageUp}');
            await rerender();
            expect(getDay(day(2026, 1, 28))).toHaveFocus();
        });

        it('should move by year with Shift+Page Up and Shift+Page Down', async () => {
            const { focusRovingDay, getDay, onMonthChange, rerender } = setup({
                month: day(2024, 2, 1),
                value: day(2024, 2, 29),
            });
            focusRovingDay();
            await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
            expect(onMonthChange).toHaveBeenLastCalledWith(day(2025, 2, 28));
            await rerender();
            expect(getDay(day(2025, 2, 28))).toHaveFocus();
            await userEvent.keyboard('{Shift>}{PageUp}{/Shift}');
            await rerender();
            expect(getDay(day(2024, 2, 28))).toHaveFocus();
        });

        it('should cancel the move when the month cannot be shown (no pending move)', async () => {
            const { state, focusRovingDay, getDay, onMonthChange, onRovingDateChange, rerender } = setup({
                month: day(2026, 11, 1),
                value: day(2026, 11, 12),
            });
            onMonthChange.mockImplementation(() => false);
            focusRovingDay();
            await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
            expect(onMonthChange).toHaveBeenCalledWith(day(2027, 11, 12));
            expect(onRovingDateChange).not.toHaveBeenCalled();
            expect(getDay(day(2026, 11, 12))).toHaveFocus();

            // The month is shown later (e.g. with the month buttons): focus does not jump into the grid.
            document.body.querySelector('button')?.focus();
            state.month = day(2027, 11, 1);
            await rerender();
            expect(getDay(day(2027, 11, 12))).not.toHaveFocus();
        });

        it('should drop the pending move on cancel', async () => {
            const { state, focusRovingDay, getDay, rerender, handle } = setup({
                month: day(2026, 11, 1),
                value: day(2026, 11, 12),
            });
            focusRovingDay();
            await userEvent.keyboard('{PageDown}');
            handle.cancelPendingNavigation();
            document.body.querySelector('button')?.focus();
            state.month = day(2026, 12, 1);
            await rerender();
            expect(getDay(day(2026, 12, 12))).not.toHaveFocus();
        });

        it('should drop the pending move on a newer move', async () => {
            const { state, focusRovingDay, getDay, onMonthChange, rerender } = setup({
                month: day(2026, 11, 1),
                value: day(2026, 11, 12),
            });
            // The parent ignores the month change.
            onMonthChange.mockImplementation(() => undefined);
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}{PageDown}');
            expect(getDay(day(2026, 11, 13))).toHaveFocus();
            // A move in the shown month wins over the pending move.
            await userEvent.keyboard('{ArrowLeft}');
            expect(getDay(day(2026, 11, 12))).toHaveFocus();
            state.month = day(2026, 12, 1);
            await rerender();
            expect(getDay(day(2026, 12, 13))).not.toHaveFocus();
        });

        it('should consume Page Up and Page Down', async () => {
            const { focusRovingDay, grid } = setup({ month: day(2026, 11, 1), value: day(2026, 11, 12) });
            const onKeyDown = vi.fn();
            document.body.addEventListener('keydown', onKeyDown);
            focusRovingDay();
            await userEvent.keyboard('{PageDown}');
            expect(onKeyDown).not.toHaveBeenCalled();
            document.body.removeEventListener('keydown', onKeyDown);
            expect(grid).toBeInTheDocument();
        });
    });

    describe('range edge', () => {
        it('should not move to a disabled day (no clamp to the range edge)', async () => {
            // maxDate is Friday 20: Down on Tuesday 17 targets Tuesday 24 (disabled).
            const { focusRovingDay, getDay, onMonthChange } = setup({
                month: day(2026, 11, 1),
                value: day(2026, 11, 17),
                maxDate: day(2026, 11, 20),
            });
            focusRovingDay();
            await userEvent.keyboard('{ArrowDown}');
            expect(getDay(day(2026, 11, 17))).toHaveFocus();
            // Right still reaches Friday 20.
            await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
            expect(getDay(day(2026, 11, 20))).toHaveFocus();
            await userEvent.keyboard('{ArrowRight}');
            expect(getDay(day(2026, 11, 20))).toHaveFocus();
            expect(onMonthChange).not.toHaveBeenCalled();
        });

        it('should not move to another month out of the range', async () => {
            const { focusRovingDay, getDay, onMonthChange } = setup({
                month: day(2026, 11, 1),
                value: day(2026, 11, 30),
                maxDate: day(2026, 11, 30),
                minDate: day(2026, 11, 1),
            });
            focusRovingDay();
            await userEvent.keyboard('{ArrowRight}{PageDown}{Shift>}{PageUp}{/Shift}');
            expect(getDay(day(2026, 11, 30))).toHaveFocus();
            expect(onMonthChange).not.toHaveBeenCalled();
            // From the first day, to the previous month.
            await userEvent.keyboard('{Control>}{Home}{/Control}');
            expect(getDay(day(2026, 11, 1))).toHaveFocus();
            await userEvent.keyboard('{ArrowLeft}{ArrowUp}{PageUp}');
            expect(getDay(day(2026, 11, 1))).toHaveFocus();
            expect(onMonthChange).not.toHaveBeenCalled();
        });
    });

    it('should report a clicked day as the roving day', async () => {
        const { getDay, onRovingDateChange } = setup({ month: day(2026, 11, 1), value: day(2026, 11, 12) });
        await userEvent.click(getDay(day(2026, 11, 3)));
        expect(onRovingDateChange).toHaveBeenLastCalledWith(day(2026, 11, 3));
    });

    it('should keep the rendered roving day after a month change with the buttons', async () => {
        const { state, grid, rerender } = setup({ month: day(2026, 11, 1), rovingDate: day(2026, 11, 30) });
        state.month = day(2027, 2, 1);
        await rerender();
        const tabStops = grid.querySelectorAll('[tabindex="0"]');
        expect(tabStops).toHaveLength(1);
        expect(getByRole(grid, 'gridcell', { name: '28' })).toHaveAttribute('tabindex', '0');
    });

    it('should tear down on abort', async () => {
        const { focusRovingDay, getDay, controller } = setup({ month: day(2026, 11, 1), value: day(2026, 11, 12) });
        focusRovingDay();
        controller.abort();
        await userEvent.keyboard('{ArrowRight}');
        expect(getDay(day(2026, 11, 12))).toHaveFocus();
    });
});
