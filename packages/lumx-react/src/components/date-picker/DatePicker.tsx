import React, { ReactElement, useCallback, useState } from 'react';

import noop from 'lodash/noop';

import moment from 'moment';

import classNames from 'classnames';

import { Dropdown, Emphasis, IconButton, Placement, TextField, Theme, Toolbar } from '@lumx/react';

import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';

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

    /** Value. */
    value: moment.Moment;

    /** On change. */
    onChange(value: moment.Moment): void;
}
type DatePickerProps = IDatePickerProps;

type DatePickerControlledProps = IDatePickerProps & {
    /** Today. */
    today: moment.Moment;

    /** Month offset, positive or negative. */
    monthOffset: number;

    /** Changing to previous month. */
    onPrevMonthChange(): void;

    /** Changing to next month. */
    onNextMonthChange(): void;
};

type WrappedDatePickerProps = IDatePickerProps & {
    /** Input label. */
    label: string;

    /** Theme. */
    theme?: Theme;
};

/////////////////////////////

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
const DEFAULT_PROPS: Partial<DatePickerProps> = {
    maxDate: undefined,
    minDate: undefined,
};
/////////////////////////////

/**
 * Simple component used to identify user.
 *
 * @return The component.
 */
const DatePickerControlled: React.FC<DatePickerControlledProps> = ({
    locale,
    maxDate = DEFAULT_PROPS.maxDate,
    minDate = DEFAULT_PROPS.minDate,
    monthOffset,
    onChange,
    onPrevMonthChange,
    onNextMonthChange,
    today,
    value,
}: DatePickerControlledProps): ReactElement => {
    return (
        <div className={`${CLASSNAME}`}>
            <Toolbar
                className={`${CLASSNAME}__toolbar`}
                after={<IconButton emphasis={Emphasis.low} icon={mdiChevronRight} onClick={onNextMonthChange} />}
                before={<IconButton emphasis={Emphasis.low} icon={mdiChevronLeft} onClick={onPrevMonthChange} />}
                label={
                    <span className={`${CLASSNAME}__month`}>
                        {moment(today)
                            .locale(locale)
                            .add(monthOffset, 'months')
                            .format('MMMM YYYY')}
                    </span>
                }
            />
            <div className={`${CLASSNAME}__calendar`}>
                <div className={`${CLASSNAME}__week-days ${CLASSNAME}__days-wrapper`}>
                    {getWeekDays(locale).map((weekDay) => (
                        <div key={weekDay.unix()} className={`${CLASSNAME}__day-wrapper`}>
                            <span className={`${CLASSNAME}__week-day`}>
                                {weekDay
                                    .format('dddd')
                                    .slice(0, 1)
                                    .toLocaleUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>

                <div className={`${CLASSNAME}__month-days ${CLASSNAME}__days-wrapper`}>
                    {getAnnotatedMonthCalendar(locale, minDate, maxDate, today, monthOffset).map((annotatedDate) => {
                        const onClick = useCallback(() => onChange(annotatedDate.date), [annotatedDate]);
                        if (annotatedDate.isDisplayed) {
                            return (
                                <div key={annotatedDate.date.unix()} className={`${CLASSNAME}__day-wrapper`}>
                                    <button
                                        className={classNames(`${CLASSNAME}__month-day`, {
                                            [`${CLASSNAME}__month-day--is-selected`]: annotatedDate.date.isSame(value),
                                            [`${CLASSNAME}__month-day--is-today`]:
                                                annotatedDate.isClickable && annotatedDate.isToday,
                                        })}
                                        disabled={!annotatedDate.isClickable}
                                        onClick={onClick}
                                    >
                                        <span>{annotatedDate.date.format('DD')}</span>
                                    </button>
                                </div>
                            );
                        }
                        return <div key={annotatedDate.date.unix()} className={`${CLASSNAME}__day-wrapper`} />;
                    })}
                </div>
            </div>
        </div>
    );
};
DatePickerControlled.displayName = COMPONENT_NAME;

const DatePicker = (props: DatePickerProps) => {
    const today = moment();
    const [monthOffset, setMonthOffset] = useState(0);

    const setPrevMonth = () => setMonthOffset(monthOffset - 1);
    const setNextMonth = () => setMonthOffset(monthOffset + 1);

    return (
        <DatePickerControlled
            monthOffset={monthOffset}
            today={today}
            onPrevMonthChange={setPrevMonth}
            onNextMonthChange={setNextMonth}
            {...props}
        />
    );
};

const WrappedDatePicker = ({ label, theme, value, ...props }: WrappedDatePickerProps) => {
    const anchorSimpleRef = React.useRef(null);
    const [isSimpleOpen, setSimpleIsOpen] = React.useState(false);

    const toggleSimpleMenu = () => {
        setSimpleIsOpen(!isSimpleOpen);
    };

    const closeSimpleMenu = () => {
        setSimpleIsOpen(false);
    };

    return (
        <>
            <TextField
                textFieldRef={anchorSimpleRef}
                label={label}
                value={value ? value.format('LL') : ''}
                onClick={toggleSimpleMenu}
                onChange={noop}
                theme={theme}
                readOnly={true}
            />

            <Dropdown
                showDropdown={isSimpleOpen}
                closeOnClick={true}
                closeOnEscape={true}
                onClose={closeSimpleMenu}
                placement={Placement.BOTTOM_START}
                anchorRef={anchorSimpleRef}
                fitToAnchorWidth={false}
            >
                <DatePicker value={value} {...props} />
            </Dropdown>
        </>
    );
};

/////////////////////////////

export {
    CLASSNAME,
    DEFAULT_PROPS,
    DatePicker,
    DatePickerProps,
    DatePickerControlled,
    DatePickerControlledProps,
    WrappedDatePicker,
    WrappedDatePickerProps,
};
