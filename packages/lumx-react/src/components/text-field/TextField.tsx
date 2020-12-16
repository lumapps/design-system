import React, { ReactNode, RefObject, SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import { uid } from 'uid';

import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle } from '@lumx/icons';
import { Emphasis, Icon, IconButton, IconButtonProps, InputHelper, InputLabel, Kind, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

/**
 * Defines the props of the component.
 */
export interface TextFieldProps extends GenericProps {
    /** A Chip Group to be rendered before the main text input. */
    chips?: HTMLElement | ReactNode;
    /** The props to pass to the clear button, minus those already set by the TextField props. If not specified, the button won't be displayed. */
    clearButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** The error related to the TextField. */
    error?: string | ReactNode;
    /** Whether we force the focus style or not. */
    forceFocusStyle?: boolean;
    /** Whether the text field is displayed with error style or not. */
    hasError?: boolean;
    /** The helper related to the TextField. */
    helper?: string | ReactNode;
    /** Text field icon (SVG path). */
    icon?: string;
    /** The id that will be passed to input element. An id is generated (uid) if no id is provided. */
    id?: string;
    /** The reference passed to the <input> or <textarea> element. */
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is required or not. */
    isRequired?: boolean;
    /** Whether the text field is displayed with valid style or not. */
    isValid?: boolean;
    /** The label of the text field. */
    label?: string;
    /** The max length the input accepts. If set, a character counter will be displayed. */
    maxLength?: number;
    /** The minimum rows to be displayed (requires multiline to be enabled). */
    minimumRows?: number;
    /** Whether the text field is a textarea or an input. */
    multiline?: boolean;
    /** The native input name property. */
    name?: string;
    /** The placeholder message of the text field. */
    placeholder?: string;
    /** The reference passed to the wrapper. */
    textFieldRef?: RefObject<HTMLDivElement>;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /** The value of the text field. */
    value?: string;
    /** The function called on blur. */
    onBlur?(event: React.FocusEvent): void;
    /** The function called on change. */
    onChange(value: string, name?: string, event?: SyntheticEvent): void;
    /** The function called on focus. */
    onFocus?(event: React.FocusEvent): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}TextField`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The minimum number of rows that we want to display on the text area
 */
const DEFAULT_MIN_ROWS = 2;

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TextFieldProps> = {
    theme: Theme.light,
    type: 'text',
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
     */
    recomputeNumberOfRows(target: Element): void;
} => {
    const [rows, setRows] = useState(minimumRows);

    const recompute = (target: Element) => {
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
        // eslint-disable-next-line no-param-reassign
        (target as HTMLTextAreaElement).rows = minimumRows;
        let currentRows = target.scrollHeight / (target.clientHeight / minimumRows);
        currentRows = currentRows >= minimumRows ? currentRows : minimumRows;
        // eslint-disable-next-line no-param-reassign
        (target as HTMLTextAreaElement).rows = currentRows;

        setRows(currentRows);
    };

    return {
        recomputeNumberOfRows: recompute,
        rows,
    };
};

interface InputNativeProps {
    id?: string;
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;
    isDisabled?: boolean;
    isRequired?: boolean;
    multiline?: boolean;
    maxLength?: number;
    placeholder?: string;
    rows: number;
    type: string;
    name?: string;
    value?: string;
    setFocus(focus: boolean): void;
    recomputeNumberOfRows(target: Element): void;
    onChange(value: string, name?: string, event?: SyntheticEvent): void;
    onFocus?(value: React.FocusEvent): void;
    onBlur?(value: React.FocusEvent): void;
}

const renderInputNative: Comp<InputNativeProps> = (props) => {
    const {
        id,
        isDisabled,
        isRequired,
        placeholder,
        multiline,
        value,
        setFocus,
        onChange,
        onFocus,
        onBlur,
        inputRef,
        rows,
        recomputeNumberOfRows,
        type,
        name,
        ...forwardedProps
    } = props;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ref = useRef<HTMLElement>(null);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // Recompute the number of rows for the first rendering
        if (multiline && ref && ref.current) {
            recomputeNumberOfRows(ref.current);
        }
    }, [ref, multiline, recomputeNumberOfRows, value]);

    const onTextFieldFocus = (event: React.FocusEvent) => {
        onFocus?.(event);
        setFocus(true);
    };

    const onTextFieldBlur = (event: React.FocusEvent) => {
        onBlur?.(event);
        setFocus(false);
    };

    const handleChange = (event: React.ChangeEvent) => {
        onChange(get(event, 'target.value'), name, event);
    };

    const Component = multiline ? 'textarea' : 'input';
    const inputProps: any = {
        ...forwardedProps,
        id,
        placeholder,
        value,
        name,
        disabled: isDisabled,
        required: isRequired,
        onFocus: onTextFieldFocus,
        onBlur: onTextFieldBlur,
        onChange: handleChange,
        ref: mergeRefs(inputRef as any, ref) as any,
    };
    if (multiline) {
        inputProps.rows = rows;
    } else {
        inputProps.type = type;
    }
    return <Component {...inputProps} />;
};

export const TextField: Comp<TextFieldProps> = ({
    chips,
    className,
    clearButtonProps,
    disabled,
    error,
    forceFocusStyle,
    hasError,
    helper,
    icon,
    id,
    inputRef,
    isDisabled = disabled,
    isRequired,
    isValid,
    label,
    maxLength,
    minimumRows,
    multiline,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    textFieldRef,
    theme,
    type,
    useCustomColors,
    value,
    ...forwardedProps
}) => {
    const textFieldId = useMemo(() => id || `text-field-${uid()}`, [id]);
    const [isFocus, setFocus] = useState(false);
    const { rows, recomputeNumberOfRows } = useComputeNumberOfRows(multiline ? minimumRows || DEFAULT_MIN_ROWS : 0);
    const valueLength = (value || '').length;
    const isNotEmpty = valueLength > 0;

    /**
     * Function triggered when the Clear Button is clicked.
     * The idea is to execute the `onChange` callback with an empty string
     * and remove focus from the clear button.
     * @param evt On clear event.
     */
    const onClear = (evt: React.ChangeEvent) => {
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
                    hasInput: !multiline,
                    hasInputClear: clearButtonProps && isNotEmpty,
                    hasLabel: Boolean(label),
                    hasPlaceholder: Boolean(placeholder),
                    hasTextarea: multiline,
                    hasValue: Boolean(value),
                    isDisabled,
                    isFocus: isFocus || forceFocusStyle,
                    isValid,
                    prefix: CLASSNAME,
                    theme,
                }),
                { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
            )}
        >
            {label && (
                <div className={`${CLASSNAME}__header`}>
                    <InputLabel
                        htmlFor={textFieldId}
                        className={`${CLASSNAME}__label`}
                        isRequired={isRequired}
                        theme={theme}
                    >
                        {label}
                    </InputLabel>

                    {maxLength && (
                        <div className={`${CLASSNAME}__char-counter`}>
                            <span>{maxLength - valueLength}</span>
                            {maxLength - valueLength === 0 && <Icon icon={mdiAlertCircle} size={Size.xxs} />}
                        </div>
                    )}
                </div>
            )}

            <div className={`${CLASSNAME}__wrapper`} ref={textFieldRef}>
                {icon && (
                    <Icon
                        className={`${CLASSNAME}__input-icon`}
                        color={theme === Theme.dark ? 'light' : undefined}
                        icon={icon}
                        size={Size.xs}
                    />
                )}

                {chips && <div className={`${CLASSNAME}__chips`}>{chips}</div>}

                <div className={`${CLASSNAME}__input-wrapper`}>
                    <div className={`${CLASSNAME}__input-native`}>
                        {renderInputNative({
                            id: textFieldId,
                            inputRef,
                            isDisabled,
                            isRequired,
                            maxLength,
                            multiline,
                            onBlur,
                            onChange,
                            onFocus,
                            placeholder,
                            recomputeNumberOfRows,
                            rows,
                            setFocus,
                            type,
                            value,
                            name,
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

                    {clearButtonProps && isNotEmpty && (
                        <IconButton
                            {...clearButtonProps}
                            className={`${CLASSNAME}__input-clear`}
                            icon={mdiCloseCircle}
                            emphasis={Emphasis.low}
                            size={Size.s}
                            theme={theme}
                            onClick={onClear}
                            type="button"
                        />
                    )}
                </div>
            </div>
            {hasError && error && (
                <InputHelper className={`${CLASSNAME}__helper`} kind={Kind.error} theme={theme}>
                    {error}
                </InputHelper>
            )}
            {helper && (
                <InputHelper className={`${CLASSNAME}__helper`} theme={theme}>
                    {helper}
                </InputHelper>
            )}
        </div>
    );
};
TextField.displayName = COMPONENT_NAME;
TextField.className = CLASSNAME;
TextField.defaultProps = DEFAULT_PROPS;
