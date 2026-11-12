import type { LumxClassName } from '../../types';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'DatePicker';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-date-picker';

/**
 * Field component display name.
 */
export const FIELD_COMPONENT_NAME = 'DatePickerField';

/** Selector of the calendar grid rows (the week days header row has no `gridcell`: the navigation skips it). */
export const CALENDAR_ROW_SELECTOR = '[role="row"]';

/** Selector of the calendar grid cells (day buttons and blank cells). */
export const CALENDAR_CELL_SELECTOR = '[role="gridcell"]';

/** Selector of the blank cells (the empty cells before the first day and after the last day of the month). */
export const CALENDAR_BLANK_CELL_SELECTOR = `.${CLASSNAME}__day-wrapper`;

/** Selector of the cells that focus skips: out-of-range days (native `disabled`) and blank cells. */
export const CALENDAR_CELL_DISABLED_SELECTOR = `[disabled], ${CALENDAR_BLANK_CELL_SELECTOR}`;

/** Attribute holding the local `YYYY-MM-DD` of a day button (see `getDateKey`). */
export const DATE_ATTRIBUTE = 'data-date';

/**
 * Component default props.
 */
export const DEFAULT_PROPS = {} as const;
