import { defineComponent, shallowRef, useAttrs, watch } from 'vue';

import { DatePickerField as UI } from '@lumx/core/js/components/DatePicker/DatePickerField';
import type { DatePickerMonthButtonProps } from '@lumx/core/js/components/DatePicker/DatePicker';
import { FIELD_COMPONENT_NAME } from '@lumx/core/js/components/DatePicker/constants';
import { createDatePickerFieldState } from '@lumx/core/js/components/DatePicker/createDatePickerFieldState';
import { getCurrentLocale } from '@lumx/core/js/utils/locale/getCurrentLocale';

import { useClassName } from '../../composables/useClassName';
import { useId } from '../../composables/useId';
import { getName, keysOf } from '../../utils/VueToJSX';
import { PopoverDialog } from '../popover-dialog';
import { TextField, type TextFieldProps } from '../text-field';
import DatePicker from './DatePicker';

/** TextField props set by the `DatePickerField` (not forwarded). */
type DatePickerFieldOwnedTextFieldProps =
    | 'value'
    | 'type'
    | 'multiline'
    | 'minimumRows'
    | 'forceFocusStyle'
    | 'inputRef'
    | 'textFieldRef';

/**
 * `DatePickerField` props.
 */
export interface DatePickerFieldProps extends Omit<TextFieldProps, DatePickerFieldOwnedTextFieldProps> {
    /** Default month (shown when there is no `value`). */
    defaultMonth?: Date;
    /** Locale (language or region) to use. */
    locale?: string;
    /** Date after which dates can't be selected. */
    maxDate?: Date;
    /** Date before which dates can't be selected. */
    minDate?: Date;
    /** Props to pass to the next month button (`label` required). */
    nextButtonProps: DatePickerMonthButtonProps;
    /** Props to pass to the previous month button (`label` required). */
    previousButtonProps: DatePickerMonthButtonProps;
    /** Currently selected date. */
    value?: Date;
}

/**
 * DatePickerField events schema.
 */
export const emitSchema = {
    /**
     * Value change: a day pick, a committed typed date (Enter, blur), the clear button (`undefined`).
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (_value?: Date, _name?: string, _event?: Event) => true,
    /** Input focus. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    focus: (_event?: FocusEvent) => true,
    /** Input blur (after the commit of the typed text). */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blur: (_event?: FocusEvent) => true,
};

/**
 * DatePickerField component: an editable `role="combobox"` input that opens a modal dialog with the calendar
 * (`DatePicker`).
 *
 * - Down, Alt+Down or a click on the input open the dialog and focus the roving day (the selected day, else today).
 * - The user can type a date (long format or numeric date of the locale). The typed text is committed on Enter
 *   and on blur: `change` is emitted with the parsed date (snapped to `minDate`/`maxDate`), then the input shows
 *   the formatted `value` again.
 * - An empty text clears the value only when the field has a clear button (`clearButtonProps`).
 */
const DatePickerField = defineComponent(
    (props: DatePickerFieldProps, { emit }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const dialogId = useId();

        const anchorRef = shallowRef<HTMLElement>();
        const inputRef = shallowRef<HTMLInputElement | null>(null);
        const setInputRef = (element: HTMLInputElement | HTMLTextAreaElement | null) => {
            inputRef.value = element as HTMLInputElement | null;
        };

        // Bridge: the state reads the latest props and asks for a render on change.
        const version = shallowRef(0);
        const state = createDatePickerFieldState({
            getProps: () => ({
                ...props,
                onChange: (...args: [Date | undefined, string?, Event?]) => emit('change', ...args),
            }),
            onUpdate: () => {
                version.value += 1;
            },
        });
        watch(
            inputRef,
            (input, _, onCleanup) => {
                if (input) onCleanup(state.attachInput(input));
            },
            { immediate: true },
        );

        return () => {
            const {
                class: _class,
                defaultMonth,
                locale: _locale,
                maxDate,
                minDate,
                name,
                nextButtonProps,
                previousButtonProps,
                value,
                label,
                ...forwardedProps
            } = props;
            // Read the version: render again on a state change.
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            version.value;
            const { 'aria-label': ariaLabel, ...forwardedAttrs } = attrs as Record<string, any>;

            return UI(
                {
                    ...forwardedAttrs,
                    ...forwardedProps,
                    className: className.value,
                    name,
                    label,
                    'aria-label': ariaLabel,
                    onFocus: (event?: FocusEvent) => emit('focus', event),
                    // The commit is done by the input setup (blur listener).
                    onBlur: (event?: FocusEvent) => emit('blur', event),
                    // Typing (the template `onChange` is the native `change` event in Vue).
                    onInput: state.inputText,
                    onClear: state.clear,
                    ...state.getView(),
                    dialogId,
                    handleInputChange: state.inputText,
                    handleClose: state.close,
                    anchorRef,
                    inputRef: setInputRef,
                    datePickerProps: {
                        locale: props.locale || getCurrentLocale(),
                        value,
                        minDate,
                        maxDate,
                        defaultMonth,
                        nextButtonProps,
                        previousButtonProps,
                        todayOrSelectedDateRef: state.setRovingDayElement,
                        onChange: state.pickDay,
                    },
                },
                { TextField, PopoverDialog, DatePicker },
            );
        };
    },
    {
        name: getName(FIELD_COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<DatePickerFieldProps>()(
            'defaultMonth',
            'locale',
            'maxDate',
            'minDate',
            'nextButtonProps',
            'previousButtonProps',
            'value',
            // Inherited TextField props
            'class',
            'theme',
            'error',
            'hasError',
            'afterElement',
            'helper',
            'icon',
            'isRequired',
            'isValid',
            'label',
            'labelProps',
            'maxLength',
            'charCounterMessage',
            'isDisabled',
            'disabled',
            'placeholder',
            'aria-disabled',
            'id',
            'clearButtonProps',
            'name',
        ),
        emits: emitSchema,
    },
);

export default DatePickerField;
