import React, { ReactElement, ReactNode, RefObject, useState } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import uuid from 'uuid/v4';

import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle } from '@lumx/icons';
import { Emphasis, Icon, IconButton, InputHelper, InputLabel, Kind, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

enum TextFieldType {
    input = 'input',
    textarea = 'textarea',
}

/**
 * Defines the props of the component.
 */
interface ITextFieldProps extends IGenericProps {
    /** A Chip Group to be rendered before the main text input */
    chips?: HTMLElement | ReactNode;

    /** The error related to the TextField */
    error?: string | ReactNode;

    /** Whether the text field is displayed with error style or not. */
    hasError?: boolean;

    /** The helper related to the TextField */
    helper?: string | ReactNode;

    /** The max length the input accepts. If set, a character counter will be displayed. */
    maxLength?: number;

    /** Text field icon (SVG path). */
    icon?: string;

    /** Id that will be passed to input element. An id is generated (uuid) if no id is provided. */
    id?: string;

    /** Whether the text field is disabled or not. */
    isDisabled?: boolean;

    /** Whether the text field is displayed with valid style or not. */
    isValid?: boolean;

    /** Whether the text field shows a cross to clear its content or not. */
    isClearable?: boolean;

    /** Text field label displayed in a label tag. */
    label?: string;

    /** Text field placeholder message. */
    placeholder?: string;

    /** Theme. */
    theme?: Theme;

    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;

    /** Minimum rows to be displayed in a text area. */
    minimumRows?: number;

    /** A ref that will be passed to the input or text area element. */
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;

    /** Text field value. */
    value: string;

    /** Text field type (input or textarea). */
    type?: TextFieldType;

    /** A ref that will be passed to the wrapper element. */
    textFieldRef?: RefObject<HTMLDivElement>;

    /** Text field value change handler. */
    onChange(value: string): void;

    /** Text field focus change handler. */
    onFocus?(event: React.FocusEvent): void;

    /** Text field blur change handler. */
    onBlur?(event: React.FocusEvent): void;
}
type TextFieldProps = ITextFieldProps;

/////////////////////////////

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TextField`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The minimum number of rows that we want to display on the text area
 */
const MIN_ROWS = 2;

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TextFieldProps> = {
    hasError: false,
    isClearable: false,
    isDisabled: false,
    isValid: false,
    minimumRows: MIN_ROWS,
    theme: Theme.light,
    type: TextFieldType.input,
};
/**
 * Hook that allows to calculate the number of rows needed for a text area.
 * @param minimumRows Minimum number of rows that we want to display.
 * @return rows to be used and a callback to recalculate
 */
const useComputeNumberOfRows = (
    minimumRows: number,
): {
    /** number of rows to be used on the text area */
    rows: number;
    /**
     * Callback in order to recalculate the number of rows due to a change on the text area
     * @param event Change event.
     */
    recomputeNumberOfRows(event: React.ChangeEvent): void;
} => {
    const [rows, setRows] = useState(minimumRows);

    const recompute = (event: React.ChangeEvent): void => {
        /**
         * HEAD's UP! This part is a little bit tricky. The idea here is to only
         * display the necessary rows on the textarea. In order to dynamically adjust
         * the height on that field, we need to:
         * 1. Set the current amount of rows to the minimum. That will make the scroll appear.
         * 2. With that, we will have the `scrollHeight`, meaning the height of the container adjusted to the current content
         * 3. With the scroll height, we can figure out how many rows we need to use by dividing the scroll height
         * by the line height.
         * 4. With that number, we can readjust the number of rows on the text area. We need to do that here, if we leave that to
         * the state change through React, there are some scenarios (resize, hitting ENTER or BACKSPACE which add or remove lines)
         * when we will not see the update and the rows will be resized to the minimum.
         * 5. In case there is any other update on the component that changes the UI, we need to keep the number of rows
         * on the state in order to allow React to re-render. Therefore, we save them using `useState`
         */
        (event.target as HTMLTextAreaElement).rows = minimumRows;
        const currentRows = event.target.scrollHeight / (event.target.clientHeight / minimumRows);
        (event.target as HTMLTextAreaElement).rows = currentRows;

        setRows(currentRows);
    };

    return {
        recomputeNumberOfRows: recompute,
        rows,
    };
};
/////////////////////////////

interface IInputNativeProps {
    id?: string;
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;
    isDisabled?: boolean;
    maxLength?: number;
    placeholder?: string;
    type?: TextFieldType;
    value: string;
    rows: number;
    setFocus(focus: boolean): void;
    recomputeNumberOfRows(event: React.ChangeEvent): void;
    onChange(value: string): void;
    onFocus?(value: React.FocusEvent): void;
    onBlur?(value: React.FocusEvent): void;
}

const renderInputNative = (props: IInputNativeProps): ReactElement => {
    const {
        id,
        isDisabled,
        placeholder,
        type,
        value,
        setFocus,
        onChange,
        onFocus,
        onBlur,
        inputRef,
        rows,
        recomputeNumberOfRows,
        ...forwardedProps
    } = props;

    const onTextFieldFocus = (event: React.FocusEvent): void => {
        if (onFocus) {
            onFocus(event);
        }

        return setFocus(true);
    };

    const onTextFieldBlur = (event: React.FocusEvent): void => {
        if (onBlur) {
            onBlur(event);
        }

        return setFocus(false);
    };

    const handleChange = (event: React.ChangeEvent): void => {
        if (type === TextFieldType.textarea) {
            recomputeNumberOfRows(event);
        }

        onChange(get(event, 'target.value'));
    };

    if (type === TextFieldType.textarea) {
        return (
            <textarea
                id={id}
                disabled={isDisabled}
                placeholder={placeholder}
                value={value}
                rows={rows}
                onFocus={onTextFieldFocus}
                onBlur={onTextFieldBlur}
                onChange={handleChange}
                ref={inputRef as RefObject<HTMLTextAreaElement>}
                {...forwardedProps}
            />
        );
    }
    return (
        <input
            id={id}
            disabled={isDisabled}
            type="text"
            placeholder={placeholder}
            value={value}
            onFocus={onTextFieldFocus}
            onBlur={onTextFieldBlur}
            onChange={handleChange}
            ref={inputRef as RefObject<HTMLInputElement>}
            {...forwardedProps}
        />
    );
};

/**
 * Text field.
 *
 * @param  props Text field props.
 * @return The component.
 */
const TextField: React.FC<TextFieldProps> = (props: TextFieldProps): ReactElement => {
    const {
        chips,
        className = '',
        error,
        hasError,
        helper,
        icon,
        id = uuid(),
        isDisabled,
        isClearable = DEFAULT_PROPS.isClearable,
        isValid,
        label,
        maxLength,
        onChange,
        onFocus,
        onBlur,
        placeholder,
        minimumRows = DEFAULT_PROPS.minimumRows as number,
        inputRef = React.useRef(null),
        theme = DEFAULT_PROPS.theme,
        type = DEFAULT_PROPS.type,
        useCustomColors,
        textFieldRef,
        value,
        ...forwardedProps
    } = props;

    const [isFocus, setFocus] = useState(false);
    const { rows, recomputeNumberOfRows } = useComputeNumberOfRows(minimumRows);
    const valueLength = (value && value.length) || 0;
    const isNotEmpty = valueLength > 0;

    /**
     * Function triggered when the Clear Button is clicked.
     * The idea is to execute the `onChange` callback with an empty string
     * and remove focus from the clear button.
     * @param evt On clear event.
     */
    const onClear = (evt: React.ChangeEvent): void => {
        evt.nativeEvent.preventDefault();
        evt.nativeEvent.stopPropagation();
        (evt.currentTarget as HTMLElement).blur();

        onChange('');
    };

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    hasChips: Boolean(chips),
                    hasError: !isValid && hasError,
                    hasIcon: Boolean(icon),
                    hasInput: type === TextFieldType.input,
                    hasInputClear: isClearable && isNotEmpty,
                    hasLabel: Boolean(label),
                    hasPlaceholder: Boolean(placeholder),
                    hasTextarea: type === TextFieldType.textarea,
                    hasValue: Boolean(value),
                    isClearable,
                    isDisabled,
                    isFocus,
                    isValid,
                    prefix: CLASSNAME,
                    theme,
                }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
            ref={textFieldRef}
        >
            <div className={`${CLASSNAME}__header`}>
                {label && (
                    <InputLabel htmlFor={id} className={`${CLASSNAME}__label`}>
                        {label}
                    </InputLabel>
                )}

                {maxLength && (
                    <div className={`${CLASSNAME}__char-counter`}>
                        <span>{maxLength - valueLength}</span>
                        {maxLength - valueLength === 0 && <Icon icon={mdiAlertCircle} size={Size.xxs} />}
                    </div>
                )}
            </div>

            <div className={`${CLASSNAME}__wrapper`}>
                {chips && <div className={`${CLASSNAME}__chips`}>{chips}</div>}

                {icon && (
                    <Icon
                        className={`${CLASSNAME}__input-icon`}
                        color={theme === Theme.dark ? 'light' : undefined}
                        icon={icon}
                        size={Size.xs}
                    />
                )}

                <div className={`${CLASSNAME}__input-wrapper`}>
                    <div className={`${CLASSNAME}__input-native`}>
                        {renderInputNative({
                            id,
                            inputRef,
                            isDisabled,
                            maxLength,
                            onBlur,
                            onChange,
                            onFocus,
                            placeholder,
                            recomputeNumberOfRows,
                            rows,
                            setFocus,
                            type,
                            value,
                            ...forwardedProps,
                        })}
                    </div>

                    {(isValid || hasError) && (
                        <Icon
                            className={`${CLASSNAME}__input-validity`}
                            color={theme === Theme.dark ? 'light' : undefined}
                            icon={isValid ? mdiCheckCircle : mdiAlertCircle}
                            size={Size.xxs}
                        />
                    )}

                    {isClearable && isNotEmpty && (
                        <IconButton
                            className={`${CLASSNAME}__input-clear`}
                            icon={mdiCloseCircle}
                            emphasis={Emphasis.low}
                            size={Size.s}
                            theme={theme}
                            onClick={onClear}
                        />
                    )}
                </div>
            </div>
            {hasError && error && <InputHelper kind={Kind.error} text={error} theme={theme} />}
            {helper && <InputHelper text={helper} theme={theme} />}
        </div>
    );
};
TextField.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TextField, TextFieldType, TextFieldProps };
