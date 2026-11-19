import {
    addMonthResetDay,
    getCalendarDate,
    getDateKey,
    getDaysInMonth,
    isDateValid,
    isSameDay,
    parseDateKey,
    snapDateToRange,
    toCalendarDate,
} from '../../utils/date/calendarDay';
import { getCalendarTargetDate, type CalendarMove } from '../../utils/date/getCalendarTargetDate';
import { getWeekDays } from '../../utils/date/getWeekDays';
import { getCurrentLocale } from '../../utils/locale/getCurrentLocale';
import { parseLocale } from '../../utils/locale/parseLocale';
import type { Locale } from '../../utils/locale/types';
import { DATE_ATTRIBUTE } from './constants';

/** Lowest year accepted by the year input. */
const MIN_YEAR = 1;
/** Highest year accepted by the year input. */
const MAX_YEAR = 9999;

/** Props read by the calendar state (the latest props of the wrapper). */
export interface CalendarStateProps {
    /** Locale (language or region) to use. Default: the current locale. */
    locale?: string;
    /** Selected date. */
    value?: Date;
    /** Month shown first when there is no `value` (internal shown month only). */
    defaultMonth?: Date;
    /** Date before which days are out of range. */
    minDate?: Date;
    /** Date after which days are out of range. */
    maxDate?: Date;
    /** Day pick. */
    onChange?(date: Date): void;
    /**
     * Controlled shown month. When set, the parent holds the shown month: the state requests the changes with
     * `onMonthChange` (else `onPrevMonthChange` / `onNextMonthChange` for the previous or next month).
     * When not set, the state holds the shown month.
     */
    selectedMonth?: Date;
    /** Controlled shown month: previous month request. */
    onPrevMonthChange?(): void;
    /** Controlled shown month: next month request. */
    onNextMonthChange?(): void;
    /** Controlled shown month: request any month. Without it, there is no year input. */
    onMonthChange?(month: Date): void;
}

/** Options of {@link createCalendarState}. */
export interface CalendarStateOptions {
    /** Read the latest props. */
    getProps(): CalendarStateProps;
    /** Called when the state changes: the wrapper renders again. */
    onUpdate(): void;
}

/** What the wrapper renders (props of the `DatePicker` template). */
export interface CalendarView {
    /** The locale (the `locale` prop, else the current locale). */
    locale: string;
    /** The shown month. */
    selectedMonth: Date;
    /** The selected date, when valid. */
    value?: Date;
    /**
     * The roving day: the day of the shown month with `tabindex="0"`. `undefined` when no day of the shown month is
     * in the range.
     */
    rovingDate?: Date;
    /** `aria-live` of the month label: set after the first month change. */
    monthLabelAriaLive?: 'polite';
    /** Text of the year input. `undefined`: no year input. */
    yearText?: string;
    /** Previous month button. */
    handlePreviousMonth(): void;
    /** Next month button. */
    handleNextMonth(): void;
    /** Day pick: it becomes the roving day, then `onChange`. */
    handleDayPick(date: Date): void;
}

/** Calendar state of the `DatePicker` (see {@link createCalendarState}). */
export interface CalendarState {
    /** Read the view to render. Call it on each render (it reads the latest props). */
    getView(): CalendarView;
    /**
     * Year input change. `inputType` is the `InputEvent.inputType`: a change without it (spin arrows in
     * Chrome/Safari) or with `insertReplacementText` (Firefox) commits the year right away.
     */
    inputYear(text: string, inputType?: string): void;
    /** Commit the year input text (Enter, blur). An invalid year is dropped and the shown year comes back. */
    commitYear(): void;
    /** Set up the keyboard navigation on the calendar grid element. Returns the teardown. */
    attachGrid(grid: HTMLElement): () => void;
    /** Call after each render (React: effect without deps, Vue: `onUpdated`). */
    afterRender(): void;
}

/** Month number, to compare months. */
const getMonthKey = (date: Date) => date.getFullYear() * 12 + date.getMonth();

/** Parse the year input text. `undefined` when not a whole year in the accepted range. */
export function parseYear(text: string): number | undefined {
    const trimmed = text.trim();
    if (!/^\d+$/.test(trimmed)) return undefined;
    const year = Number(trimmed);
    return year >= MIN_YEAR && year <= MAX_YEAR ? year : undefined;
}

/** First shown month: the value, else the default month, else today (warns on an invalid date). */
function getInitialMonth({ value, defaultMonth }: CalendarStateProps) {
    const referenceDate = value || defaultMonth || new Date();
    if (isDateValid(referenceDate)) return referenceDate;
    // eslint-disable-next-line no-console
    console.warn(`[@lumx/DatePicker] Invalid date provided ${referenceDate}`);
    return new Date();
}

/**
 * Resolve the roving day in the shown month (SPEC 5.3): the base day (the last roving day, else the selected date,
 * else today) if it is in the shown month, else the same day number in the shown month (its last day if the day
 * does not exist); then snapped to the range. `undefined` when no day of the shown month is in the range.
 */
function resolveRovingDate(month: Date, base: Date, minDate?: Date, maxDate?: Date) {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const day =
        getMonthKey(base) === getMonthKey(month)
            ? toCalendarDate(base)
            : getCalendarDate(year, monthIndex, Math.min(base.getDate(), getDaysInMonth(year, monthIndex)));
    const snapped = snapDateToRange(day, minDate, maxDate);
    return getMonthKey(snapped) === getMonthKey(month) ? snapped : undefined;
}

/** Calendar move of a key on a day of the grid (APG date picker dialog). `undefined`: not a grid key. */
function getKeyMove({ key, altKey, ctrlKey, metaKey, shiftKey }: KeyboardEvent): CalendarMove | undefined {
    if (altKey || metaKey) return undefined;
    if (key === 'PageUp' || key === 'PageDown') {
        if (ctrlKey) return undefined;
        if (shiftKey) return key === 'PageUp' ? 'previousYear' : 'nextYear';
        return key === 'PageUp' ? 'previousMonth' : 'nextMonth';
    }
    if (shiftKey) return undefined;
    if (ctrlKey) {
        if (key === 'Home') return 'monthStart';
        if (key === 'End') return 'monthEnd';
        return undefined;
    }
    const moves: Record<string, CalendarMove> = {
        ArrowLeft: 'previousDay',
        ArrowRight: 'nextDay',
        ArrowUp: 'previousWeek',
        ArrowDown: 'nextWeek',
        Home: 'weekStart',
        End: 'weekEnd',
    };
    return Object.prototype.hasOwnProperty.call(moves, key) ? moves[key] : undefined;
}

/**
 * Create the calendar state of the `DatePicker` (framework-agnostic): shown month, roving day, year input text,
 * month label `aria-live`, and the keyboard navigation of the calendar grid.
 *
 * Keyboard navigation (on the day buttons of the grid, APG date picker dialog):
 * - Arrows: ±1 day, ±7 days. Home/End: first/last day of the week row. Ctrl+Home/Ctrl+End: first/last day of the
 *   month. Page Up/Page Down: same day number in the previous or next month (last day if missing); with Shift: in
 *   the previous or next year.
 * - A move to a day out of the range does not move focus. Home/End and Ctrl+Home/Ctrl+End stop at the range edge.
 * - A move into another month shows that month, then focuses the target day after the render. A controlled shown
 *   month that the parent does not change drops the move.
 * - The grid consumes these keys even when focus does not move (no page scroll in the dialog).
 *
 * The wrappers keep a thin bridge: render `getView()` on each `onUpdate`, call `attachGrid` on mount and
 * `afterRender` after each render.
 */
export function createCalendarState({ getProps, onUpdate }: CalendarStateOptions): CalendarState {
    const getLocale = () => getProps().locale || getCurrentLocale();

    /** Shown month held by the state (when `selectedMonth` is not set). */
    let internalMonth: Date | undefined;
    const getMonth = () => {
        const { selectedMonth } = getProps();
        if (selectedMonth) return selectedMonth;
        if (!internalMonth) internalMonth = getInitialMonth(getProps());
        return internalMonth;
    };

    const getValueTime = () => getProps().value?.getTime();
    /** Last roving day, with the value it was set for (the selected date wins again when it changes). */
    let roving: { date: Date; valueTime?: number } | undefined;
    const getLastRoving = () => (roving && Object.is(roving.valueTime, getValueTime()) ? roving.date : undefined);
    const setRoving = (date: Date) => {
        const last = getLastRoving();
        if (last && isSameDay(last, date)) return;
        roving = { date, valueTime: getValueTime() };
        onUpdate();
    };
    const getRovingDate = () => {
        const { value, minDate, maxDate } = getProps();
        const base = getLastRoving() || (value && isDateValid(value) ? value : new Date());
        return resolveRovingDate(getMonth(), base, minDate, maxDate);
    };

    const initialMonthKey = getMonthKey(getMonth());
    let monthChanged = false;
    const hasMonthChanged = () => monthChanged || getMonthKey(getMonth()) !== initialMonthKey;

    /** Year input text typed while the shown year was `year`. */
    let yearDraft: { text: string; year: number } | undefined;
    const getYearText = () => {
        const year = getMonth().getFullYear();
        return yearDraft && yearDraft.year === year ? yearDraft.text : String(year);
    };

    let gridElement: HTMLElement | undefined;
    const getDayButton = (date: Date) =>
        gridElement?.querySelector<HTMLElement>(`[${DATE_ATTRIBUTE}="${getDateKey(date)}"]`);
    /**
     * Day to focus after the render that shows its month (key move into another month). `viewed`: a render read the
     * view since the request; its `afterRender` focuses the day, or drops the move when the month is not shown.
     */
    let pendingFocus: { date: Date; viewed: boolean } | undefined;

    /** Show a month. Returns `false` when it cannot be shown. */
    function requestMonth(month: Date): boolean {
        const props = getProps();
        if (!props.selectedMonth) {
            internalMonth = month;
        } else if (props.onMonthChange) {
            props.onMonthChange(month);
        } else {
            // Only the previous or next month can be requested.
            const offset = getMonthKey(month) - getMonthKey(props.selectedMonth);
            if (offset === 1) props.onNextMonthChange?.();
            else if (offset === -1) props.onPrevMonthChange?.();
            else return false;
        }
        onUpdate();
        return true;
    }

    /** Focus the day of `date`, showing its month first when it is not rendered. */
    function focusDate(date: Date) {
        const button = getDayButton(date);
        if (button) {
            pendingFocus = undefined;
            button.focus();
            return;
        }
        if (!requestMonth(date)) return;
        setRoving(date);
        pendingFocus = { date, viewed: false };
    }

    function moveMonth(offset: 1 | -1) {
        const props = getProps();
        if (!props.selectedMonth) {
            internalMonth = addMonthResetDay(getMonth(), offset);
            onUpdate();
        } else if (offset === 1) props.onNextMonthChange?.();
        else props.onPrevMonthChange?.();
    }
    const previousMonth = () => moveMonth(-1);
    const nextMonth = () => moveMonth(1);

    function pickDay(date: Date) {
        setRoving(date);
        getProps().onChange?.(date);
    }

    function commitYear() {
        const text = getYearText();
        yearDraft = undefined;
        const year = parseYear(text);
        const month = getMonth();
        if (year === undefined) {
            onUpdate();
            return;
        }
        requestMonth(addMonthResetDay(month, (year - month.getFullYear()) * 12));
    }

    return {
        getView() {
            if (pendingFocus) pendingFocus.viewed = true;
            const { value, selectedMonth, onMonthChange } = getProps();
            const hasYearInput = !selectedMonth || Boolean(onMonthChange);
            return {
                locale: getLocale(),
                selectedMonth: getMonth(),
                value: value && isDateValid(value) ? value : undefined,
                rovingDate: getRovingDate(),
                monthLabelAriaLive: hasMonthChanged() ? 'polite' : undefined,
                yearText: hasYearInput ? getYearText() : undefined,
                handlePreviousMonth: previousMonth,
                handleNextMonth: nextMonth,
                handleDayPick: pickDay,
            };
        },
        inputYear(text, inputType) {
            yearDraft = { text, year: getMonth().getFullYear() };
            // Spin arrows: Chrome/Safari (no input type), Firefox (`insertReplacementText`).
            if (!inputType || inputType === 'insertReplacementText') commitYear();
            else onUpdate();
        },
        commitYear,
        attachGrid(grid) {
            const controller = new AbortController();
            const { signal } = controller;
            gridElement = grid;
            const getCellDate = (target: EventTarget | null) => {
                const cell = target instanceof Element ? target.closest(`[${DATE_ATTRIBUTE}]`) : null;
                return cell && grid.contains(cell) ? parseDateKey(cell.getAttribute(DATE_ATTRIBUTE)) : undefined;
            };

            grid.addEventListener(
                'keydown',
                (evt: KeyboardEvent) => {
                    const move = getKeyMove(evt);
                    const date = move && getCellDate(evt.target);
                    if (!move || !date) return;
                    const { minDate, maxDate } = getProps();
                    const weekStartDay = getWeekDays(parseLocale(getLocale()) as Locale)[0].number;
                    const target = getCalendarTargetDate(date, move, { minDate, maxDate, weekStartDay });
                    if (target) focusDate(target);
                    evt.preventDefault();
                    evt.stopPropagation();
                },
                { signal },
            );
            // A focused day (key move, click, Tab) is the roving day.
            grid.addEventListener(
                'focusin',
                (evt: FocusEvent) => {
                    const date = getCellDate(evt.target);
                    if (date) setRoving(date);
                },
                { signal },
            );

            return () => {
                controller.abort();
                if (gridElement === grid) gridElement = undefined;
                pendingFocus = undefined;
            };
        },
        afterRender() {
            // Settle the state derived from the props in `getView`.
            if (roving && !getLastRoving()) roving = undefined;
            if (hasMonthChanged()) monthChanged = true;

            if (pendingFocus?.viewed) {
                const { date } = pendingFocus;
                pendingFocus = undefined;
                // Not rendered: the parent did not show the month, drop the move.
                getDayButton(date)?.focus();
            }
        },
    };
}
