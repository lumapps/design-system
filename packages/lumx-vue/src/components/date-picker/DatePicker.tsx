import {
    defineComponent,
    isRef,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    shallowRef,
    useAttrs,
    type FunctionalComponent,
    type Ref,
} from 'vue';

import { DatePicker as UI, type DatePickerMonthButtonProps } from '@lumx/core/js/components/DatePicker/DatePicker';
import { CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/DatePicker/constants';
import { createCalendarState } from '@lumx/core/js/components/DatePicker/createCalendarState';
import { getCurrentLocale } from '@lumx/core/js/utils/locale/getCurrentLocale';
import { onEnterPressed } from '@lumx/core/js/utils';
import type { Theme } from '@lumx/core/js/constants';

import { useClassName } from '../../composables/useClassName';
import { useId } from '../../composables/useId';
import { getName, keysOf, type ClassValue } from '../../utils/VueToJSX';
import { Button, IconButton } from '../button';
import { FlexBox } from '../flex-box';
import { Text } from '../text';
import { TextField } from '../text-field';

/** Element ref of the roving day button: a Vue ref or a ref callback. */
export type DatePickerElementRef = Ref<HTMLElement | null | undefined> | ((element: HTMLElement | null) => void);

/**
 * `DatePicker` props.
 */
export interface DatePickerProps {
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
    /** Reference to the roving day button (the selected date, else today). */
    todayOrSelectedDateRef?: DatePickerElementRef;
    /** Currently selected date. */
    value?: Date;
    /** Theme applied to the root element. */
    theme?: Theme;
    /** CSS class. */
    class?: ClassValue;
}

/**
 * DatePicker events schema.
 */
export const emitSchema = {
    /** Day pick (click, Enter, Space on a day button). */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (_value?: Date) => true,
};

/** Set an element ref (a Vue ref or a ref callback). */
const setElementRef = (elementRef: DatePickerElementRef | undefined, element: HTMLElement | null) => {
    if (!elementRef) return;
    if (isRef(elementRef)) elementRef.value = element;
    else elementRef(element);
};

/**
 * Vue `FlexBox` adapter: the core template uses the `hAlign` / `vAlign` names, the Vue `FlexBox` uses
 * `horizontalAlign` / `verticalAlign`.
 */
const AlignedFlexBox: FunctionalComponent<Record<string, any>> = (props, { slots }) => {
    const { hAlign, vAlign, ...forwardedProps } = props;
    return (
        <FlexBox {...forwardedProps} horizontalAlign={hAlign} verticalAlign={vAlign}>
            {slots.default?.()}
        </FlexBox>
    );
};

/**
 * DatePicker component: the month toolbar and the calendar grid (`role="grid"`), with the shown month held
 * internally. It does not move focus on mount: Tab enters the grid on the roving day (the selected day, else today).
 *
 * Keyboard (calendar grid): arrows (day, week), Home/End (week row), Page Up/Page Down (month), Shift+Page Up/Page
 * Down (year).
 */
const DatePicker = defineComponent(
    (props: DatePickerProps, { emit }) => {
        const attrs = useAttrs();
        const className = useClassName(() => props.class);
        const monthLabelId = useId();

        // Bridge: the state reads the latest props and asks for a render on change.
        const version = shallowRef(0);
        const state = createCalendarState({
            getProps: () => ({ ...props, onChange: (date: Date) => emit('change', date) }),
            onUpdate: () => {
                version.value += 1;
            },
        });

        // Roving day button (the ref is set on the injected `Button`: resolve the DOM element of the instance).
        const setRovingDayRef = (instance: any) => {
            const element: HTMLElement | null = instance?.$el ?? instance ?? null;
            // Ignore the `null` of an unmounted former roving day: the new roving day is set after the render.
            if (element) setElementRef(props.todayOrSelectedDateRef, element);
        };

        const gridRef = shallowRef<HTMLElement | null>(null);
        let detachGrid: (() => void) | undefined;
        onMounted(() => {
            if (gridRef.value) detachGrid = state.attachGrid(gridRef.value);
        });
        onUpdated(() => state.afterRender());
        onBeforeUnmount(() => detachGrid?.());

        const onYearInput = (text: string, _name?: string, event?: Event) =>
            state.inputYear(text, (event as InputEvent | undefined)?.inputType);
        const onYearKeypress = onEnterPressed(state.commitYear);

        return () => {
            const { minDate, maxDate, previousButtonProps, nextButtonProps, theme } = props;
            // Read the version: render again on a state change.
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            version.value;
            const { yearText, ...view } = state.getView();

            return UI(
                {
                    ...attrs,
                    ...view,
                    className: className.value,
                    theme,
                    locale: props.locale || getCurrentLocale(),
                    minDate,
                    maxDate,
                    monthLabelId,
                    previousButtonProps,
                    nextButtonProps,
                    yearInputProps: {
                        value: yearText,
                        onInput: onYearInput,
                        onBlur: state.commitYear,
                        onKeypress: onYearKeypress,
                    },
                    gridRef,
                    rovingDayRef: setRovingDayRef,
                },
                { IconButton, Button, TextField, FlexBox: AlignedFlexBox, Text },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<DatePickerProps>()(
            'defaultMonth',
            'locale',
            'maxDate',
            'minDate',
            'nextButtonProps',
            'previousButtonProps',
            'todayOrSelectedDateRef',
            'value',
            'theme',
            'class',
        ),
        emits: emitSchema,
    },
);

export default DatePicker;

export { CLASSNAME, COMPONENT_NAME };
