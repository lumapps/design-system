import React, { ReactElement, RefObject, useState } from 'react';

import classNames from 'classnames';
import get from 'lodash/get';
import uuid from 'uuid/v4';

import { Icon, Size, Theme } from 'LumX';
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

    /** A ref that will be passed to the wrapper element. */
    textFieldRef?: RefObject<HTMLDivElement>;

    /** A ref that will be passed to the input or text area element. */
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;

    /** Text field value. */
    value: string;

    /** Text field type (input or textarea). */
    type?: TextFieldType;

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
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TextFieldProps> = {
    hasError: false,
    isDisabled: false,
    isValid: false,
    theme: Theme.light,
    type: TextFieldType.input,
};

/////////////////////////////

interface IInputNativeProps {
    id?: string;
    isDisabled?: boolean;
    placeholder?: string;
    type?: TextFieldType;
    value: string;
    inputRef?: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;
    setFocus(focus: boolean): void;
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

    const handleChange = (event: React.ChangeEvent): void => onChange(get(event, 'target.value'));

    if (type === TextFieldType.textarea) {
        return (
            <textarea
                id={id}
                disabled={isDisabled}
                placeholder={placeholder}
                value={value}
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
        className = '',
        hasError,
        helper,
        icon,
        id = uuid(),
        isDisabled,
        isValid,
        label,
        onChange,
        onFocus,
        onBlur,
        placeholder,
        textFieldRef,
        inputRef,
        theme = DEFAULT_PROPS.theme,
        type = DEFAULT_PROPS.type,
        value,
        ...forwardedProps
    } = props;
    const [isFocus, setFocus] = useState(false);

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
            )}
            ref={textFieldRef}
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
                        onBlur,
                        onChange,
                        onFocus,
                        placeholder,
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
