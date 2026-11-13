import { formatDate } from '../../utils/date/formatDate';
import { isSameDay, snapDateToRange } from '../../utils/date/calendarDay';
import { parseDate } from '../../utils/date/parseDate';
import { getCurrentLocale } from '../../utils/locale/getCurrentLocale';

/** Props read by the field state (the latest props of the wrapper). */
export interface DatePickerFieldStateProps {
    /** Selected date. */
    value?: Date;
    /** Locale of the field (format and parse). Default: the current locale. */
    locale?: string;
    /** Date before which dates can't be selected. */
    minDate?: Date;
    /** Date after which dates can't be selected. */
    maxDate?: Date;
    /** Field name, given back to `onChange`. */
    name?: string;
    /** Clear button props: only a field with a clear button can become empty. */
    clearButtonProps?: unknown;
    /**
     * Value change: a day pick, a committed typed date (with the Enter or blur `event`), the clear button.
     * Called without `event` for a day pick and the clear button.
     */
    onChange?(value: Date | undefined, name?: string, event?: Event): void;
}

/** Options of {@link createDatePickerFieldState}. */
export interface DatePickerFieldStateOptions {
    /** Read the latest props. */
    getProps(): DatePickerFieldStateProps;
    /** Called when the state changes: the wrapper renders again. */
    onUpdate(): void;
}

/** What the wrapper renders (props of the `DatePickerField` template). */
export interface DatePickerFieldView {
    /** Text of the input: the formatted value, or the text being typed (until the commit). */
    inputValue: string;
    /** Whether the dialog is open. */
    isOpen: boolean;
    /** Element to focus when the dialog opens: the roving day on open, kept until the dialog closes. */
    focusElement?: HTMLElement;
}

/** Field state of the `DatePickerField` (see {@link createDatePickerFieldState}). */
export interface DatePickerFieldState {
    /** Read the view to render. Call it on each render (it reads the latest props). */
    getView(): DatePickerFieldView;
    /** Input text change (typing). */
    inputText(text: string): void;
    /** Close the dialog (Escape, click outside). */
    close(): void;
    /** Clear button: `onChange(undefined)`. */
    clear(): void;
    /** Day pick in the dialog: `onChange(date)`, then close the dialog. */
    pickDay(date?: Date): void;
    /**
     * Ref of the roving day button of the calendar. The first one set while the dialog is open becomes the
     * `focusElement` (a later change would set up the dialog focus trap again and move the focus).
     */
    setRovingDayElement(element: HTMLElement | null): void;
    /** Set up the keyboard and pointer behavior on the input element. Returns the teardown. */
    attachInput(input: HTMLInputElement): () => void;
}

/**
 * Decide the value of a commit of the typed text (SPEC 7.3). `undefined`: no `onChange` (the text is the value,
 * the same day as the value, not a valid date, or empty without a clear button).
 *
 * | Text at commit                        | Result                                      |
 * | ------------------------------------- | ------------------------------------------- |
 * | Equal to the formatted `value`        | no change (no parse)                        |
 * | A valid date, the same day as `value` | no change                                   |
 * | A valid date, inside the range        | change to the date                          |
 * | A valid date, outside the range       | change to the date snapped to the range     |
 * | Not valid                             | no change                                   |
 * | Empty, with a clear button            | change to `undefined`                       |
 * | Empty, without a clear button         | no change                                   |
 *
 * Typed and snapped dates are calendar dates: the time of day of a day pick (`00:00 UTC`, see `getCalendarDate`).
 */
function getCommitChange(text: string, props: DatePickerFieldStateProps, locale: string) {
    const { value, minDate, maxDate, clearButtonProps } = props;
    if (text === formatDate(value, locale)) return undefined;

    if (!text.trim()) return clearButtonProps ? { value: undefined } : undefined;

    const parsed = parseDate(text, locale);
    if (!parsed) return undefined;
    if (value && isSameDay(parsed, value)) return undefined;

    const snapped = snapDateToRange(parsed, minDate, maxDate);
    if (value && isSameDay(snapped, value)) return undefined;
    return { value: snapped };
}

/**
 * Create the field state of the `DatePickerField` (framework-agnostic): input text, dialog open state, commit of
 * the typed text, clear, day pick, the input keyboard and pointer behavior, and the focus target of the dialog.
 *
 * Input behavior (SPEC 5.1), separate from `setupCombobox` (which closes on the input `focusout` and needs a list):
 * - Down, Alt+Down: open the dialog (when closed).
 * - Click: open the dialog (close it when open: the input is the anchor, outside of the dialog).
 * - Enter and blur: commit the typed text (Enter does not open the dialog).
 * - Space, other characters, Escape, Tab: default behavior (type, nothing, Tab order).
 * - A disabled (`disabled` or `aria-disabled="true"`) or read-only input does not open.
 *
 * After a commit, the input shows the formatted value again (even when the consumer ignores `onChange`).
 *
 * The wrappers keep a thin bridge: render `getView()` on each `onUpdate`, call `attachInput` on mount.
 */
export function createDatePickerFieldState({ getProps, onUpdate }: DatePickerFieldStateOptions): DatePickerFieldState {
    const getLocale = () => getProps().locale || getCurrentLocale();

    /** Text typed for a value and a locale (dropped when one of them changes: the input shows the new value). */
    let draft: { text: string; valueTime?: number; locale: string } | undefined;
    const isDraftCurrent = () =>
        draft !== undefined && Object.is(draft.valueTime, getProps().value?.getTime()) && draft.locale === getLocale();
    const getText = () => {
        if (draft && !isDraftCurrent()) draft = undefined;
        return draft ? draft.text : formatDate(getProps().value, getLocale());
    };

    let isOpen = false;
    let focusElement: HTMLElement | undefined;
    const setOpen = (open: boolean) => {
        if (open === isOpen) return;
        isOpen = open;
        // Capture the roving day of the next open.
        if (!open) focusElement = undefined;
        onUpdate();
    };

    /** Emit a change (no `event` argument for a day pick and the clear button). */
    const emitChange = (value: Date | undefined, event?: Event) => {
        const { onChange, name } = getProps();
        if (event) onChange?.(value, name, event);
        else onChange?.(value, name);
    };

    function commit(event: Event) {
        const change = getCommitChange(getText(), getProps(), getLocale());
        if (change) emitChange(change.value, event);
        // Always show the formatted value again.
        draft = undefined;
        onUpdate();
    }

    return {
        getView: () => ({ inputValue: getText(), isOpen, focusElement }),
        inputText(text) {
            draft = { text, valueTime: getProps().value?.getTime(), locale: getLocale() };
            onUpdate();
        },
        close: () => setOpen(false),
        clear: () => emitChange(undefined),
        pickDay(date) {
            emitChange(date);
            setOpen(false);
        },
        setRovingDayElement(element) {
            if (!element || !isOpen || focusElement) return;
            focusElement = element;
            onUpdate();
        },
        attachInput(input) {
            const controller = new AbortController();
            const { signal } = controller;
            const isDisabled = () => input.disabled || input.readOnly || input.getAttribute('aria-disabled') === 'true';

            input.addEventListener(
                'keydown',
                (evt: KeyboardEvent) => {
                    if (evt.isComposing) return;
                    if (evt.key === 'ArrowDown' && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
                        // Down and Alt+Down open the dialog.
                        if (isDisabled() || isOpen) return;
                        evt.preventDefault();
                        setOpen(true);
                    } else if (evt.key === 'Enter' && !evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
                        commit(evt);
                    }
                },
                { signal },
            );
            input.addEventListener(
                'click',
                () => {
                    if (isDisabled()) return;
                    setOpen(!isOpen);
                },
                { signal },
            );
            input.addEventListener('blur', commit, { signal });
            return () => controller.abort();
        },
    };
}
