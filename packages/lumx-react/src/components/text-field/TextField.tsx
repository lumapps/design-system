import React, { ReactNode, Ref, RefObject, SyntheticEvent, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';

import { mdiAlertCircle, mdiCheckCircle, mdiCloseCircle } from '@lumx/icons';
import {
    Emphasis,
    Icon,
    IconButton,
    IconButtonProps,
    InputHelper,
    InputLabel,
    InputLabelProps,
    Kind,
    Size,
    Theme,
} from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface TextFieldProps extends GenericProps, HasTheme {
    /** Chip Group to be rendered before the main text input. */
    chips?: ReactNode;
    /** Props to pass to the clear button (minus those already set by the TextField props). If not specified, the button won't be displayed. */
    clearButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis'>;
    /** Error message. */
    error?: string | ReactNode;
    /** Whether we force the focus style or not. */
    forceFocusStyle?: boolean;
    /** Whether the text field is displayed with error style or not. */
    hasError?: boolean;
    /** Additional element to put at the end of the text field. */
    afterElement?: ReactNode;
    /** Helper text. */
    helper?: string | ReactNode;
    /** Icon (SVG path). */
    icon?: string;
    /** Native input id property (generated if not provided to link the label element). */
    id?: string;
    /** Reference to the <input> or <textarea> element. */
    inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is required or not. */
    isRequired?: boolean;
    /** Whether the text field is displayed with valid style or not. */
    isValid?: boolean;
    /** Label text. */
    label?: string;
    /** Additional label props. */
    labelProps?: InputLabelProps;
    /** Max string length the input accepts (constrains the input and displays a character counter). */
    maxLength?: number;
    /** Minimum number of rows displayed in multiline mode (requires `multiline` to be enabled). */
    minimumRows?: number;
    /** Whether the text field is a textarea or an input. */
    multiline?: boolean;
    /** Native input name property. */
    name?: string;
    /** Placeholder text. */
    placeholder?: string;
    /** Reference to the wrapper. */
    textFieldRef?: Ref<HTMLDivElement>;
    /** Native input type (only when `multiline` is disabled). */
    type?: React.ComponentProps<'input'>['type'];
    /** Value. */
    value?: string;
    /** On blur callback. */
    onBlur?(event: React.FocusEvent): void;
    /** On change callback. */
    onChange(value: string, name?: string, event?: SyntheticEvent): void;
    /** On clear callback. */
    onClear?(event?: SyntheticEvent): void;
    /** On focus callback. */
    onFocus?(event: React.FocusEvent): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TextField';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Default minimum number of rows in the multiline mode.
 */
const DEFAULT_MIN_ROWS = 2;

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TextFieldProps> = {
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
    inputRef?: TextFieldProps['inputRef'];
    isDisabled?: boolean;
    isRequired?: boolean;
    multiline?: boolean;
    maxLength?: number;
    placeholder?: string;
    rows: number;
    type: TextFieldProps['type'];
    name?: string;
    value?: string;
    setFocus(focus: boolean): void;
    recomputeNumberOfRows(target: Element): void;
    onChange(value: string, name?: string, event?: SyntheticEvent): void;
    onFocus?(value: React.FocusEvent): void;
    onBlur?(value: React.FocusEvent): void;
    hasError?: boolean;
    describedById?: string;
}

const renderInputNative: React.FC<InputNativeProps> = (props) => {
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
        hasError,
        describedById,
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
        className: multiline
            ? `${CLASSNAME}__input-native ${CLASSNAME}__input-native--textarea`
            : `${CLASSNAME}__input-native ${CLASSNAME}__input-native--text`,
        placeholder,
        value,
        name,
        disabled: isDisabled,
        required: isRequired,
        onFocus: onTextFieldFocus,
        onBlur: onTextFieldBlur,
        onChange: handleChange,
        'aria-invalid': hasError ? 'true' : undefined,
        'aria-describedby': describedById,
        ref: mergeRefs(inputRef as any, ref) as any,
    };
    if (multiline) {
        inputProps.rows = rows;
    } else {
        inputProps.type = type;
    }
    return <Component {...inputProps} />;
};

/**
 * TextField component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TextField = forwardRef<TextFieldProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
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
        inputRef: inputRefProps,
        isDisabled = disabled,
        isRequired,
        isValid,
        label,
        labelProps,
        maxLength,
        minimumRows,
        multiline,
        name,
        onBlur,
        onChange,
        onClear,
        onFocus,
        placeholder,
        textFieldRef,
        theme = defaultTheme,
        type,
        value,
        afterElement,
        ...forwardedProps
    } = props;
    const generatedTextFieldId = useId();
    const textFieldId = id || generatedTextFieldId;
    /** Keep a clean local input ref to manage focus */
    const localInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
    /** Merge prop input ref and local input ref */
    const inputRef = mergeRefs(localInputRef, inputRefProps);
    /**
     * Generate unique ids for both the helper and error texts, in order to
     * later on add them to the input native as aria-describedby. If both the error and the helper are present,
     * we want to first use the most important one, which is the errorId. That way, screen readers will read first
     * the error and then the helper
     */
    const helperId = helper ? `text-field-helper-${generatedTextFieldId}` : undefined;
    const errorId = error ? `text-field-error-${generatedTextFieldId}` : undefined;
    const describedByIds = [errorId, helperId, forwardedProps['aria-describedby']].filter(Boolean);
    const describedById = describedByIds.length === 0 ? undefined : describedByIds.join(' ');

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
    const handleClear = (evt: React.ChangeEvent) => {
        evt.nativeEvent.preventDefault();
        evt.nativeEvent.stopPropagation();
        (evt.currentTarget as HTMLElement).blur();

        onChange('');

        if (onClear) {
            onClear(evt);
        }

        /** Use local inputRef in case the prop input ref is a `mergeRefs` function. */
        const inputElement = localInputRef as RefObject<HTMLInputElement | HTMLTextAreaElement>;

        if (inputElement && inputElement.current) {
            inputElement.current.focus();
        }
    };

    return (
        <div
            ref={ref}
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
            )}
        >
            {(label || maxLength) && (
                <div className={`${CLASSNAME}__header`}>
                    {label && (
                        <InputLabel
                            {...labelProps}
                            htmlFor={textFieldId}
                            className={`${CLASSNAME}__label`}
                            isRequired={isRequired}
                            theme={theme}
                        >
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

                {chips && (
                    <div className={`${CLASSNAME}__chips`}>
                        {chips}

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
                            hasError,
                            describedById,
                            ...forwardedProps,
                        })}
                    </div>
                )}

                {!chips && (
                    <div className={`${CLASSNAME}__input-wrapper`}>
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
                            hasError,
                            describedById,
                            ...forwardedProps,
                        })}
                    </div>
                )}

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
                        onClick={handleClear}
                        type="button"
                    />
                )}

                {afterElement && <div className={`${CLASSNAME}__after-element`}>{afterElement}</div>}
            </div>

            {hasError && error && (
                <InputHelper className={`${CLASSNAME}__helper`} kind={Kind.error} theme={theme} id={errorId}>
                    {error}
                </InputHelper>
            )}

            {helper && (
                <InputHelper className={`${CLASSNAME}__helper`} theme={theme} id={helperId}>
                    {helper}
                </InputHelper>
            )}
        </div>
    );
});
TextField.displayName = COMPONENT_NAME;
TextField.className = CLASSNAME;
TextField.defaultProps = DEFAULT_PROPS;
