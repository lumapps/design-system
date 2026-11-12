import { addMonthResetDay, isDateValid } from '../../utils/date/calendarDay';
import { setupCalendarGrid, type CalendarGridHandle } from './setupCalendarGrid';

/** Lowest year accepted by the year input. */
export const MIN_YEAR = 1;
/** Highest year accepted by the year input. */
export const MAX_YEAR = 9999;

/** Props read by the calendar state (the latest props of the wrapper). */
export interface CalendarStateProps {
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
    /** The shown month. */
    selectedMonth: Date;
    /** The selected date, when valid. */
    value?: Date;
    /** The last roving day (see `getRovingDate`). */
    rovingDate?: Date;
    /** `aria-live` of the month label: set after the first month change. */
    monthLabelAriaLive?: 'polite';
    /** Text of the year input. `undefined`: no year input. */
    yearText?: string;
    handlePreviousMonth(): void;
    handleNextMonth(): void;
    handleDayPick(date: Date): void;
}

/** Calendar state of the `DatePicker` (see {@link createCalendarState}). */
export interface CalendarState {
    /** Read the view to render. Call it on each render (it reads the latest props). */
    getView(): CalendarView;
    /** Previous month button. */
    previousMonth(): void;
    /** Next month button. */
    nextMonth(): void;
    /** Day pick: it becomes the roving day, then `onChange`. */
    pickDay(date: Date): void;
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
 * Create the calendar state of the `DatePicker` (framework-agnostic): shown month, roving day, year input text,
 * month label `aria-live`, and the keyboard navigation of the calendar grid (`setupCalendarGrid`).
 *
 * The wrappers keep a thin bridge: render `getView()` on each `onUpdate`, call `attachGrid` on mount and
 * `afterRender` after each render.
 */
export function createCalendarState({ getProps, onUpdate }: CalendarStateOptions): CalendarState {
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
    const getRoving = () => (roving && Object.is(roving.valueTime, getValueTime()) ? roving.date : undefined);
    const setRoving = (date: Date) => {
        roving = { date, valueTime: getValueTime() };
        onUpdate();
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

    let grid: CalendarGridHandle | undefined;
    /** Number of views read (renders), to know when a render followed a key move into another month. */
    let viewCount = 0;
    /** `viewCount` when a key move asked for another month. */
    let pendingMoveViewCount: number | undefined;

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
            viewCount += 1;
            const { value, selectedMonth, onMonthChange } = getProps();
            const hasYearInput = !selectedMonth || Boolean(onMonthChange);
            return {
                selectedMonth: getMonth(),
                value: value && isDateValid(value) ? value : undefined,
                rovingDate: getRoving(),
                monthLabelAriaLive: hasMonthChanged() ? 'polite' : undefined,
                yearText: hasYearInput ? getYearText() : undefined,
                handlePreviousMonth: previousMonth,
                handleNextMonth: nextMonth,
                handleDayPick: pickDay,
            };
        },
        previousMonth,
        nextMonth,
        pickDay,
        inputYear(text, inputType) {
            yearDraft = { text, year: getMonth().getFullYear() };
            // Spin arrows: Chrome/Safari (no input type), Firefox (`insertReplacementText`).
            if (!inputType || inputType === 'insertReplacementText') commitYear();
            else onUpdate();
        },
        commitYear,
        attachGrid(element) {
            const controller = new AbortController();
            const handle = setupCalendarGrid(
                {
                    grid: element,
                    getRange: () => ({ minDate: getProps().minDate, maxDate: getProps().maxDate }),
                    onRovingDateChange: setRoving,
                    onMonthChange(date) {
                        if (!requestMonth(date)) return false;
                        pendingMoveViewCount = viewCount;
                        return true;
                    },
                },
                controller.signal,
            );
            grid = handle;
            return () => {
                controller.abort();
                if (grid === handle) grid = undefined;
            };
        },
        afterRender() {
            // Settle the state derived from the props in `getView`.
            if (roving && !getRoving()) roving = undefined;
            if (hasMonthChanged()) monthChanged = true;

            grid?.flushPendingNavigation();
            // A render followed the key move into another month: if it did not show the month (the parent
            // ignored `onMonthChange`), drop the move so focus does not jump into the grid later.
            if (pendingMoveViewCount !== undefined && viewCount > pendingMoveViewCount) {
                grid?.cancelPendingNavigation();
                pendingMoveViewCount = undefined;
            }
        },
    };
}
