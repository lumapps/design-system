import { getCalendarTargetDate, type CalendarMove } from '../../utils/date/getCalendarTargetDate';
import { getDateKey, parseDateKey } from '../../utils/date/calendarDay';
import { setupRovingTabIndex } from '../../utils/focusNavigation/setupRovingTabIndex';
import type { GridFocusNavigationController, GridNavigationDirection } from '../../utils/focusNavigation/types';
import {
    CALENDAR_CELL_DISABLED_SELECTOR,
    CALENDAR_CELL_SELECTOR,
    CALENDAR_ROW_SELECTOR,
    DATE_ATTRIBUTE,
} from './constants';

/** Options of {@link setupCalendarGrid}. */
export interface CalendarGridOptions {
    /** The calendar grid element (`role="grid"`). */
    grid: HTMLElement;
    /**
     * Read the current range (called on each key move: the target day of another month is not rendered yet, so the
     * range is not read from the DOM).
     */
    getRange?(): { minDate?: Date; maxDate?: Date };
    /**
     * Called when the roving day changes: a key move (in the shown month or into another month), a day click.
     * The wrapper stores it and renders it as the roving day (see `getRovingDate` and the `rovingDate` prop of the
     * `DatePicker` template).
     */
    onRovingDateChange?(date: Date): void;
    /**
     * Called when a key move targets a day of another month: show the month of `date`. The wrapper re-renders the
     * grid, then calls {@link CalendarGridHandle.flushPendingNavigation}, which focuses the target day.
     *
     * Return `false` when the wrapper cannot show that month: the move is canceled (no roving day change, no
     * pending move).
     */
    onMonthChange(date: Date): boolean | void;
}

/** Handle returned by {@link setupCalendarGrid}. */
export interface CalendarGridHandle {
    /**
     * Replay the pending key move (the target day of another month). Call it after each render of the grid.
     * No-op when nothing is pending. The move stays pending while its day is not rendered.
     */
    flushPendingNavigation(): void;
    /** Drop the pending key move (e.g. the month was not shown by the render that followed `onMonthChange`). */
    cancelPendingNavigation(): void;
}

/** Grid boundary direction to the day move. */
const BOUNDARY_MOVES: Record<GridNavigationDirection, CalendarMove> = {
    left: 'previousDay',
    right: 'nextDay',
    up: 'previousWeek',
    down: 'nextWeek',
};

/**
 * Set up the calendar grid layer (date logic only) on the `role="grid"` element of the `DatePicker` template.
 *
 * - Roving tabindex in grid mode (`setupRovingTabIndex`): arrows, Home/End (week row), Ctrl+Home/Ctrl+End.
 *   Focus skips the out-of-range days (native `disabled`) and the blank cells.
 * - Arrows past the edges of the shown days (`onBoundary`): ±1 day, ±7 days into the previous or next month.
 * - Page Up/Page Down: same day number in the previous or next month (last day if missing); with Shift: in the
 *   previous or next year.
 * - A move whose target day is out of the range does not move focus (APG grid).
 * - A move into another month calls `onMonthChange`; the wrapper renders the month, then calls
 *   `flushPendingNavigation()` to focus the target day.
 *
 * Internal to `createCalendarState`, which renders the state and calls the handle after each render.
 *
 * The roving day is rendered by the template (`tabindex="0"`, see `getRovingDate`): the wrapper keeps it in its
 * state, updated by `onRovingDateChange`. The grid navigation only moves focus (`tabStop: 'rendered'`).
 *
 * Torn down when `signal` is aborted.
 */
export function setupCalendarGrid(options: CalendarGridOptions, signal: AbortSignal): CalendarGridHandle {
    const { grid, getRange, onRovingDateChange, onMonthChange } = options;

    const getDayButton = (date: Date) => grid.querySelector<HTMLElement>(`[${DATE_ATTRIBUTE}="${getDateKey(date)}"]`);
    const getCellDate = (cell: Element | null | undefined) =>
        parseDateKey(cell instanceof HTMLElement ? cell.getAttribute(DATE_ATTRIBUTE) : undefined);

    let navigation: GridFocusNavigationController;
    /** Target day of the pending key move (into another month). */
    let pendingDate: Date | undefined;

    /** Focus the day of `date`, showing its month first when it is not rendered. */
    function focusDate(date: Date) {
        if (getDayButton(date)) {
            pendingDate = undefined;
            navigation.goTo(() => getDayButton(date));
            return;
        }
        // The wrapper cannot show the month: no move.
        if (onMonthChange(date) === false) return;
        onRovingDateChange?.(date);
        pendingDate = date;
        // Read `pendingDate` on replay: a canceled move resolves to nothing.
        navigation.goTo(() => (pendingDate ? getDayButton(pendingDate) : null));
    }

    /** Move from the day of `cell` (no move when the target is out of the range). */
    function move(cell: Element | null | undefined, calendarMove: CalendarMove): boolean {
        const date = getCellDate(cell);
        if (!date) return false;
        const target = getCalendarTargetDate(date, calendarMove, getRange?.());
        if (!target) return false;
        focusDate(target);
        return true;
    }

    navigation = setupRovingTabIndex(
        {
            type: 'grid',
            container: grid,
            rowSelector: CALENDAR_ROW_SELECTOR,
            cellSelector: CALENDAR_CELL_SELECTOR,
            cellDisabledSelector: CALENDAR_CELL_DISABLED_SELECTOR,
            // The template renders the roving day (`tabindex="0"`).
            tabStop: 'rendered',
            onBoundary: (direction, activeCell) => move(activeCell, BOUNDARY_MOVES[direction]),
            onItemFocused(item) {
                const date = getCellDate(item);
                if (date) onRovingDateChange?.(date);
            },
        },
        signal,
    );

    // Page Up / Page Down (Shift: year). Not handled by the grid navigation (the event propagates).
    grid.addEventListener(
        'keydown',
        (evt: KeyboardEvent) => {
            if ((evt.key !== 'PageUp' && evt.key !== 'PageDown') || evt.altKey || evt.ctrlKey || evt.metaKey) return;
            const target = evt.target instanceof Element ? evt.target.closest(`[${DATE_ATTRIBUTE}]`) : null;
            const cell = target && grid.contains(target) ? target : null;
            const isNext = evt.key === 'PageDown';
            const yearMove = isNext ? 'nextYear' : 'previousYear';
            const monthMove = isNext ? 'nextMonth' : 'previousMonth';
            move(cell, evt.shiftKey ? yearMove : monthMove);
            // Consume the key even when focus does not move (no page scroll in the dialog).
            evt.preventDefault();
            evt.stopPropagation();
        },
        { signal },
    );

    // A day click (or tap) makes it the roving day.
    grid.addEventListener(
        'click',
        (evt: MouseEvent) => {
            const cell = evt.target instanceof Element ? evt.target.closest(`[${DATE_ATTRIBUTE}]`) : null;
            const date = cell && grid.contains(cell) ? getCellDate(cell) : undefined;
            if (date) onRovingDateChange?.(date);
        },
        { signal },
    );

    return {
        flushPendingNavigation() {
            navigation.flushPendingNavigation();
        },
        cancelPendingNavigation() {
            pendingDate = undefined;
        },
    };
}
