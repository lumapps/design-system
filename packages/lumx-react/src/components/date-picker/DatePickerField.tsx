import { DatePicker, Placement, Popover, TextField, IconButtonProps, TextFieldProps } from '@lumx/react';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';

import moment from 'moment';

import React, { forwardRef, SyntheticEvent, useCallback, useRef, useState } from 'react';

import { ENTER_KEY_CODE, SPACE_KEY_CODE } from '@lumx/react/constants';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { Comp, GenericProps } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface DatePickerFieldProps extends GenericProps {
    /** The month to display by default. */
    defaultMonth?: Date;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** The locale (language or region) to use. */
    locale: string;
    /** The date after which no date can be selected. */
    maxDate?: Date;
    /** The date before which no date can be selected. */
    minDate?: Date;
    /** The native input name property. */
    name?: string;
    /** The props to pass to the next month change button, minus those already set by the DatePickerControlled props. */
    nextButtonProps: Pick<IconButtonProps, 'label'> & Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** The props to pass to the previous month change button, minus those already set by the DatePickerControlled props. */
    previousButtonProps: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** The current value of the text field. */
    value: Date | undefined;
    /** The function called on change. */
    onChange(value: Date | undefined, name?: string, event?: SyntheticEvent): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = 'DatePickerField';

/**
 * DatePickerField component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DatePickerField: Comp<DatePickerFieldProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        defaultMonth,
        disabled,
        isDisabled = disabled,
        locale,
        maxDate,
        minDate,
        name,
        nextButtonProps,
        onChange,
        previousButtonProps,
        value,
        ...forwardedProps
    } = props;
    const wrapperRef = useRef(null);
    const anchorRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);

    const toggleSimpleMenu = () => {
        setIsOpen(!isOpen);
    };

    const onClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    useFocus(anchorRef.current, isOpen);
    const handleKeyboardNav = (evt: React.KeyboardEvent) => {
        if ((evt.which === ENTER_KEY_CODE || evt.which === SPACE_KEY_CODE) && toggleSimpleMenu) {
            toggleSimpleMenu();
        }
    };

    // Handle focus trap.
    const todayOrSelectedDateRef = useRef<HTMLButtonElement>(null);
    useFocusTrap(todayOrSelectedDateRef.current && wrapperRef.current, todayOrSelectedDateRef.current);

    const onTextFieldChange = (textFieldValue: string, textFieldName?: string, event?: SyntheticEvent) => {
        if (!textFieldValue) {
            onChange(undefined, textFieldName, event);
        }
    };

    const onDatePickerChange = (newDate?: Date) => {
        onChange(newDate, name);
        onClose();
    };

    return (
        <>
            <TextField
                ref={ref}
                {...forwardedProps}
                name={name}
                forceFocusStyle={isOpen}
                textFieldRef={anchorRef}
                value={value ? moment(value).locale(locale).format('LL') : ''}
                onClick={toggleSimpleMenu}
                onChange={onTextFieldChange}
                onKeyPress={handleKeyboardNav}
                isDisabled={isDisabled}
                readOnly
            />
            {isOpen ? (
                <Popover
                    anchorRef={anchorRef}
                    placement={Placement.BOTTOM_START}
                    isOpen={isOpen}
                    onClose={onClose}
                    closeOnClickAway
                    closeOnEscape
                >
                    <div ref={wrapperRef}>
                        <DatePicker
                            locale={locale}
                            maxDate={maxDate}
                            minDate={minDate}
                            value={value}
                            onChange={onDatePickerChange}
                            todayOrSelectedDateRef={todayOrSelectedDateRef}
                            defaultMonth={defaultMonth}
                            nextButtonProps={nextButtonProps}
                            previousButtonProps={previousButtonProps}
                        />
                    </div>
                </Popover>
            ) : null}
        </>
    );
});
DatePickerField.displayName = COMPONENT_NAME;
