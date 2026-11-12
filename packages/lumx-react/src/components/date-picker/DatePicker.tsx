import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { CLASSNAME, COMPONENT_NAME } from './constants';
import { DatePickerProps } from './types';
import { useCalendar } from './useCalendar';

/**
 * DatePicker component: the month toolbar and the calendar grid (`role="grid"`), with the shown month held
 * internally. It does not move focus on mount: Tab enters the grid on the roving day (the selected day, else today).
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DatePicker = forwardRef<DatePickerProps, HTMLDivElement>((props, ref) => useCalendar(props, ref));
DatePicker.displayName = COMPONENT_NAME;
DatePicker.className = CLASSNAME;
