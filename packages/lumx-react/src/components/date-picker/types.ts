import moment from 'moment';
import { RefObject } from 'react';

export interface BaseDatePickerProps {
    /** Locale. */
    locale: string;

    /** Max date. */
    maxDate?: Date;

    /** Min date. */
    minDate?: Date;

    /** Today or selected date Ref */
    todayOrSelectedDateRef?: RefObject<HTMLButtonElement>;

    /** Value. */
    value: moment.Moment | undefined;

    /** On change. */
    onChange(value: moment.Moment | undefined): void;
}
