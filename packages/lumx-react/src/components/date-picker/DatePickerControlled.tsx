import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { CLASSNAME } from './constants';
import type { DatePickerProps } from './types';
import { useCalendar } from './useCalendar';

/**
 * Defines the props of the component.
 */
export interface DatePickerControlledProps extends DatePickerProps {
    /** Selected month to display. */
    selectedMonth: Date;
    /** On previous month change callback. */
    onPrevMonthChange(): void;
    /** On next month change callback. */
    onNextMonthChange(): void;
    /** On month/year change callback. */
    onMonthChange?: (newMonth: Date) => void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DatePickerControlled';

/**
 * DatePickerControlled component: the month toolbar and the calendar grid (`role="grid"`), with the shown month
 * controlled by the parent (`selectedMonth`).
 *
 * Keyboard (calendar grid): arrows (day, week), Home/End (week row), Page Up/Page Down (month), Shift+Page Up/Page
 * Down (year). A key move into another month calls `onMonthChange` (else `onPrevMonthChange`/`onNextMonthChange`
 * for the previous or next month; a move further away is canceled).
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DatePickerControlled = forwardRef<DatePickerControlledProps, HTMLDivElement>((props, ref) =>
    useCalendar(props, ref),
);
DatePickerControlled.displayName = COMPONENT_NAME;
DatePickerControlled.className = CLASSNAME;
