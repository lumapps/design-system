import { mdiChevronLeft, mdiChevronRight } from '@lumx/icons';

import type { CommonRef, GenericProps, HasTheme, JSXElement } from '../../types';
import { classNames } from '../../utils';
import { formatDayNumber } from '../../utils/date/formatDate';
import { getDateKey, isSameDay } from '../../utils/date/calendarDay';
import { getMonthCalendar } from '../../utils/date/getMonthCalendar';
import { getYearDisplayName } from '../../utils/date/getYearDisplayName';
import { parseLocale } from '../../utils/locale/parseLocale';
import type { Locale } from '../../utils/locale/types';
import { Toolbar } from '../Toolbar';
import { CLASSNAME, COMPONENT_NAME } from './constants';
import { getRovingDate } from './getRovingDate';

const { block, element } = classNames.bem(CLASSNAME);

/** Props of the previous and next month buttons (the `label` is required). */
export type DatePickerMonthButtonProps = { label: string } & Record<string, any>;

/**
 * Props of the core `DatePicker` template (the calendar: month toolbar and calendar grid).
 * The framework wrappers hold the state (shown month, roving day, year input text).
 */
export interface DatePickerProps extends GenericProps, HasTheme {
    /** Locale (language or region) to use. */
    locale: string;
    /** Selected date (`aria-selected` day). */
    value?: Date;
    /** Date before which days are out of range (native `disabled`). */
    minDate?: Date;
    /** Date after which days are out of range (native `disabled`). */
    maxDate?: Date;
    /** The shown month (any date in the month). */
    selectedMonth: Date;
    /**
     * The last roving day kept by the wrapper (from `setupCalendarGrid` `onRovingDateChange`). The rendered roving
     * day (`tabindex="0"`) is resolved with `getRovingDate` (selected date, else today, in the shown month, limited to
     * the range).
     */
    rovingDate?: Date;
    /** ID of the month label (the grid `aria-labelledby`). */
    monthLabelId: string;
    /** `aria-live` of the month label: set it after the first month change (not announced on open). */
    monthLabelAriaLive?: 'polite';
    /** Props of the previous month button (`label` required). */
    previousButtonProps: DatePickerMonthButtonProps;
    /** Props of the next month button (`label` required). */
    nextButtonProps: DatePickerMonthButtonProps;
    /** Previous month button click. */
    handlePreviousMonth(): void;
    /** Next month button click. */
    handleNextMonth(): void;
    /** Day pick (click, Enter, Space on a day button). */
    handleDayPick(date: Date): void;
    /**
     * Props of the year input (framework-specific: `value` and the change, blur and Enter handlers). When set, the
     * month label is visually hidden and the month name and the year input are shown instead.
     */
    yearInputProps?: Record<string, any>;
    /** Ref of the root element. */
    ref?: CommonRef;
    /** Ref of the calendar grid element (`role="grid"`, see `setupCalendarGrid`). */
    gridRef?: CommonRef;
    /** Ref of the roving day button (`todayOrSelectedDateRef`). */
    rovingDayRef?: CommonRef;
}

/** Framework components injected by the React and Vue wrappers. */
export interface DatePickerComponents {
    /** Previous and next month buttons. */
    IconButton: any;
    /** Day buttons. */
    Button: any;
    /** Year input. */
    TextField: any;
    /** Month name and year input layout. */
    FlexBox: any;
    /** Month name. */
    Text: any;
}

/**
 * DatePicker core template: the month toolbar and the calendar grid (SPEC 4.2).
 *
 * - `role="grid"` labelled by the month label, a `columnheader` row, one `row` per week.
 * - Each day is a `<button role="gridcell" data-date="YYYY-MM-DD">` (`aria-selected` on the selected day,
 *   `aria-current="date"` on today, native `disabled` out of the range); each blank cell is an empty
 *   `<div role="gridcell">`.
 * - The roving day has `tabindex="0"`, the other days `tabindex="-1"`.
 *
 * The keyboard is set up by `setupCalendarGrid` on the grid element (`gridRef`).
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const DatePicker = (props: DatePickerProps, components: DatePickerComponents) => {
    const { IconButton, Button, TextField, FlexBox, Text } = components;
    const {
        locale,
        value,
        minDate,
        maxDate,
        selectedMonth,
        rovingDate: lastRovingDate,
        monthLabelId,
        monthLabelAriaLive,
        previousButtonProps,
        nextButtonProps,
        handlePreviousMonth,
        handleNextMonth,
        handleDayPick,
        yearInputProps,
        className,
        theme,
        ref,
        gridRef,
        rovingDayRef,
        ...forwardedProps
    } = props;

    const { weeks, weekDays } = getMonthCalendar(parseLocale(locale) as Locale, selectedMonth, minDate, maxDate);
    const today = new Date();
    const rovingDate = getRovingDate({
        month: selectedMonth,
        rovingDate: lastRovingDate,
        value,
        minDate,
        maxDate,
        today,
    });

    const monthYear = selectedMonth.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
    const formattedYear = selectedMonth.toLocaleDateString(locale, { year: 'numeric' }).slice(0, 4);

    const label = (
        <>
            <span
                id={monthLabelId}
                aria-live={monthLabelAriaLive}
                className={yearInputProps ? classNames.visuallyHidden() : undefined}
                dir="auto"
            >
                {monthYear}
            </span>
            {yearInputProps && (
                <FlexBox
                    className={element('month')}
                    orientation="horizontal"
                    hAlign="center"
                    gap="regular"
                    // Spread: the Vue JSX transform reads a `vAlign` attribute as a `v-align` directive.
                    {...{ vAlign: 'center' }}
                    dir="auto"
                >
                    {RegExp(`(.*)(${formattedYear})(.*)`)
                        .exec(monthYear)
                        ?.slice(1)
                        .filter((part) => part !== '')
                        .map((part) =>
                            part === formattedYear ? (
                                <TextField
                                    {...yearInputProps}
                                    aria-label={getYearDisplayName(locale)}
                                    type="number"
                                    max={9999}
                                    min={0}
                                    key="year"
                                    className={element('year')}
                                />
                            ) : (
                                <Text as="p" key={part}>
                                    {part}
                                </Text>
                            ),
                        )}
                </FlexBox>
            )}
        </>
    );

    return (
        <div
            {...forwardedProps}
            ref={ref}
            className={classNames.join(className, block({ [`theme-${theme}`]: Boolean(theme) }))}
        >
            {Toolbar({
                className: element('toolbar'),
                before: (
                    <IconButton
                        {...previousButtonProps}
                        emphasis="low"
                        icon={mdiChevronLeft}
                        onClick={handlePreviousMonth}
                    />
                ) as JSXElement,
                after: (
                    <IconButton {...nextButtonProps} emphasis="low" icon={mdiChevronRight} onClick={handleNextMonth} />
                ) as JSXElement,
                label: label as JSXElement,
            })}
            <div ref={gridRef} className={element('calendar')} role="grid" aria-labelledby={monthLabelId}>
                <div className={classNames.join(element('week-days'), element('days-wrapper'))} role="row">
                    {weekDays.map(({ letter, number, long }) => (
                        <div key={number} className={element('day-wrapper')} role="columnheader">
                            <span className={element('week-day')} aria-hidden="true">
                                {letter.toLocaleUpperCase()}
                            </span>
                            <span className={classNames.visuallyHidden()}>{long}</span>
                        </div>
                    ))}
                </div>

                {weeks.map((week, weekIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div
                        key={weekIndex}
                        className={classNames.join(element('month-days'), element('days-wrapper'))}
                        role="row"
                    >
                        {weekDays.map((weekDay, dayIndex) => {
                            const { date, isOutOfRange } = week[weekDay.number] || {};
                            const key = `${weekIndex}-${dayIndex}`;
                            if (!date) {
                                // Blank cell (before the first day or after the last day of the month), empty by design.
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label
                                return <div key={key} className={element('day-wrapper')} role="gridcell" />;
                            }

                            const isToday = isSameDay(date, today);
                            const isSelected = Boolean(value && isSameDay(value, date));
                            const isRoving = Boolean(rovingDate && isSameDay(rovingDate, date));
                            return (
                                <Button
                                    key={key}
                                    ref={isRoving ? rovingDayRef : undefined}
                                    role="gridcell"
                                    className={element('month-day', { 'is-today': !isOutOfRange && isToday })}
                                    data-date={getDateKey(date)}
                                    tabIndex={isRoving ? 0 : -1}
                                    aria-selected={isSelected ? 'true' : undefined}
                                    aria-current={isToday ? 'date' : undefined}
                                    disabled={isOutOfRange}
                                    isSelected={isSelected}
                                    emphasis="low"
                                    onClick={() => handleDayPick(date)}
                                >
                                    <span aria-hidden="true">{formatDayNumber(locale, date)}</span>
                                    <span className={classNames.visuallyHidden()}>
                                        {date.toLocaleDateString(locale, {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

DatePicker.displayName = COMPONENT_NAME;
DatePicker.className = CLASSNAME;
