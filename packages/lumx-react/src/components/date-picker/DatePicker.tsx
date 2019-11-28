import React, { ReactElement } from 'react';

import { IconButton, Toolbar } from '@lumx/react';

import { mdiGreaterThan, mdiLessThan } from '@lumx/icons';

import { getAnnotatedMonthCalendar, getWeekDays } from '@lumx/core/js/date-picker';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { IGenericProps } from '@lumx/react/utils';
import { getRootClassName } from '../../utils/getRootClassName';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IDatePickerProps extends IGenericProps {
    /** Locale. */
    locale: string;
    /** Max date. */
    maxDate?: Date;
    /** Min date. */
    minDate?: Date;
}
type DatePickerProps = IDatePickerProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<DatePickerProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}DatePicker`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    maxDate: undefined,
    minDate: undefined,
};
/////////////////////////////

/**
 * Simple component used to identify user.
 *
 * @return The component.
 */
const DatePicker: React.FC<DatePickerProps> = ({
    locale,
    maxDate = DEFAULT_PROPS.maxDate,
    minDate = DEFAULT_PROPS.minDate,
}: DatePickerProps): ReactElement => {
    return (
        <div>
            <Toolbar
                after={<IconButton icon={mdiGreaterThan} />}
                before={<IconButton icon={mdiLessThan} />}
                label="Date Picker"
            />
            <div>
                <div>
                    {getWeekDays(locale).map((weekDay) => (
                        <span key={weekDay}>{weekDay}</span>
                    ))}
                </div>
                <div>
                    {getAnnotatedMonthCalendar(locale, minDate, maxDate).map((annotatedDate) => {
                        if (annotatedDate.isDisplayed) {
                            if (annotatedDate.isClickable) {
                                return <a key={annotatedDate.date.format()}>{annotatedDate.date.format('DD')}</a>;
                            }
                            return <span key={annotatedDate.date.format()}>{annotatedDate.date.format('DD')}</span>;
                        }
                        return <span key={annotatedDate.date.format()} />;
                    })}
                </div>
            </div>
        </div>
    );
};
DatePicker.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, DatePicker, DatePickerProps };
