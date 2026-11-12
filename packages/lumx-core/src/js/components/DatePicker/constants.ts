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

/** Attribute holding the local `YYYY-MM-DD` of a day button (see `getDateKey`). */
export const DATE_ATTRIBUTE = 'data-date';

/**
 * Component default props.
 */
export const DEFAULT_PROPS = {} as const;
