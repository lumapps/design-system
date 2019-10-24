import React, { ReactElement, RefObject, useState } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import uuid from 'uuid/v4';

import { Icon, Size, Theme } from 'LumX';
import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';
import { mdiAlertCircle, mdiCheckCircle } from 'LumX/icons';

/////////////////////////////

enum TextFieldType {
    input = 'input',
    textarea = 'textarea',
}

/**
 * Defines the props of the component.
 */
interface ITextFieldProps extends IGenericProps {
    /** Whether the text field is displayed with error style or not. */
    hasError?: boolean;

    /** Text field helper message. */
    helper?: string;

    /** Text field icon (SVG path). */
    icon?: string;

    /** Id that will be passed to input element. An id is generated (uuid) if no id is provided. */
    id?: string;

    /** Whether the text field is disabled or not. */
    isDisabled?: boolean;

    /** Whether the text field is displayed with valid style or not. */
    isValid?: boolean;

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

    /** Text field value change handler. */
    onChange(value: string): void;
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
    placeholder?: string;
    type?: TextFieldType;
    value: string;
    rows: number;
    setFocus(focus: boolean): void;
    recomputeNumberOfRows(event: React.ChangeEvent): void;
    onChange(value: string): void;
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
        inputRef,
        rows,
        recomputeNumberOfRows,
        ...forwardedProps
    } = props;
    const onFocus = (): void => setFocus(true);
    const onBlur = (): void => setFocus(false);

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
                ref={inputRef as RefObject<HTMLTextAreaElement>}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={handleChange}
                rows={rows}
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
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
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
        className = '',
        hasError,
        helper,
        icon,
        id = uuid(),
        isDisabled,
        isValid,
        label,
        onChange,
        placeholder,
        minimumRows = DEFAULT_PROPS.minimumRows as number,
        inputRef = React.useRef(null),
        theme = DEFAULT_PROPS.theme,
        type = DEFAULT_PROPS.type,
        useCustomColors,
        value,
        ...forwardedProps
    } = props;

    const [isFocus, setFocus] = useState(false);
    const { rows, recomputeNumberOfRows } = useComputeNumberOfRows(minimumRows);

    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    hasError: !isValid && hasError,
                    hasIcon: Boolean(icon),
                    hasInput: type === TextFieldType.input,
                    hasLabel: Boolean(label),
                    hasPlaceholder: Boolean(placeholder),
                    hasTextarea: type === TextFieldType.textarea,
                    hasValue: Boolean(value),
                    isDisabled,
                    isFocus,
                    isValid,
                    prefix: CLASSNAME,
                    theme,
                }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
        >
            {label && (
                <label htmlFor={id} className={`${CLASSNAME}__label`}>
                    {label}
                </label>
            )}

            {helper && <span className={`${CLASSNAME}__helper`}>{helper}</span>}

            <div className={`${CLASSNAME}__input-wrapper`}>
                {icon && (
                    <Icon
                        className={`${CLASSNAME}__input-icon`}
                        color={theme === Theme.dark ? 'light' : undefined}
                        icon={icon}
                        size={Size.xs}
                    />
                )}

                <div className={`${CLASSNAME}__input-native`}>
                    {renderInputNative({
                        id,
                        inputRef,
                        isDisabled,
                        onChange,
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
                        size={Size.xs}
                    />
                )}
            </div>
        </div>
    );
};
TextField.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, TextField, TextFieldType, TextFieldProps };
